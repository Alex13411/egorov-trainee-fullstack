import { readAuthFromUrl, startGoogleLogin, type AuthUser } from './services/auth'
import {
  CryptoPriceStream,
  formatChange,
  formatPrice,
  type CryptoTicker,
} from './services/crypto'
import './styles/main.css'

const NAV_ITEMS = ['HOME', 'ABOUT US', 'PRODUCTS', 'CONTACT US']

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
      Sign in with Google
    </button>
  `
}

function renderPage(user: AuthUser | null, tickers: CryptoTicker[]): string {
  return `
    <div class="page">
      <header class="header">
        <a class="logo" href="#" aria-label="Kairos home">KAIROS</a>
        <nav class="nav" aria-label="Main navigation">
          ${NAV_ITEMS.map((item) => `<a class="nav__link" href="#">${item}</a>`).join('')}
        </nav>
        ${renderAuthButton(user)}
        <button class="burger" type="button" aria-label="Open menu" data-action="toggle-menu">
          <span></span><span></span><span></span>
        </button>
      </header>

      <section class="hero" aria-label="Hero">
        <video
          class="hero__video"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div class="hero__overlay"></div>
        <div class="hero__content">
          <p class="hero__eyebrow">Online Banking</p>
          <h1 class="hero__title">FROM THE FIELD OF ALL POSSIBILITY</h1>
          <button class="hero__cta" type="button" data-action="learn-more">Learn More</button>
        </div>

        <aside class="banking-card" aria-label="Online banking">
          <div class="banking-card__tabs">
            <button class="banking-card__tab banking-card__tab--active" type="button">Log in</button>
            <button class="banking-card__tab" type="button">Sign up</button>
          </div>
          <form class="banking-card__form">
            <label>
              <span>Email</span>
              <input type="email" name="email" placeholder="Enter your email" autocomplete="email" />
            </label>
            <label>
              <span>Password</span>
              <input type="password" name="password" placeholder="Enter your password" autocomplete="current-password" />
            </label>
            <a class="banking-card__forgot" href="#">Forgot password?</a>
            <button class="banking-card__submit" type="submit">Log in</button>
          </form>
        </aside>
      </section>

      <section class="crypto-orbit" aria-label="Live cryptocurrency prices">
        <div class="crypto-orbit__ring">
          ${renderCryptoOrbit(tickers)}
        </div>
      </section>
    </div>
  `
}

function mount(): void {
  const root = document.querySelector<HTMLDivElement>('#app')
  if (!root) return

  const user = readAuthFromUrl()
  let tickers: CryptoTicker[] = []

  const paint = () => {
    root.innerHTML = renderPage(user, tickers)
    bindEvents(root, user)
  }

  paint()

  const stream = new CryptoPriceStream((nextTickers) => {
    tickers = nextTickers
    paint()
  })
  stream.connect()

  window.addEventListener('beforeunload', () => stream.disconnect())
}

function bindEvents(root: HTMLElement, user: AuthUser | null): void {
  root.querySelector('[data-action="google-login"]')?.addEventListener('click', () => {
    startGoogleLogin()
  })

  root.querySelector('[data-action="toggle-menu"]')?.addEventListener('click', () => {
    root.classList.toggle('page--menu-open')
  })

  root.querySelector('.banking-card__form')?.addEventListener('submit', (event) => {
    event.preventDefault()
  })

  if (user) {
    const loginTab = root.querySelector('.banking-card__tab')
    loginTab?.classList.add('banking-card__tab--active')
  }
}

mount()
