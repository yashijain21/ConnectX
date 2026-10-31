import { leadsCollection } from '../lib/server/mongodb.js'

const SALES_EMAIL = 'sales@connectx-tech.com'
const MAX_FILE_BYTES = 4 * 1024 * 1024
const allowedExtensions = new Set(['pdf', 'xlsx', 'xls', 'docx', 'doc', 'csv'])
const allowedSolutions = new Set([
  'General enquiry', 'Structured Cabling', 'Active Network & IP',
  'Security & Surveillance', 'Data Center & Critical Power',
  'Smart Building & IoT', 'Power Solutions', 'GPON Solutions',
])
const json = (status, payload) => Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } })
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const safeSubject = value => String(value).replace(/[\r\n]+/g, ' ').slice(0, 180)

async function emailFailure(result) {
  if (result.status === 'rejected') return result.reason?.message || result.reason?.name || 'NetworkError'
  try {
    const body = await result.value.clone().json()
    const message = typeof body.message === 'string' ? body.message : ''
    const name = typeof body.name === 'string' ? body.name : ''
    if (message || name) return [name, message].filter(Boolean).join(': ').replace(/[\r\n]+/g, ' ').slice(0, 400)
  } catch {
    return `HTTP ${result.value.status}; provider did not return JSON error details`
  }
  return `HTTP ${result.value.status}`
}

async function sendEmail(apiKey, message) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })
}

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) return json(503, { error: 'The enquiry service is not configured yet. Please email sales@connectx-tech.com.' })
  if (Number(request.headers.get('content-length') || 0) > MAX_FILE_BYTES + 128 * 1024) return json(413, { error: 'The upload is too large. BOQ files must be 4 MB or smaller.' })

  let form
  try { form = await request.formData() } catch { return json(400, { error: 'We could not read this enquiry. Please check the form and try again.' }) }
  if (String(form.get('website') || '').trim()) return json(202, { message: 'Your enquiry has been received.' })

  const name = String(form.get('name') || '').trim().slice(0, 160)
  const company = String(form.get('company') || '').trim().slice(0, 180)
  const email = String(form.get('email') || '').trim().slice(0, 254)
  const role = String(form.get('role') || '').trim().slice(0, 160)
  const solution = String(form.get('solution') || '').trim().slice(0, 160)
  const details = String(form.get('project_details') || '').trim().slice(0, 12000)
  if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !allowedSolutions.has(solution) || !details) return json(400, { error: 'Please complete all required fields with a valid work email.' })

  const file = form.get('boq_file')
  const attachments = []
  if (file instanceof File && file.size > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.has(extension)) return json(400, { error: 'Attach a PDF, XLSX, XLS, DOCX, DOC or CSV file.' })
    if (file.size > MAX_FILE_BYTES) return json(413, { error: 'BOQ files must be 4 MB or smaller.' })
    attachments.push({ filename: file.name.replace(/[\r\n]/g, '_').slice(0, 180), content: Buffer.from(await file.arrayBuffer()).toString('base64') })
  }

  const ownerEmail = process.env.OWNER_EMAIL || SALES_EMAIL
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) return json(503, { error: 'The enquiry service owner email is not configured correctly.' })

  let leads
  try { leads = await leadsCollection() }
  catch (error) {
    console.error('Unable to connect to the ConnectX lead database:', error?.name || 'UnknownError')
    return json(503, { error: 'The enquiry service is temporarily unavailable. Please try again later.' })
  }

  const lead = {
    name, company, email, role, solution, details,
    attachment: file instanceof File && file.size > 0 ? { filename: file.name.replace(/[\r\n]/g, '_').slice(0, 180), size: file.size } : null,
    createdAt: new Date(),
    notifications: { owner: 'pending', customer: 'pending' },
  }
  let leadId
  try { leadId = (await leads.insertOne(lead)).insertedId }
  catch (error) {
    console.error('Unable to save a ConnectX lead:', error?.name || 'UnknownError')
    return json(503, { error: 'We could not save your enquiry. Please try again later.' })
  }

  const safeName = escapeHtml(name), safeCompany = escapeHtml(company), safeRole = escapeHtml(role)
  const safeSolution = escapeHtml(solution), safeEmail = escapeHtml(email), safeDetails = escapeHtml(details).replace(/\n/g, '<br>')
  const [ownerResult, customerResult] = await Promise.allSettled([
    sendEmail(apiKey, {
      from, to: [ownerEmail], reply_to: email, subject: safeSubject(`Website enquiry: ${solution} — ${company}`),
      html: `<h2>New ConnectX website enquiry</h2><p><b>Name:</b> ${safeName}</p><p><b>Company:</b> ${safeCompany}</p><p><b>Role:</b> ${safeRole || 'Not provided'}</p><p><b>Email:</b> ${safeEmail}</p><p><b>Solution:</b> ${safeSolution}</p><p><b>Project details:</b><br>${safeDetails}</p>`,
      attachments,
    }),
    sendEmail(apiKey, {
      from, to: [email], reply_to: ownerEmail, subject: 'We received your ConnectX project enquiry',
      text: `Hello ${name},\n\nThank you for contacting ConnectX Technologies. We have received your project enquiry and shared it with our Sales team.\n\nConnectX Technologies\n${ownerEmail}`,
      html: `<p>Hello ${safeName},</p><p>Thank you for contacting ConnectX Technologies. We have received your project enquiry and shared it with our Sales team.</p><p>ConnectX Technologies<br><a href="mailto:${ownerEmail}">${escapeHtml(ownerEmail)}</a></p>`,
    }),
  ])
  const ownerSent = ownerResult.status === 'fulfilled' && ownerResult.value.ok
  const customerSent = customerResult.status === 'fulfilled' && customerResult.value.ok
  if (!ownerSent) console.error('ConnectX lead owner notification failed:', await emailFailure(ownerResult))
  if (!customerSent) console.error('ConnectX lead customer confirmation failed:', await emailFailure(customerResult))
  try {
    await leads.updateOne({ _id: leadId }, { $set: { notifications: { owner: ownerSent ? 'sent' : 'failed', customer: customerSent ? 'sent' : 'failed' } } })
  } catch (error) {
    console.error('Unable to update ConnectX lead email status:', error?.name || 'UnknownError')
  }
  const message = ownerSent && customerSent
    ? 'Thank you. Your enquiry was saved and confirmation emails were sent to you and ConnectX Sales.'
    : ownerSent
      ? 'Your enquiry was saved and sent to ConnectX Sales, but we could not send your confirmation email.'
      : customerSent
        ? 'Your enquiry was saved and a confirmation was emailed to you, but ConnectX Sales could not be notified. Please contact sales@connectx-tech.com.'
        : 'Your enquiry was saved, but email notifications could not be sent. Please contact sales@connectx-tech.com.'
  return json(202, { message })
}

export function GET() { return json(405, { error: 'Use POST to submit an enquiry.' }) }
