const SALES_EMAIL = 'sales@connectx-tech.com'
const MAX_FILE_BYTES = 4 * 1024 * 1024
const allowedExtensions = new Set(['pdf', 'xlsx', 'xls', 'docx', 'doc', 'csv'])
const json = (status, payload) => Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } })
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

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
  if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !solution || !details) return json(400, { error: 'Please complete all required fields with a valid work email.' })

  const file = form.get('boq_file')
  const attachments = []
  if (file instanceof File && file.size > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.has(extension)) return json(400, { error: 'Attach a PDF, XLSX, XLS, DOCX, DOC or CSV file.' })
    if (file.size > MAX_FILE_BYTES) return json(413, { error: 'BOQ files must be 4 MB or smaller.' })
    attachments.push({ filename: file.name.replace(/[\r\n]/g, '_').slice(0, 180), content: Buffer.from(await file.arrayBuffer()).toString('base64') })
  }

  const safeName = escapeHtml(name), safeCompany = escapeHtml(company), safeRole = escapeHtml(role)
  const safeSolution = escapeHtml(solution), safeEmail = escapeHtml(email), safeDetails = escapeHtml(details).replace(/\n/g, '<br>')
  const internal = await sendEmail(apiKey, {
    from, to: [SALES_EMAIL], reply_to: email, subject: `Website enquiry: ${solution} — ${company}`,
    html: `<h2>New ConnectX website enquiry</h2><p><b>Name:</b> ${safeName}</p><p><b>Company:</b> ${safeCompany}</p><p><b>Role:</b> ${safeRole || 'Not provided'}</p><p><b>Email:</b> ${safeEmail}</p><p><b>Solution:</b> ${safeSolution}</p><p><b>Project details:</b><br>${safeDetails}</p>`,
    attachments,
  })
  if (!internal.ok) {
    console.error('ConnectX quote email provider rejected the sales message:', internal.status)
    return json(502, { error: 'We could not send your enquiry. Please email sales@connectx-tech.com.' })
  }

  const acknowledgement = await sendEmail(apiKey, {
    from, to: [email], reply_to: SALES_EMAIL, subject: 'We received your ConnectX project enquiry',
    text: `Hello ${name},\n\nThank you for contacting ConnectX Technologies. We have received your project enquiry and shared it with our Sales team.\n\nConnectX Technologies\n${SALES_EMAIL}`,
    html: `<p>Hello ${safeName},</p><p>Thank you for contacting ConnectX Technologies. We have received your project enquiry and shared it with our Sales team.</p><p>ConnectX Technologies<br><a href="mailto:${SALES_EMAIL}">${SALES_EMAIL}</a></p>`,
  })
  if (!acknowledgement.ok) console.error('ConnectX enquiry was delivered to Sales, but its acknowledgement email failed:', acknowledgement.status)
  return json(202, { message: acknowledgement.ok
    ? 'Thank you. Your enquiry has been sent to ConnectX Sales; a confirmation email is on its way.'
    : 'Your enquiry has been sent to ConnectX Sales, but we could not send the confirmation email. Please contact Sales if you need a copy.' })
}

export function GET() { return json(405, { error: 'Use POST to submit an enquiry.' }) }
