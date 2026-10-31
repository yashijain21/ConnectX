import { createHash, randomUUID } from 'node:crypto'

const BOQ_FOLDER = 'connectx/boq'

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null
}

function safeFileName(filename) {
  const cleaned = String(filename || 'project-file').replace(/[\\/\0-\x1f\x7f]/g, '_').replace(/[^A-Za-z0-9._-]/g, '_').replace(/_+/g, '_').slice(0, 140)
  return cleaned || 'project-file'
}

export async function uploadBoqFile(file) {
  const config = cloudinaryConfig()
  if (!config) throw new Error('Cloudinary is not configured.')

  const timestamp = Math.floor(Date.now() / 1000)
  const extension = String(file.name || '').split('.').pop()?.toLowerCase()
  // Cloudinary delivers PDFs as image resources; other BOQ formats remain raw files.
  const resourceType = extension === 'pdf' ? 'image' : 'raw'
  const publicId = `${randomUUID()}-${safeFileName(file.name)}`
  const signedParams = { folder: BOQ_FOLDER, public_id: publicId, timestamp: String(timestamp) }
  const signaturePayload = Object.entries(signedParams)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const signature = createHash('sha1').update(`${signaturePayload}${config.apiSecret}`).digest('hex')

  const body = new FormData()
  body.set('file', new Blob([Buffer.from(await file.arrayBuffer())], { type: file.type || 'application/octet-stream' }), file.name)
  body.set('api_key', config.apiKey)
  body.set('timestamp', String(timestamp))
  body.set('folder', BOQ_FOLDER)
  body.set('public_id', publicId)
  body.set('signature', signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/${resourceType}/upload`, {
    method: 'POST',
    body,
  })
  let result
  try { result = await response.json() } catch { result = null }
  if (!response.ok || !result?.secure_url || !result?.public_id) {
    const cloudError = result?.error?.message
    throw new Error(`Cloudinary upload failed (HTTP ${response.status}${cloudError ? `: ${cloudError}` : ''}).`)
  }

  return {
    filename: safeFileName(file.name),
    size: Number(result.bytes) || file.size,
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type || resourceType,
    uploadedAt: new Date(),
  }
}

