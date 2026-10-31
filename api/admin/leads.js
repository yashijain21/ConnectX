import { isAdminSession, jsonResponse } from '../../lib/server/admin.js'
import { leadsCollection } from '../../lib/server/mongodb.js'

const PAGE_SIZE = 50

export async function GET(request) {
  if (!isAdminSession(request)) return jsonResponse(401, { error: 'Please sign in to view leads.' })
  const requestedPage = Number(new URL(request.url).searchParams.get('page') || 1)
  const requested = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  try {
    const leads = await leadsCollection()
    const total = await leads.countDocuments()
    const page = Math.min(requested, Math.max(1, Math.ceil(total / PAGE_SIZE)))
    const items = await leads.find({}, {
      projection: {
        name: 1, company: 1, email: 1, role: 1, solution: 1,
        details: 1, attachment: 1, createdAt: 1, notifications: 1,
      },
    }).sort({ createdAt: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray()
    return jsonResponse(200, {
      leads: items.map(({ _id, ...lead }) => ({ id: _id.toString(), ...lead })),
      page,
      pageSize: PAGE_SIZE,
      total,
    })
  } catch (error) {
    console.error('Unable to retrieve ConnectX leads:', error?.name || 'UnknownError')
    return jsonResponse(503, { error: 'Leads are temporarily unavailable. Please try again.' })
  }
}
