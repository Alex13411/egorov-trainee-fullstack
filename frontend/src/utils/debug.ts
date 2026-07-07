const PREFIX = '[KAIROS]'

export function log(...args: unknown[]): void {
  console.log(PREFIX, ...args)
}

export function warn(...args: unknown[]): void {
  console.warn(PREFIX, ...args)
}

export function error(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}

export function logClickTarget(x: number, y: number): void {
  const target = document.elementFromPoint(x, y)
  if (!target) {
    warn('click: no element at point', { x, y })
    return
  }

  const info = {
    x,
    y,
    tag: target.tagName,
    id: target.id || null,
    className: target.className || null,
    dataAction: target instanceof HTMLElement ? target.dataset.action ?? null : null,
    pointerEvents: getComputedStyle(target).pointerEvents,
    zIndex: getComputedStyle(target).zIndex,
  }

  log('click target:', info)

  let node: Element | null = target
  const stack: string[] = []
  while (node && stack.length < 8) {
    const name = `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${node.className ? `.${String(node.className).trim().split(/\s+/).join('.')}` : ''}`
    stack.push(name)
    node = node.parentElement
  }
  log('click stack:', stack.join(' > '))
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
