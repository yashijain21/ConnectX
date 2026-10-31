export { POST } from '../../lib/server/admin.js'

export function GET() {
  return Response.json({ error: 'Use POST to sign in.' }, { status: 405, headers: { 'Cache-Control': 'no-store' } })
}
