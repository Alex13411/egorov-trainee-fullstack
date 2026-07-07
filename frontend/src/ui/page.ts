import type { AuthUser } from '../services/auth'
import { CTA_ARROW_ICON, CTA_PLAY_ICON, FIGMA_COPY } from '../content/figma'
import { renderAuthButton, renderMobileAuth } from './auth-button'
import { LOGO_MARK, NAV_ITEMS } from './constants'

function renderNavLinks(activeSection = 'home'): string {
  return NAV_ITEMS.map((item, index) => {
    const separator = index > 0 ? '<span class="nav__sep" aria-hidden="true">|</span>' : ''
    const activeClass = item.section === activeSection ? ' nav__link--active' : ''
    return `${separator}<a class="nav__link${activeClass}" href="#${item.section}" data-section="${item.section}">${item.label}</a>`
  }).join('')
}

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
            ${renderNavLinks('home')}
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
              <button class="hero__cta hero__cta--split hero__cta--primary" type="button" data-action="open-modal" data-modal-target="learn-more">
                <span class="hero__cta__label">${FIGMA_COPY.ctaPrimary}</span>
                <span class="hero__cta__icon">${CTA_ARROW_ICON}</span>
              </button>
              <button class="hero__cta hero__cta--split hero__cta--ghost" type="button" data-action="open-modal" data-modal-target="video">
                <span class="hero__cta__label">${FIGMA_COPY.ctaSecondary}</span>
                <span class="hero__cta__icon hero__cta__icon--play">${CTA_PLAY_ICON}</span>
              </button>
            </div>
          </div>

          <aside class="banking-card banking-card--personal" aria-label="Online banking">
            <div class="banking-card__header">
              <h2 class="banking-card__title">${FIGMA_COPY.bankingTitle}</h2>
              <div class="banking-card__tabs">
                <button class="banking-card__tab banking-card__tab--active" type="button" data-tab="personal">${FIGMA_COPY.bankingTabPersonal}</button>
                <button class="banking-card__tab" type="button" data-tab="business">${FIGMA_COPY.bankingTabBusiness}</button>
              </div>
            </div>
            <div class="banking-card__body">
              <form class="banking-card__panel banking-card__panel--personal" data-banking-panel="personal">
                <button class="banking-card__login-gold" type="submit">${FIGMA_COPY.bankingLogin}</button>
                <button class="banking-card__forgot" type="button">${FIGMA_COPY.bankingForgot}</button>
                <div class="banking-card__or"><span>${FIGMA_COPY.bankingOr}</span></div>
                <p class="banking-card__signup">
                  ${FIGMA_COPY.bankingSignupPrefix}
                  <button type="button" data-action="google-login">${FIGMA_COPY.bankingSignup}</button>
                </p>
              </form>
              <form class="banking-card__panel banking-card__panel--business" data-banking-panel="business" hidden>
                <div class="banking-card__business-input">
                  <input type="email" name="email" placeholder="${FIGMA_COPY.bankingBusinessPlaceholder}" autocomplete="email" />
                  <button class="banking-card__business-login" type="submit" aria-label="${FIGMA_COPY.bankingLogin}">${FIGMA_COPY.bankingLogin}</button>
                </div>
                <button class="banking-card__forgot" type="button">${FIGMA_COPY.bankingForgot}</button>
                <div class="banking-card__or"><span>${FIGMA_COPY.bankingOr}</span></div>
                <p class="banking-card__signup">
                  ${FIGMA_COPY.bankingSignupPrefix}
                  <button type="button" data-action="google-login">${FIGMA_COPY.bankingSignup}</button>
                </p>
              </form>
            </div>
          </aside>
        </div>

        <section class="hero__orbit" id="projects" aria-label="Cryptocurrency dashboard">
          <div class="container">
            <div class="crypto-orbit">
              <div class="crypto-orbit__hud crypto-orbit__hud--tl" aria-hidden="true"></div>
              <div class="crypto-orbit__hud crypto-orbit__hud--br" aria-hidden="true"></div>
              <div class="crypto-orbit__glow" aria-hidden="true"></div>
              <div class="crypto-orbit__ring crypto-orbit__ring--outer" aria-hidden="true"></div>
              <div class="crypto-orbit__ring crypto-orbit__ring--mid" aria-hidden="true"></div>
              <div class="crypto-orbit__ring crypto-orbit__ring--inner" aria-hidden="true"></div>
              <div class="crypto-orbit__orb" aria-hidden="true"></div>
              <div class="crypto-orbit__layout">
                <div class="crypto-orbit__column crypto-orbit__column--left" aria-label="Cryptocurrency prices left"></div>
                <div class="crypto-orbit__hub">
                  <h2 class="crypto-orbit__hub-title">${FIGMA_COPY.cryptoHubTitle}</h2>
                  <div class="crypto-orbit__dropdown" data-crypto-dropdown>
                    <button
                      class="crypto-orbit__add"
                      type="button"
                      data-action="toggle-crypto-dropdown"
                      aria-expanded="false"
                      aria-haspopup="listbox"
                    >
                      ${FIGMA_COPY.cryptoAddLabel}
                      <span class="crypto-orbit__add-chevron" aria-hidden="true">▾</span>
                    </button>
                    <div class="crypto-orbit__dropdown-panel" hidden>
                      <div class="crypto-orbit__dropdown-list" role="listbox"></div>
                    </div>
                  </div>
                </div>
                <div class="crypto-orbit__column crypto-orbit__column--right" aria-label="Cryptocurrency prices right"></div>
              </div>
            </div>
          </div>
        </section>
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
