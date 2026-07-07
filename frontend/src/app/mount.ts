import { resolveAuthUser } from '../services/auth'
import { CryptoPriceStream } from '../services/crypto'
import { getWatchlist } from '../services/crypto-watchlist'
import {
  mountCryptoColumns,
  syncCryptoColumns,
  updateAddCryptoDropdown,
} from '../ui/crypto-orbit'
import { renderPage } from '../ui/page'
import { bindEvents } from './events'
import { CRYPTO_UPDATED_EVENT } from './crypto-events'
import { mountModals } from './modals'
import { setMobileMenuOpen } from './ui-state'

type CryptoStreamWindow = Window & { __kairosCryptoStream?: CryptoPriceStream }

function getStreamWindow(): CryptoStreamWindow {
  return window as CryptoStreamWindow
}

export function mount(): void {
  const root = document.querySelector<HTMLDivElement>('#app')
  if (!root) return

  mountModals()

  const user = resolveAuthUser()
  root.innerHTML = renderPage(user)

  setMobileMenuOpen(root, false)
  bindEvents(root)
  startCryptoStream(root)

  window.addEventListener(CRYPTO_UPDATED_EVENT, () => {
    refreshCryptoWatchlist(root)
  })

  window.addEventListener('beforeunload', () => {
    getStreamWindow().__kairosCryptoStream?.disconnect()
  })
}

function getCryptoColumns(root: HTMLElement): {
  leftColumn: HTMLElement
  rightColumn: HTMLElement
} | null {
  const leftColumn = root.querySelector<HTMLElement>('.crypto-orbit__column--left')
  const rightColumn = root.querySelector<HTMLElement>('.crypto-orbit__column--right')
  if (!leftColumn || !rightColumn) return null
  return { leftColumn, rightColumn }
}

function startCryptoStream(root: HTMLElement): void {
  const columns = getCryptoColumns(root)
  if (!columns) return

  const watchlist = getWatchlist()
  updateAddCryptoDropdown(watchlist)

  getStreamWindow().__kairosCryptoStream?.disconnect()

  const stream = new CryptoPriceStream(watchlist, (tickers) => {
    syncCryptoColumns(columns.leftColumn, columns.rightColumn, getWatchlist(), tickers)
  })

  getStreamWindow().__kairosCryptoStream = stream
  mountCryptoColumns(columns.leftColumn, columns.rightColumn, watchlist, stream.getPrices())
  stream.connect()
}

function refreshCryptoWatchlist(root: HTMLElement): void {
  const columns = getCryptoColumns(root)
  if (!columns) return

  const watchlist = getWatchlist()
  updateAddCryptoDropdown(watchlist)

  const stream = getStreamWindow().__kairosCryptoStream
  if (!stream) {
    startCryptoStream(root)
    return
  }

  const prices = stream.updateWatchlist(watchlist)
  mountCryptoColumns(columns.leftColumn, columns.rightColumn, watchlist, prices)
}

export { CRYPTO_UPDATED_EVENT } from './crypto-events'
