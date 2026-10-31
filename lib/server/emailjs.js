const EMAILJS_SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send-form'

export function emailJsConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim()
  const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim()
  const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim()
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim()
  if (!serviceId || !templateId || !publicKey) return null
  return { serviceId, templateId, publicKey, privateKey }
}

export async function sendEmailJs(config, params, attachment) {
  const form = new FormData()
  form.set('service_id', config.serviceId)
  form.set('template_id', config.templateId)
  form.set('user_id', config.publicKey)
  if (config.privateKey) form.set('accessToken', config.privateKey)
  for (const [key, value] of Object.entries(params)) form.set(key, value)
  if (attachment) form.set('boq_file', new Blob([attachment.content]), attachment.filename)

  const response = await fetch(EMAILJS_SEND_URL, { method: 'POST', body: form })
  if (response.ok) return { ok: true, status: response.status }
  const responseText = (await response.text()).replace(/[\r\n]+/g, ' ').slice(0, 400)
  return { ok: false, status: response.status, error: responseText || `HTTP ${response.status}` }
}

export function emailFailure(result) {
  if (result.status === 'rejected') return result.reason?.message || result.reason?.name || 'NetworkError'
  return result.value.error || `HTTP ${result.value.status}`
}

export async function sendOwnerAndCustomer(config, ownerParams, customerParams, attachment) {
  const [ownerResult] = await Promise.allSettled([sendEmailJs(config, ownerParams, attachment)])
  await new Promise(resolve => setTimeout(resolve, 1100))
  const [customerResult] = await Promise.allSettled([sendEmailJs(config, customerParams, attachment)])
  return [ownerResult, customerResult]
}
