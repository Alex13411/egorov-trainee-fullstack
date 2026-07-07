import { readAuthFromUrl, startGoogleLogin, type AuthUser } from './services/auth'
import {
  CryptoPriceStream,
  formatChange,
  formatPrice,
  type CryptoTicker,
} from './services/crypto'
import './styles/main.css'

const NAV_ITEMS = ['HOME', 'ABOUT US', 'PRODUCTS', 'CONTACT US']

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

function renderPage(user: AuthUser | null): string {
  return `
    <div class="page">
      <header class="header">
        <div class="container header__inner">
          <a class="logo" href="#" aria-label="Kairos home">
            ${LOGO_MARK}
            <span class="logo__text">KAIROS</span>
          </a>

          <nav class="nav" aria-label="Main navigation">
            ${NAV_ITEMS.map((item) => `<a class="nav__link" href="#">${item}</a>`).join('')}
          </nav>

          <div class="header__actions">
            ${renderAuthButton(user)}
            <button class="burger" type="button" aria-label="Open menu" data-action="toggle-menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div class="mobile-menu" data-mobile-menu hidden>
        <nav class="mobile-menu__nav" aria-label="Mobile navigation">
          ${NAV_ITEMS.map((item) => `<a class="mobile-menu__link" href="#">${item}</a>`).join('')}
        </nav>
      </div>

      <section class="hero" aria-label="Hero">
        <video class="hero__video" autoplay muted loop playsinline preload="auto">
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div class="hero__overlay"></div>

        <div class="container hero__layout">
          <div class="hero__content">
            <h1 class="hero__title">
              <span>FROM THE FIELD OF</span>
              <span>ALL POSSIBILITY</span>
            </h1>
            <button class="hero__cta" type="button" data-action="learn-more">Learn More</button>
          </div>

          <aside class="banking-card" aria-label="Online banking">
            <h2 class="banking-card__title">ONLINE BANKING</h2>
            <div class="banking-card__tabs">
              <button class="banking-card__tab banking-card__tab--active" type="button" data-tab="login">Log in</button>
              <button class="banking-card__tab" type="button" data-tab="signup">Sign up</button>
            </div>
            <form class="banking-card__form">
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
            </form>
          </aside>
        </div>

        <section class="crypto-orbit" aria-label="Live cryptocurrency prices">
          <div class="crypto-orbit__glow" aria-hidden="true"></div>
          <div class="crypto-orbit__ring crypto-orbit__ring--outer" aria-hidden="true"></div>
          <div class="crypto-orbit__ring crypto-orbit__ring--inner" aria-hidden="true"></div>
          <div class="crypto-orbit__core" aria-hidden="true"></div>
          <div class="crypto-orbit__items">
            <p class="crypto-orbit__loading">Loading live prices…</p>
          </div>
        </section>
      </section>

      <div class="modal" data-modal="learn-more" hidden>
        <div class="modal__backdrop" data-action="close-modal"></div>
        <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="learn-more-title">
          <button class="modal__close" type="button" data-action="close-modal" aria-label="Close">×</button>
          <h2 class="modal__title" id="learn-more-title">FROM THE FIELD OF ALL POSSIBILITY</h2>
          <p class="modal__text">
            Kairos is a next-generation online banking platform built for real-time markets,
            secure access, and seamless digital finance across currencies and crypto assets.
          </p>
          <button class="modal__action" type="button" data-action="close-modal">Got it</button>
        </div>
      </div>
    </div>
  `
}

function updateCryptoOrbit(container: HTMLElement, tickers: CryptoTicker[]): void {
  const hasItems = container.querySelector('.crypto-orbit__item') !== null

  if (!hasItems) {
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

function setModalOpen(root: HTMLElement, open: boolean): void {
  const modal = root.querySelector<HTMLElement>('[data-modal="learn-more"]')
  if (!modal) return

  modal.hidden = !open
  document.body.classList.toggle('modal-open', open)
}

function setMobileMenuOpen(root: HTMLElement, open: boolean): void {
  const menu = root.querySelector<HTMLElement>('[data-mobile-menu]')
  root.classList.toggle('page--menu-open', open)
  if (menu) menu.hidden = !open
}

function mount(): void {
  const root = document.querySelector<HTMLDivElement>('#app')
  if (!root) return

  const user = readAuthFromUrl()
  root.innerHTML = renderPage(user)
  bindEvents(root, user)

  const cryptoContainer = root.querySelector<HTMLElement>('.crypto-orbit__items')
  if (!cryptoContainer) return

  const stream = new CryptoPriceStream((tickers) => {
    updateCryptoOrbit(cryptoContainer, tickers)
  })
  stream.connect()

  window.addEventListener('beforeunload', () => stream.disconnect())
}

function bindEvents(root: HTMLElement, user: AuthUser | null): void {
  root.querySelector('[data-action="google-login"]')?.addEventListener('click', () => {
    startGoogleLogin()
  })

  root.querySelector('[data-action="toggle-menu"]')?.addEventListener('click', () => {
    const isOpen = root.classList.contains('page--menu-open')
    setMobileMenuOpen(root, !isOpen)
  })

  root.querySelectorAll('[data-action="learn-more"]').forEach((button) => {
    button.addEventListener('click', () => setModalOpen(root, true))
  })

  root.querySelectorAll('[data-action="close-modal"]').forEach((button) => {
    button.addEventListener('click', () => setModalOpen(root, false))
  })

  root.querySelector('.banking-card__form')?.addEventListener('submit', (event) => {
    event.preventDefault()
  })

  const tabs = root.querySelectorAll<HTMLButtonElement>('.banking-card__tab')
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('banking-card__tab--active'))
      tab.classList.add('banking-card__tab--active')

      const submit = root.querySelector<HTMLButtonElement>('.banking-card__submit')
      if (submit) {
        submit.textContent = tab.dataset.tab === 'signup' ? 'Sign up' : 'Log in'
      }
    })
  })

  if (user) {
    root.querySelector('.banking-card__tab[data-tab="login"]')?.classList.add('banking-card__tab--active')
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setModalOpen(root, false)
      setMobileMenuOpen(root, false)
    }
  })
}

mount()
