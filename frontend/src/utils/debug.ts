const PREFIX = '[KAIROS]'
const TERMINAL_LOG_URL = '/__kairos-log'
let pointerDiagnosticsBound = false

function formatArg(value: unknown): string {
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function sendToTerminal(level: 'log' | 'warn' | 'error', args: unknown[]): void {
  if (!import.meta.env.DEV) return

  void fetch(TERMINAL_LOG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level,
      args: args.map(formatArg),
      time: new Date().toLocaleTimeString(),
    }),
    keepalive: true,
  }).catch(() => {
    // Terminal logger unavailable outside Vite dev server.
  })
}

export function log(...args: unknown[]): void {
  console.log(PREFIX, ...args)
  sendToTerminal('log', args)
}

export function warn(...args: unknown[]): void {
  console.warn(PREFIX, ...args)
  sendToTerminal('warn', args)
}

export function error(...args: unknown[]): void {
  console.error(PREFIX, ...args)
  sendToTerminal('error', args)
}

export function logClickTarget(x: number, y: number, phase = 'click'): void {
  const target = document.elementFromPoint(x, y)
  if (!target) {
    warn(`${phase}: no element at point`, { x, y })
    return
  }

  const info = {
    phase,
    x,
    y,
    tag: target.tagName,
    id: target.id || null,
    className: target.className || null,
    dataAction: target instanceof HTMLElement ? target.dataset.action ?? null : null,
    pointerEvents: getComputedStyle(target).pointerEvents,
    zIndex: getComputedStyle(target).zIndex,
  }

  log(`${phase} target:`, info)

  let node: Element | null = target
  const stack: string[] = []
  while (node && stack.length < 8) {
    const name = `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${node.className ? `.${String(node.className).trim().split(/\s+/).join('.')}` : ''}`
    stack.push(name)
    node = node.parentElement
  }
  log(`${phase} stack:`, stack.join(' > '))
}

export function logOverlayAudit(): void {
  const blockers = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter((el) => {
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden') return false
    if (style.pointerEvents === 'none') return false
    if (style.position !== 'fixed' && style.position !== 'absolute') return false

    const rect = el.getBoundingClientRect()
    const coversCenter =
      rect.width >= window.innerWidth * 0.9 &&
      rect.height >= window.innerHeight * 0.9 &&
      rect.top <= 50 &&
      rect.left <= 50

    return coversCenter
  })

  log('overlay audit:', blockers.map((el) => ({
    tag: el.tagName,
    className: el.className,
    id: el.id,
    zIndex: getComputedStyle(el).zIndex,
  })))
}

export function bindGlobalPointerDiagnostics(): void {
  if (pointerDiagnosticsBound) return
  pointerDiagnosticsBound = true

  document.addEventListener(
    'click',
    (event) => {
      log('click', {
        x: event.clientX,
        y: event.clientY,
        defaultPrevented: event.defaultPrevented,
      })
      logClickTarget(event.clientX, event.clientY, 'click')
    },
    true,
  )

  log('pointer diagnostics bound (terminal + browser console)')
}
