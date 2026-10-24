const json = (status, payload) => Response.json(payload, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) return json(503, { error: 'Newsletter signup is not configured yet. Please check back soon.' })
  let email
  try { email = String((await request.formData()).get('email') || '').trim().slice(0, 254) }
  catch { return json(400, { error: 'Please enter a valid email address.' }) }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'Please enter a valid email address.' })

  const response = await fetch('https://api.resend.com/contacts', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false, audience_id: audienceId }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    const reason = String(body.message || body.error || '').toLowerCase()
    if (response.status === 409 || reason.includes('already exists') || reason.includes('already been added')) return json(200, { message: 'This email is already subscribed.' })
    console.error('ConnectX newsletter provider rejected a subscription:', response.status)
    return json(502, { error: 'We could not save your subscription. Please try again later.' })
  }
  return json(200, { message: 'Thanks — your subscription is confirmed.' })
}

export function GET() { return json(405, { error: 'Use POST to subscribe.' }) }
