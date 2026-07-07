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

export function setAuthTab(root: HTMLElement, tab: 'login' | 'signup'): void {
  const card = root.querySelector('.banking-card')
  if (!card) return

  const isSignup = tab === 'signup'
  card.classList.toggle('banking-card--signup', isSignup)

  const signupField = root.querySelector<HTMLElement>('.field--signup-only')
  if (signupField) signupField.hidden = !isSignup

  const submit = root.querySelector<HTMLButtonElement>('.banking-card__submit')
  if (submit) {
    submit.textContent = isSignup ? 'Sign up' : 'Log in'
  }

  root.querySelectorAll<HTMLButtonElement>('.banking-card__tab').forEach((button) => {
    button.classList.toggle('banking-card__tab--active', button.dataset.tab === tab)
  })
}
