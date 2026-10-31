import { leadsCollection } from '../lib/server/mongodb.js'
import { emailFailure, emailJsConfig, sendOwnerAndCustomer } from '../lib/server/emailjs.js'

const SALES_EMAIL = 'sales@connectx-tech.com'
const MAX_FILE_BYTES = 4 * 1024 * 1024
const allowedExtensions = new Set(['pdf', 'xlsx', 'xls', 'docx', 'doc', 'csv'])
const allowedSolutions = new Set([
  'General enquiry', 'Structured Cabling', 'Active Network & IP',
  'Security & Surveillance', 'Data Center & Critical Power',
  'Smart Building & IoT', 'Power Solutions', 'GPON Solutions',
])
const json = (status, payload) => Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } })
const safeSubject = value => String(value).replace(/[\r\n]+/g, ' ').slice(0, 180)
const safeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export async function POST(request) {
  const mailConfig = emailJsConfig()
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
    attachments.push({
      filename: file.name.replace(/[\r\n]/g, '_').slice(0, 180),
      content: Buffer.from(await file.arrayBuffer()),
    })
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

  if (!mailConfig) {
    try {
      await leads.updateOne({ _id: leadId }, { $set: { notifications: { owner: 'failed', customer: 'failed' } } })
    } catch (error) {
      console.error('Unable to update ConnectX lead email status:', error?.name || 'UnknownError')
    }
    console.error('ConnectX lead notifications are not configured: set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY.')
    return json(202, { message: 'Your enquiry was saved, but email is not configured yet. Please contact sales@connectx-tech.com.' })
  }

  const sharedTemplateParams = {
    customer_name: safeHtml(name),
    company: safeHtml(company),
    role: safeHtml(role || 'Not provided'),
    customer_email: safeHtml(email),
    solution: safeHtml(solution),
    project_details: safeHtml(details),
    attachment_filename: safeHtml(attachments[0]?.filename || 'No file attached'),
  }
  const ownerParams = {
    ...sharedTemplateParams,
    to_email: ownerEmail,
    recipient_name: 'ConnectX Sales',
    reply_to: email,
    email_subject: safeSubject(`Website enquiry: ${solution} — ${company}`),
    intro_message: 'A new project enquiry was submitted through the ConnectX website.',
  }
  const customerParams = {
    ...sharedTemplateParams,
    to_email: email,
    recipient_name: safeHtml(name),
    reply_to: ownerEmail,
    email_subject: 'We received your ConnectX project enquiry',
    intro_message: safeHtml(`Thank you for contacting ConnectX Technologies. We have received your enquiry and shared it with our Sales team at ${ownerEmail}.`),
  }
  const [ownerResult, customerResult] = await sendOwnerAndCustomer(mailConfig, ownerParams, customerParams, attachments[0])
  const ownerSent = ownerResult.status === 'fulfilled'
  const customerSent = customerResult.status === 'fulfilled'
  if (!ownerSent || (ownerResult.status === 'fulfilled' && !ownerResult.value.ok)) {
    console.error('ConnectX lead owner notification failed:', emailFailure(ownerResult))
  }
  if (!customerSent || (customerResult.status === 'fulfilled' && !customerResult.value.ok)) {
    console.error('ConnectX lead customer confirmation failed:', emailFailure(customerResult))
  }
  const ownerDelivered = ownerSent && ownerResult.value.ok
  const customerDelivered = customerSent && customerResult.value.ok
  try {
    await leads.updateOne({ _id: leadId }, { $set: { notifications: { owner: ownerDelivered ? 'sent' : 'failed', customer: customerDelivered ? 'sent' : 'failed' } } })
  } catch (error) {
    console.error('Unable to update ConnectX lead email status:', error?.name || 'UnknownError')
  }
  const message = ownerDelivered && customerDelivered
    ? 'Thank you. Your enquiry was saved and confirmation emails were sent to you and ConnectX Sales.'
    : ownerDelivered
      ? 'Your enquiry was saved and sent to ConnectX Sales, but we could not send your confirmation email.'
      : customerDelivered
        ? 'Your enquiry was saved and a confirmation was emailed to you, but ConnectX Sales could not be notified. Please contact sales@connectx-tech.com.'
        : 'Your enquiry was saved, but email notifications could not be sent. Please contact sales@connectx-tech.com.'
  return json(202, { message })
}

export function GET() { return json(405, { error: 'Use POST to submit an enquiry.' }) }
