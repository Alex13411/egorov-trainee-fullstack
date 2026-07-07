import type { IncomingMessage } from 'node:http'
import { defineConfig, type Plugin } from 'vite'

type LogPayload = {
  level: 'log' | 'warn' | 'error'
  args: string[]
  time: string
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function kairosTerminalLogger(): Plugin {
  return {
    name: 'kairos-terminal-logger',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/__kairos-log' || req.method !== 'POST') {
          next()
          return
        }

        try {
          const body = await readRequestBody(req)
          const payload = JSON.parse(body) as LogPayload
          const message = payload.args.join(' ')
          const line = `[KAIROS ${payload.time}] ${message}`

          if (payload.level === 'error') {
            console.error(line)
          } else if (payload.level === 'warn') {
            console.warn(line)
          } else {
            console.log(line)
          }

          res.statusCode = 204
          res.end()
        } catch {
          res.statusCode = 400
          res.end('Bad Request')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [kairosTerminalLogger()],
  server: {
    port: 5173,
    strictPort: true,
    // Disable HMR eval — required for browsers with strict CSP (Cursor preview, etc.)
    hmr: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
