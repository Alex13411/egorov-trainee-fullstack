const PREFIX = '[KAIROS]'
const MAX_HUD_LINES = 14

let hudEl: HTMLPreElement | null = null
const hudLines: string[] = []

function pushHud(line: string): void {
  const stamp = new Date().toLocaleTimeString()
  hudLines.unshift(`${stamp} ${line}`)
  hudLines.length = MAX_HUD_LINES

  if (!hudEl) return
  hudEl.textContent = hudLines.join('\n')
}

export function log(...args: unknown[]): void {
  console.log(PREFIX, ...args)
  pushHud(formatHudLine('log', args))
}

export function warn(...args: unknown[]): void {
  console.warn(PREFIX, ...args)
  pushHud(formatHudLine('warn', args))
}

export function error(...args: unknown[]): void {
  console.error(PREFIX, ...args)
  pushHud(formatHudLine('err', args))
}

function formatHudLine(level: string, args: unknown[]): string {
  const text = args
    .map((value) => {
      if (typeof value === 'string') return value
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    })
    .join(' ')

  return `[${level}] ${text}`
}

export function mountDebugHud(): void {
  if (hudEl || document.getElementById('kairos-debug-hud')) return

  hudEl = document.createElement('pre')
  hudEl.id = 'kairos-debug-hud'
  hudEl.setAttribute('aria-live', 'polite')
  hudEl.textContent = 'KAIROS debug HUD ready'
  document.body.appendChild(hudEl)
  log('debug HUD mounted')
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
  const phases = ['pointerdown', 'mousedown', 'click'] as const

  for (const phase of phases) {
    document.addEventListener(
      phase,
      (event) => {
        log(`document ${phase}`, {
          x: event.clientX,
          y: event.clientY,
          type: event.type,
          defaultPrevented: event.defaultPrevented,
        })
        logClickTarget(event.clientX, event.clientY, phase)
      },
      true,
    )
  }

  log('global pointer diagnostics bound')
}
