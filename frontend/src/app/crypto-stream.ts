import { CryptoPriceStream } from '../services/crypto'
import { getWatchlist } from '../services/crypto-watchlist'
import {
  mountCryptoColumns,
  syncCryptoColumns,
  updateAddCryptoDropdown,
} from '../ui/crypto-orbit'
import { CRYPTO_UPDATED_EVENT } from './crypto-events'

let activeStream: CryptoPriceStream | null = null

function getColumns(root: HTMLElement): {
  leftColumn: HTMLElement
  rightColumn: HTMLElement
} | null {
  const leftColumn = root.querySelector<HTMLElement>('.crypto-orbit__column--left')
  const rightColumn = root.querySelector<HTMLElement>('.crypto-orbit__column--right')
  if (!leftColumn || !rightColumn) return null
  return { leftColumn, rightColumn }
}

function startStream(root: HTMLElement): void {
  const columns = getColumns(root)
  if (!columns) return

  const watchlist = getWatchlist()
  updateAddCryptoDropdown(watchlist)

  activeStream?.disconnect()

  activeStream = new CryptoPriceStream(watchlist, (tickers) => {
    syncCryptoColumns(columns.leftColumn, columns.rightColumn, getWatchlist(), tickers)
  })

  mountCryptoColumns(columns.leftColumn, columns.rightColumn, watchlist, activeStream.getPrices())
  activeStream.connect()
}

function refreshWatchlist(root: HTMLElement): void {
  const columns = getColumns(root)
  if (!columns) return

  const watchlist = getWatchlist()
  updateAddCryptoDropdown(watchlist)

  if (!activeStream) {
    startStream(root)
    return
  }

  const prices = activeStream.updateWatchlist(watchlist)
  mountCryptoColumns(columns.leftColumn, columns.rightColumn, watchlist, prices)
}

export function initCryptoStream(root: HTMLElement): void {
  startStream(root)
  window.addEventListener(CRYPTO_UPDATED_EVENT, () => refreshWatchlist(root))
}

export function destroyCryptoStream(): void {
  activeStream?.disconnect()
  activeStream = null
}
