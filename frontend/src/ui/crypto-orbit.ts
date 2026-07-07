import { listAvailableToAdd } from '../services/crypto-catalog'
import { canAddMoreCoins, type CryptoWatchlist } from '../services/crypto-watchlist'
import { formatPrice, type CryptoTicker } from '../services/crypto'

function renderCryptoItem(id: string, side: 'left' | 'right', ticker?: CryptoTicker): string {
  const price = ticker ? formatPrice(ticker.price) : '—'
  const name = ticker?.name ?? id
  const icon = ticker?.icon ?? '?'
  const color = ticker?.color ?? '#ffffff'

  if (side === 'left') {
    return `
      <article class="crypto-item crypto-item--left" data-crypto-id="${id}">
        <span class="crypto-item__price">${price}</span>
        <span class="crypto-item__name">${name}</span>
        <span class="crypto-item__icon" style="--icon-color: ${color}">${icon}</span>
      </article>
    `
  }

  return `
    <article class="crypto-item crypto-item--right" data-crypto-id="${id}">
      <span class="crypto-item__icon" style="--icon-color: ${color}">${icon}</span>
      <span class="crypto-item__name">${name}</span>
      <span class="crypto-item__price">${price}</span>
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
  const hasItems = leftColumn.querySelector('.crypto-item') !== null

  if (!hasItems) {
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
    return '<p class="add-crypto__empty">Your watchlist is full (up to 12 coins).</p>'
  }

  const options = listAvailableToAdd(watchlist)
  if (!options.length) {
    return '<p class="add-crypto__empty">All supported coins are already on your dashboard.</p>'
  }

  return options
    .map(
      (asset) => `
        <button
          class="add-crypto__option"
          type="button"
          data-action="add-crypto"
          data-crypto-id="${asset.id}"
        >
          <span class="add-crypto__icon" style="--icon-color: ${asset.color}">${asset.icon}</span>
          <span class="add-crypto__name">${asset.name}</span>
          <span class="add-crypto__add-label">Add</span>
        </button>
      `,
    )
    .join('')
}

export function updateAddCryptoModal(watchlist: CryptoWatchlist): void {
  const list = document.querySelector<HTMLElement>('.add-crypto__list')
  if (!list) return
  list.innerHTML = renderAddCryptoOptions(watchlist)
}
