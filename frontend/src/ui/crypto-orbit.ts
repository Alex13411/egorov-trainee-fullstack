import { listAvailableToAdd } from '../services/crypto-catalog'
import { renderCryptoIconMarkup } from '../services/crypto-icons'
import { canAddMoreCoins, type CryptoWatchlist } from '../services/crypto-watchlist'
import { formatPrice, type CryptoTicker } from '../services/crypto'

function renderRemoveButton(id: string, name: string): string {
  return `
    <button
      class="crypto-item__remove"
      type="button"
      data-action="remove-crypto"
      data-crypto-id="${id}"
      aria-label="Remove ${name}"
    >×</button>
  `
}

function renderCryptoItem(id: string, side: 'left' | 'right', ticker?: CryptoTicker): string {
  const price = ticker ? formatPrice(ticker.price) : '—'
  const name = ticker?.name ?? id
  const removeButton = renderRemoveButton(id, name)
  const iconMarkup = renderCryptoIconMarkup(id)

  if (side === 'left') {
    return `
      <article class="crypto-item crypto-item--left" data-crypto-id="${id}">
        ${removeButton}
        <span class="crypto-item__price">${price}</span>
        <span class="crypto-item__name">${name}</span>
        ${iconMarkup}
      </article>
    `
  }

  return `
    <article class="crypto-item crypto-item--right" data-crypto-id="${id}">
      ${iconMarkup}
      <span class="crypto-item__name">${name}</span>
      <span class="crypto-item__price">${price}</span>
      ${removeButton}
    </article>
  `
}

export function renderCryptoColumns(
  watchlist: CryptoWatchlist,
  tickers: Map<string, CryptoTicker>,
): { leftHtml: string; rightHtml: string } {
  return {
    leftHtml: watchlist.left.map((id) => renderCryptoItem(id, 'left', tickers.get(id))).join(''),
    rightHtml: watchlist.right.map((id) => renderCryptoItem(id, 'right', tickers.get(id))).join(''),
  }
}

export function mountCryptoColumns(
  leftColumn: HTMLElement,
  rightColumn: HTMLElement,
  watchlist: CryptoWatchlist,
  tickers: Map<string, CryptoTicker>,
): void {
  const { leftHtml, rightHtml } = renderCryptoColumns(watchlist, tickers)
  leftColumn.innerHTML = leftHtml
  rightColumn.innerHTML = rightHtml
}

export function updateCryptoColumns(
  leftColumn: HTMLElement,
  rightColumn: HTMLElement,
  watchlist: CryptoWatchlist,
  tickers: Map<string, CryptoTicker>,
): void {
  const expectedCount = watchlist.left.length + watchlist.right.length
  const currentCount = document.querySelectorAll('.crypto-item').length

  if (currentCount !== expectedCount) {
    mountCryptoColumns(leftColumn, rightColumn, watchlist, tickers)
    return
  }

  for (const id of [...watchlist.left, ...watchlist.right]) {
    const ticker = tickers.get(id)
    if (!ticker) continue

    const item = document.querySelector<HTMLElement>(`.crypto-item[data-crypto-id="${id}"]`)
    if (!item) continue

    const priceEl = item.querySelector<HTMLElement>('.crypto-item__price')
    if (priceEl) priceEl.textContent = formatPrice(ticker.price)
  }
}

export function renderAddCryptoOptions(watchlist: CryptoWatchlist): string {
  if (!canAddMoreCoins(watchlist)) {
    return '<p class="crypto-orbit__dropdown-empty">Your watchlist is full (up to 12 coins).</p>'
  }

  const options = listAvailableToAdd(watchlist)
  if (!options.length) {
    return '<p class="crypto-orbit__dropdown-empty">All supported coins are already on your dashboard.</p>'
  }

  return options
    .map(
      (asset) => `
        <button
          class="crypto-orbit__dropdown-option"
          type="button"
          role="option"
          data-action="add-crypto"
          data-crypto-id="${asset.id}"
        >
          ${renderCryptoIconMarkup(asset.id, 'crypto-orbit__dropdown-icon')}
          <span class="crypto-orbit__dropdown-name">${asset.name}</span>
        </button>
      `,
    )
    .join('')
}

export function updateAddCryptoDropdown(watchlist: CryptoWatchlist): void {
  const list = document.querySelector<HTMLElement>('.crypto-orbit__dropdown-list')
  if (!list) return
  list.innerHTML = renderAddCryptoOptions(watchlist)
}
