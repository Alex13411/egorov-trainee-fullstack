import type { AuthUser } from '../services/auth'
import { CTA_ARROW_ICON, FIGMA_COPY, VIDEO_ICON } from '../content/figma'
import { renderAuthButton, renderMobileAuth } from './auth-button'
import { LOGO_MARK, NAV_ITEMS } from './constants'

export function renderPage(user: AuthUser | null): string {
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
          ${renderMobileAuth(user)}
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
                <button class="banking-card__forgot" type="button">Forgot password?</button>
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
