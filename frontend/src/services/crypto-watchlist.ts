import {
  DEFAULT_WATCHLIST,
  MAX_COINS_PER_COLUMN,
  getCryptoAsset,
  listWatchlistIds,
  type CryptoAsset,
} from './crypto-catalog'

export type CryptoWatchlist = {
  left: string[]
  right: string[]
}

const STORAGE_KEY = 'kairos-crypto-watchlist'

function isValidWatchlist(value: unknown): value is CryptoWatchlist {
  if (!value || typeof value !== 'object') return false
  const record = value as CryptoWatchlist
  if (!Array.isArray(record.left) || !Array.isArray(record.right)) return false
  return [...record.left, ...record.right].every((id) => typeof id === 'string' && Boolean(getCryptoAsset(id)))
}

export function getWatchlist(): CryptoWatchlist {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return cloneWatchlist(DEFAULT_WATCHLIST)

    const parsed = JSON.parse(raw) as unknown
    if (!isValidWatchlist(parsed)) return cloneWatchlist(DEFAULT_WATCHLIST)
    return parsed
  } catch {
    return cloneWatchlist(DEFAULT_WATCHLIST)
  }
}

export function saveWatchlist(watchlist: CryptoWatchlist): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
}

export function addToWatchlist(assetId: string): boolean {
  const asset = getCryptoAsset(assetId)
  if (!asset) return false

  const watchlist = getWatchlist()
  if (listWatchlistIds(watchlist).includes(assetId)) return false

  if (watchlist.left.length >= MAX_COINS_PER_COLUMN && watchlist.right.length >= MAX_COINS_PER_COLUMN) {
    return false
  }

  if (watchlist.left.length <= watchlist.right.length) {
    watchlist.left.push(assetId)
  } else {
    watchlist.right.push(assetId)
  }

  saveWatchlist(watchlist)
  return true
}

export function canAddMoreCoins(watchlist: CryptoWatchlist = getWatchlist()): boolean {
  return watchlist.left.length < MAX_COINS_PER_COLUMN || watchlist.right.length < MAX_COINS_PER_COLUMN
}

function cloneWatchlist(watchlist: { left: readonly string[]; right: readonly string[] }): CryptoWatchlist {
  return {
    left: [...watchlist.left],
    right: [...watchlist.right],
  }
}

export type { CryptoAsset }
