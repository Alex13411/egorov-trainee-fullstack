import { logout, resolveAuthUser, startGoogleLogin, type AuthUser } from './services/auth'
import {
  CryptoPriceStream,
  formatChange,
  formatPrice,
  type CryptoTicker,
} from './services/crypto'
import { CTA_ARROW_ICON, FIGMA_COPY, VIDEO_ICON } from './content/figma'
import { error, log, logOverlayAudit, bindGlobalPointerDiagnostics, warn } from './utils/debug'
import './styles/main.css'

log('main.ts loaded')

const NAV_ITEMS = [
  { label: 'HOME', section: 'home' },
  { label: 'ABOUT US', section: 'about' },
  { label: 'PRODUCTS', section: 'products' },
  { label: 'CONTACT US', section: 'contact' },
] as const
type ModalId = 'learn-more' | 'video'

let eventsBound = false

const LOGO_MARK = `
  <svg class="logo__mark" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
    <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M14 8L20 14L14 20L8 14L14 8Z" fill="currentColor"/>
  </svg>
`

function renderCryptoOrbit(tickers: CryptoTicker[]): string {
  if (!tickers.length) {
    return '<p class="crypto-orbit__loading">Loading live prices…</p>'
  }

  return tickers
    .map(
      (ticker, index) => `
      <article class="crypto-orbit__item crypto-orbit__item--${index}">
        <span class="crypto-orbit__pair">${ticker.label}</span>
        <strong class="crypto-orbit__price">${formatPrice(ticker.price)}</strong>
        <span class="crypto-orbit__change crypto-orbit__change--${
          ticker.changePercent >= 0 ? 'up' : 'down'
        }">${formatChange(ticker.changePercent)}</span>
      </article>
    `,
    )
    .join('')
}

function renderAuthButton(user: AuthUser | null): string {
  if (user) {
    return `
    <div class="auth auth--signed-in">
      ${
        user.picture
          ? `<img class="auth__avatar" src="${user.picture}" alt="${user.name}" width="32" height="32" />`
          : ''
      }
      <span class="auth__name">${user.name}</span>
      <button class="auth__logout" type="button" data-action="logout">Sign out</button>
    </div>
  `
  }

  return `
    <button class="auth auth--google" type="button" data-action="google-login">
      <svg class="auth__icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
      </svg>
      Sign in with Google
    </button>
  `
}

function renderModals(): string {
  return `
    <div class="modal" data-modal="learn-more" aria-hidden="true">
      <div class="modal__backdrop" data-action="close-modal"></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="learn-more-title">
        <button class="modal__close" type="button" data-action="close-modal" aria-label="Close">×</button>
        <h2 class="modal__title" id="learn-more-title">${FIGMA_COPY.modalLearnMoreTitle}</h2>
        <p class="modal__text">
          ${FIGMA_COPY.modalLearnMoreBody}
        </p>
        <button class="modal__action" type="button" data-action="close-modal">${FIGMA_COPY.modalLearnMoreAction}</button>
      </div>
    </div>

    <div class="modal modal--video" data-modal="video" aria-hidden="true">
      <div class="modal__backdrop" data-action="close-modal"></div>
      <div class="modal__dialog modal__dialog--video" role="dialog" aria-modal="true" aria-labelledby="video-title">
        <button class="modal__close" type="button" data-action="close-modal" aria-label="Close">×</button>
        <h2 class="modal__title modal__title--compact" id="video-title">${FIGMA_COPY.modalVideoTitle}</h2>
        <div class="modal__video-wrap">
          <video class="modal__video" controls playsinline preload="metadata">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  `
}

function renderPage(user: AuthUser | null): string {
  return `
    <div class="page">
      <header class="header">
        <div class="container header__inner">
          <a class="logo" href="#home" data-section="home" aria-label="Kairos home">
            ${LOGO_MARK}
            <span class="logo__text">KAIROS</span>
          </a>

          <nav class="nav" aria-label="Main navigation">
            ${NAV_ITEMS.map((item) => `<a class="nav__link" href="#${item.section}" data-section="${item.section}">${item.label}</a>`).join('')}
          </nav>

          <div class="header__actions">
            ${renderAuthButton(user)}
            <button class="burger" type="button" aria-label="Open menu" data-action="toggle-menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <button class="mobile-menu__backdrop" type="button" data-action="close-menu" aria-label="Close menu" hidden></button>

      <aside class="mobile-menu" data-mobile-menu hidden aria-label="Mobile navigation">
        <nav class="mobile-menu__nav">
          ${NAV_ITEMS.map((item) => `<a class="mobile-menu__link" href="#${item.section}" data-section="${item.section}">${item.label}</a>`).join('')}
          ${user
            ? `<div class="mobile-menu__user">${user.picture ? `<img class="auth__avatar" src="${user.picture}" alt="" width="32" height="32" />` : ''}<span>${user.name}</span><button class="mobile-menu__auth" type="button" data-action="logout">Sign out</button></div>`
            : '<button class="mobile-menu__auth" type="button" data-action="google-login">Sign in with Google</button>'}
        </nav>
      </aside>

      <main class="hero" id="home" aria-label="Hero">
        <div class="hero__media" aria-hidden="true">
          <video class="hero__video" autoplay muted loop playsinline preload="auto">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div class="hero__overlay"></div>
        </div>

        <div class="container hero__layout">
          <div class="hero__content">
            <h1 class="hero__title">
              ${FIGMA_COPY.heroTitle.map((line) => `<span>${line}</span>`).join('')}
            </h1>
            <p class="hero__subtitle">${FIGMA_COPY.heroSubtitle}</p>
            <div class="hero__actions">
              <button class="hero__cta" type="button" data-action="open-modal" data-modal-target="learn-more">
                <span>${FIGMA_COPY.ctaPrimary}</span>
                ${CTA_ARROW_ICON}
              </button>
              <button class="hero__cta hero__cta--icon" type="button" data-action="open-modal" data-modal-target="video" aria-label="Watch video">
                ${VIDEO_ICON}
              </button>
            </div>
          </div>

          <aside class="banking-card" aria-label="Online banking">
            <div class="banking-card__header">
              <h2 class="banking-card__title">${FIGMA_COPY.bankingTitle}</h2>
            </div>
            <div class="banking-card__body">
            <div class="banking-card__tabs">
              <button class="banking-card__tab banking-card__tab--active" type="button" data-tab="login">Log in</button>
              <button class="banking-card__tab" type="button" data-tab="signup">Sign up</button>
            </div>
            <form class="banking-card__form">
              <label class="field field--signup-only" hidden>
                <span class="field__label">Full name</span>
                <input class="field__input" type="text" name="name" placeholder="Enter your name" autocomplete="name" />
              </label>
              <label class="field">
                <span class="field__label">Email</span>
                <input class="field__input" type="email" name="email" placeholder="Enter your email" autocomplete="email" />
              </label>
              <label class="field">
                <span class="field__label">Password</span>
                <input class="field__input" type="password" name="password" placeholder="Enter your password" autocomplete="current-password" />
              </label>
              <a class="banking-card__forgot" href="#">Forgot password?</a>
              <button class="banking-card__submit" type="submit">Log in</button>
              <button class="banking-card__learn-more" type="button" data-action="open-modal" data-modal-target="learn-more">${FIGMA_COPY.bankingLearnMore}</button>
            </form>
            </div>
          </aside>
        </div>

        <div class="container hero__orbit" id="products">
          <div class="crypto-orbit">
            <div class="crypto-orbit__glow" aria-hidden="true"></div>
            <div class="crypto-orbit__ring crypto-orbit__ring--outer" aria-hidden="true"></div>
            <div class="crypto-orbit__ring crypto-orbit__ring--inner" aria-hidden="true"></div>
            <button class="crypto-orbit__core" type="button" data-action="open-modal" data-modal-target="video" aria-label="Play video">
              <span class="crypto-orbit__play" aria-hidden="true"></span>
            </button>
            <div class="crypto-orbit__items">
              <p class="crypto-orbit__loading">Loading live prices…</p>
            </div>
          </div>
        </div>
      </main>

      <footer class="footer" id="contact" aria-label="Contact">
        <div class="container footer__inner">
          <div class="footer__brand">
            ${LOGO_MARK}
            <span class="logo__text">KAIROS</span>
          </div>
          <p class="footer__text">Online banking for the next generation of digital finance.</p>
          <a class="footer__email" href="mailto:hello@kairos.bank">hello@kairos.bank</a>
        </div>
      </footer>
    </div>
  `
}

function updateCryptoOrbit(container: HTMLElement, tickers: CryptoTicker[]): void {
  const hasItems = container.querySelector('.crypto-orbit__item') !== null

  if (!hasItems) {
    log('updateCryptoOrbit: initial render', tickers.length)
    container.innerHTML = renderCryptoOrbit(tickers)
    return
  }

  tickers.forEach((ticker, index) => {
    const item = container.querySelector(`.crypto-orbit__item--${index}`)
    if (!item) return

    const priceEl = item.querySelector<HTMLElement>('.crypto-orbit__price')
    const changeEl = item.querySelector<HTMLElement>('.crypto-orbit__change')
    if (!priceEl || !changeEl) return

    priceEl.textContent = formatPrice(ticker.price)
    changeEl.textContent = formatChange(ticker.changePercent)
    changeEl.classList.toggle('crypto-orbit__change--up', ticker.changePercent >= 0)
    changeEl.classList.toggle('crypto-orbit__change--down', ticker.changePercent < 0)
  })
}

function ensurePageInteractive(): void {
  document.body.classList.remove('modal-open')
  document.querySelectorAll<HTMLElement>('.modal.is-open').forEach((modal) => {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
  })
  document.querySelectorAll<HTMLElement>('[data-action="open-modal"].is-open').forEach((button) => {
    button.classList.remove('is-open')
  })
  log('ensurePageInteractive', {
    bodyClass: document.body.className || '(empty)',
    openModals: document.querySelectorAll('#modals-root .modal.is-open').length,
  })
}

function closeAllModals(): void {
  log('closeAllModals')
  document.querySelectorAll<HTMLElement>('#modals-root .modal').forEach((modal) => {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    modal.querySelector<HTMLVideoElement>('.modal__video')?.pause()
  })
  document.body.classList.remove('modal-open')
}

function getModalElement(id: ModalId): HTMLElement | null {
  return document.querySelector<HTMLElement>(`#modals-root .modal[data-modal="${id}"]`)
}

function setModal(id: ModalId, open: boolean): void {
  log('setModal', { id, open })

  if (!open) {
    closeAllModals()
    return
  }

  closeAllModals()

  const modal = getModalElement(id)
  if (!modal) {
    warn('setModal: modal not found in #modals-root', id)
    return
  }

  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
  log('setModal: opened', id, modal.className)

  const video = modal.querySelector<HTMLVideoElement>('.modal__video')
  if (video) {
    video.currentTime = 0
    void video.play()
  }
}

function getPageRoot(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>('.page') ?? root
}

function setMobileMenuOpen(root: HTMLElement, open: boolean): void {
  log('setMobileMenuOpen', open)
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

function setAuthTab(root: HTMLElement, tab: 'login' | 'signup'): void {
  log('setAuthTab', tab)
  const card = root.querySelector('.banking-card')
  if (!card) {
    warn('setAuthTab: banking-card not found')
    return
  }

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

function handleAction(root: HTMLElement, actionEl: HTMLElement): void {
  const action = actionEl.dataset.action
  log('handleAction', { action, modal: actionEl.dataset.modalTarget })

  if (action === 'google-login') {
    startGoogleLogin()
    return
  }

  if (action === 'logout') {
    logout()
    return
  }

  if (action === 'toggle-menu') {
    const page = getPageRoot(root)
    setMobileMenuOpen(root, !page.classList.contains('page--menu-open'))
    return
  }

  if (action === 'close-menu' || action === 'close-modal') {
    setMobileMenuOpen(root, false)
    closeAllModals()
    return
  }

  if (action === 'open-modal') {
    const modalId = actionEl.getAttribute('data-modal-target') as ModalId | null
    if (modalId) setModal(modalId, true)
  }
}

function scrollToSection(root: HTMLElement, sectionId: string): void {
  if (sectionId === 'about') {
    setModal('learn-more', true)
    setMobileMenuOpen(root, false)
    return
  }

  const section = document.getElementById(sectionId)
  if (!section) {
    warn('scrollToSection: not found', sectionId)
    return
  }

  log('scrollToSection', sectionId)
  setMobileMenuOpen(root, false)
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function bindNavigation(root: HTMLElement): void {
  root.querySelectorAll<HTMLAnchorElement>('[data-section]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const sectionId = link.dataset.section
      if (!sectionId) return

      event.preventDefault()
      scrollToSection(root, sectionId)
    })
  })
}

function bindDirectActions(root: HTMLElement): void {
  const actionElements = root.querySelectorAll<HTMLElement>('[data-action]')
  log('bindDirectActions: count', actionElements.length)

  actionElements.forEach((element, index) => {
    element.addEventListener('click', (event) => {
      log('direct click handler', {
        index,
        action: element.dataset.action,
        modal: element.dataset.modalTarget,
      })
      event.preventDefault()
      handleAction(root, element)
    })
  })

  root.querySelectorAll<HTMLButtonElement>('.banking-card__tab').forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      log('direct tab click', { index, tab: tab.dataset.tab })
      event.preventDefault()
      setAuthTab(root, tab.dataset.tab === 'signup' ? 'signup' : 'login')
    })
  })
}

function bindEvents(root: HTMLElement): void {
  if (eventsBound) {
    warn('bindEvents: already bound, skipping')
    return
  }
  eventsBound = true
  log('bindEvents: attaching listeners')

  bindDirectActions(root)
  bindNavigation(root)

  document.querySelectorAll<HTMLElement>('#modals-root [data-action]').forEach((element) => {
    element.addEventListener('click', (event) => {
      log('modal direct click', element.dataset.action)
      event.preventDefault()
      handleAction(root, element)
    })
  })

  root.querySelector('.banking-card__form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    log('banking form submit -> google oauth')
    startGoogleLogin()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      log('escape pressed')
      closeAllModals()
      setMobileMenuOpen(root, false)
    }
  })
}

function mountModals(): void {
  log('mountModals: start')
  const host = document.getElementById('modals-root') ?? document.createElement('div')
  host.id = 'modals-root'
  host.innerHTML = renderModals()
  if (!host.parentElement) {
    document.body.appendChild(host)
  }
  closeAllModals()
  log('mountModals: done', {
    modals: document.querySelectorAll('.modal').length,
    openModals: document.querySelectorAll('.modal.is-open').length,
  })
}

function mount(): void {
  log('mount: start')
  ensurePageInteractive()
  bindGlobalPointerDiagnostics()

  const root = document.querySelector<HTMLDivElement>('#app')
  if (!root) {
    error('mount: #app not found')
    return
  }

  mountModals()

  const user = resolveAuthUser()
  root.innerHTML = renderPage(user)
  log('mount: page rendered')

  setMobileMenuOpen(root, false)
  bindEvents(root)
  document.body.dataset.appReady = 'true'
  ensurePageInteractive()

  const buttons = root.querySelectorAll('button, a, input')
  log('mount: interactive elements', buttons.length)
  logOverlayAudit()

  const cryptoContainer = root.querySelector<HTMLElement>('.crypto-orbit__items')
  if (!cryptoContainer) {
    warn('mount: crypto container not found')
    return
  }

  const stream = new CryptoPriceStream((tickers) => {
    updateCryptoOrbit(cryptoContainer, tickers)
  })
  stream.connect()

  window.addEventListener('beforeunload', () => stream.disconnect())
  log('mount: complete')
}

window.addEventListener('error', (event) => {
  error('window error', event.message, event.filename, event.lineno)
})

window.addEventListener('unhandledrejection', (event) => {
  error('unhandled rejection', event.reason)
})

try {
  mount()
} catch (err) {
  error('mount failed', err)
}
