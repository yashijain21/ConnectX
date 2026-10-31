import { clearSessionCookie, isAdminSession, jsonResponse } from '../../lib/server/admin.js'

export function POST(request) {
  if (!isAdminSession(request)) return jsonResponse(401, { error: 'You are not signed in.' })
  return jsonResponse(200, { message: 'Signed out.' }, { 'Set-Cookie': clearSessionCookie() })
}
