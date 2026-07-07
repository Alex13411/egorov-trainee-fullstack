import { formatChange, formatPrice, type CryptoTicker } from '../services/crypto'

export function renderCryptoOrbit(tickers: CryptoTicker[]): string {
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

export function updateCryptoOrbit(container: HTMLElement, tickers: CryptoTicker[]): void {
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
