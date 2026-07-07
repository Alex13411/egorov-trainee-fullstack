import { resolveAuthUser } from '../services/auth'
import { CryptoPriceStream } from '../services/crypto'
import { getWatchlist } from '../services/crypto-watchlist'
import {
  mountCryptoColumns,
  updateAddCryptoDropdown,
  updateCryptoColumns,
} from '../ui/crypto-orbit'
import { renderPage } from '../ui/page'
import { bindEvents } from './events'
import { CRYPTO_UPDATED_EVENT } from './crypto-events'
import { mountModals } from './modals'
import { setMobileMenuOpen } from './ui-state'

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
    startCryptoStream(root)
  })

  window.addEventListener('beforeunload', () => {
    ;(window as typeof window & { __kairosCryptoStream?: CryptoPriceStream }).__kairosCryptoStream?.disconnect()
  })
}

function startCryptoStream(root: HTMLElement): void {
  const leftColumn = root.querySelector<HTMLElement>('.crypto-orbit__column--left')
  const rightColumn = root.querySelector<HTMLElement>('.crypto-orbit__column--right')
  if (!leftColumn || !rightColumn) return

  const watchlist = getWatchlist()
  updateAddCryptoDropdown(watchlist)

  const existingStream = (window as typeof window & { __kairosCryptoStream?: CryptoPriceStream }).__kairosCryptoStream
  existingStream?.disconnect()

  const stream = new CryptoPriceStream(watchlist, (tickers) => {
    updateCryptoColumns(leftColumn, rightColumn, watchlist, tickers)
  })
  ;(window as typeof window & { __kairosCryptoStream?: CryptoPriceStream }).__kairosCryptoStream = stream

  mountCryptoColumns(leftColumn, rightColumn, watchlist, new Map())
  stream.connect()
}

export { CRYPTO_UPDATED_EVENT } from './crypto-events'
