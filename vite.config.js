import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { POST as quotePost, GET as quoteGet } from './api/quote.js'
import { POST as newsletterPost, GET as newsletterGet } from './api/newsletter.js'

const localApiRoutes = {
  '/api/quote': { POST: quotePost, GET: quoteGet },
  '/api/newsletter': { POST: newsletterPost, GET: newsletterGet },
}

const localServerEnvVars = [
  'MONGODB_URI',
  'MONGODB_DATABASE',
  'OWNER_EMAIL',
  'EMAILJS_SERVICE_ID',
  'EMAILJS_TEMPLATE_ID',
  'EMAILJS_PUBLIC_KEY',
  'EMAILJS_PRIVATE_KEY',
  'EMAILJS_SOURCE_ORIGIN',
  'RESEND_API_KEY',
  'RESEND_AUDIENCE_ID',
]

function localApiPlugin() {
  return {
    name: 'connectx-local-api',
    configureServer(server) {
      const localEnv = loadEnv(server.config.mode, process.cwd(), '')
      for (const name of localServerEnvVars) {
        if (!process.env[name] && localEnv[name]) process.env[name] = localEnv[name]
      }
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url || '/', 'http://localhost').pathname
        const route = localApiRoutes[pathname]
        if (!route) return next()

        const handler = route[req.method || '']
        if (!handler) {
          res.statusCode = 405
          res.setHeader('Allow', 'GET, POST')
          res.end(JSON.stringify({ error: 'Method not allowed.' }))
          return
        }

        try {
          const chunks = []
          let size = 0
          for await (const chunk of req) {
            size += chunk.length
            if (size > 4.25 * 1024 * 1024) {
              res.statusCode = 413
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Request too large. BOQ files must be 4 MB or smaller.' }))
              return
            }
            chunks.push(chunk)
          }
          const headers = new Headers()
          for (const [name, value] of Object.entries(req.headers)) {
            if (value && !['host', 'content-length', 'connection', 'transfer-encoding'].includes(name.toLowerCase())) {
              headers.set(name, Array.isArray(value) ? value.join(', ') : value)
            }
          }
          const body = chunks.length ? Buffer.concat(chunks) : undefined
          const request = new Request(new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`), {
            method: req.method,
            headers,
            ...(body ? { body, duplex: 'half' } : {}),
          })
          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, name) => res.setHeader(name, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.config.logger.error(`[connectx-local-api] ${error.stack || error}`)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Local API request failed.' }))
        }
      })
    },
  }
}

export default defineConfig({ plugins: [react(), tailwindcss(), localApiPlugin()] })
