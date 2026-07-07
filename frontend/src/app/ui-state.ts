function getPageRoot(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>('.page') ?? root
}

export function setMobileMenuOpen(root: HTMLElement, open: boolean): void {
  const page = getPageRoot(root)
  const menu = root.querySelector<HTMLElement>('[data-mobile-menu]')
  const backdrop = root.querySelector<HTMLElement>('.mobile-menu__backdrop')
  page.classList.toggle('page--menu-open', open)
  if (menu) {
    menu.hidden = !open
    menu.setAttribute('aria-hidden', open ? 'false' : 'true')
  }
  if (backdrop) {
    backdrop.hidden = !open
  }
}

export function isMobileMenuOpen(root: HTMLElement): boolean {
  return getPageRoot(root).classList.contains('page--menu-open')
}

export function setBankingTab(root: HTMLElement, tab: 'personal' | 'business'): void {
  const card = root.querySelector('.banking-card')
  if (!card) return

  card.classList.toggle('banking-card--business', tab === 'business')

  root.querySelectorAll<HTMLElement>('[data-banking-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.bankingPanel !== tab
  })

  root.querySelectorAll<HTMLButtonElement>('.banking-card__tab').forEach((button) => {
    button.classList.toggle('banking-card__tab--active', button.dataset.tab === tab)
  })
}

export function setCryptoDropdownOpen(root: HTMLElement, open: boolean): void {
  const dropdown = root.querySelector<HTMLElement>('[data-crypto-dropdown]')
  const trigger = root.querySelector<HTMLButtonElement>('[data-action="toggle-crypto-dropdown"]')
  const panel = root.querySelector<HTMLElement>('.crypto-orbit__dropdown-panel')
  if (!dropdown || !trigger || !panel) return

  dropdown.classList.toggle('is-open', open)
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false')
  panel.hidden = !open
}

export function isCryptoDropdownOpen(root: HTMLElement): boolean {
  return root.querySelector('[data-crypto-dropdown]')?.classList.contains('is-open') ?? false
}
