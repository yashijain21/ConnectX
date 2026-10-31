import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'connectx_admin_session'
const SESSION_SECONDS = 8 * 60 * 60
const json = (status, payload, headers = {}) => Response.json(payload, {
  status,
  headers: { 'Cache-Control': 'no-store', ...headers },
})

function credentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 12 || !secret || secret.length < 32) return null
  return { email, password, secret }
}

function equalSecret(left, right) {
  const a = createHash('sha256').update(left).digest()
  const b = createHash('sha256').update(right).digest()
  return timingSafeEqual(a, b)
}

function sign(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function cookieOptions(maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

export function jsonResponse(status, payload, headers) {
  return json(status, payload, headers)
}

export function sessionCookie(email) {
  const config = credentials()
  if (!config) throw new Error('Admin authentication is not configured.')
  const payload = Buffer.from(JSON.stringify({
    email,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  })).toString('base64url')
  const token = `${payload}.${sign(payload, config.secret)}`
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`
}

export function clearSessionCookie() {
  return cookieOptions(0)
}

export function isAdminSession(request) {
  const config = credentials()
  if (!config) return false
  const cookie = request.headers.get('cookie') || ''
  const token = cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1)
  if (!token) return false
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return false
  if (!equalSecret(sign(payload, config.secret), signature)) return false
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return session.email === config.email && Number.isInteger(session.expiresAt) && session.expiresAt > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export async function POST(request) {
  const config = credentials()
  if (!config) return json(503, { error: 'Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.' })

  let submitted
  try {
    if (Number(request.headers.get('content-length') || 0) > 4096) return json(413, { error: 'Login request is too large.' })
    submitted = await request.json()
  } catch {
    return json(400, { error: 'Submit the admin email and password as JSON.' })
  }
  if (!submitted || typeof submitted !== 'object' || Array.isArray(submitted)) return json(400, { error: 'Submit the admin email and password as JSON.' })
  const email = String(submitted.email || '').trim().toLowerCase()
  const password = String(submitted.password || '')
  if (!equalSecret(email, config.email) || !equalSecret(password, config.password)) {
    return json(401, { error: 'Email or password is incorrect.' })
  }

  return json(200, { message: 'Signed in.' }, { 'Set-Cookie': sessionCookie(config.email) })
}
