export type CryptoAsset = {
  id: string
  stream: string | null
  name: string
  icon: string
  color: string
  staticPrice?: number
}

export const CRYPTO_CATALOG: Record<string, CryptoAsset> = {
  bitcoin: {
    id: 'bitcoin',
    stream: 'btcusdt',
    name: 'Bitcoin',
    icon: '₿',
    color: '#f7931a',
  },
  ethereum: {
    id: 'ethereum',
    stream: 'ethusdt',
    name: 'Ethereum',
    icon: 'Ξ',
    color: '#627eea',
  },
  solana: {
    id: 'solana',
    stream: 'solusdt',
    name: 'Solana',
    icon: 'S',
    color: '#14f195',
  },
  xrp: {
    id: 'xrp',
    stream: 'xrpusdt',
    name: 'XRP',
    icon: 'X',
    color: '#23292f',
  },
  usdc: {
    id: 'usdc',
    stream: 'usdcusdt',
    name: 'USD Coin',
    icon: '$',
    color: '#2775ca',
  },
  'binance-coin': {
    id: 'binance-coin',
    stream: 'bnbusdt',
    name: 'Binance Coin',
    icon: 'B',
    color: '#f3ba2f',
  },
  midnight: {
    id: 'midnight',
    stream: 'nightusdt',
    name: 'Midnight',
    icon: 'M',
    color: '#111111',
  },
  dogecoin: {
    id: 'dogecoin',
    stream: 'dogeusdt',
    name: 'Dogecoin',
    icon: 'Ð',
    color: '#c2a633',
  },
  sui: {
    id: 'sui',
    stream: 'suiusdt',
    name: 'Sui',
    icon: 'S',
    color: '#4da2ff',
  },
  tether: {
    id: 'tether',
    stream: null,
    name: 'Tether',
    icon: '₮',
    color: '#26a17b',
    staticPrice: 1,
  },
  cardano: {
    id: 'cardano',
    stream: 'adausdt',
    name: 'Cardano',
    icon: 'A',
    color: '#0033ad',
  },
  avalanche: {
    id: 'avalanche',
    stream: 'avaxusdt',
    name: 'Avalanche',
    icon: 'A',
    color: '#e84142',
  },
  chainlink: {
    id: 'chainlink',
    stream: 'linkusdt',
    name: 'Chainlink',
    icon: 'L',
    color: '#2a5ada',
  },
  polkadot: {
    id: 'polkadot',
    stream: 'dotusdt',
    name: 'Polkadot',
    icon: 'P',
    color: '#e6007a',
  },
  litecoin: {
    id: 'litecoin',
    stream: 'ltcusdt',
    name: 'Litecoin',
    icon: 'Ł',
    color: '#345d9d',
  },
  tron: {
    id: 'tron',
    stream: 'trxusdt',
    name: 'TRON',
    icon: 'T',
    color: '#eb0029',
  },
}

export const DEFAULT_WATCHLIST = {
  left: ['bitcoin', 'ethereum', 'solana', 'xrp', 'usdc'],
  right: ['binance-coin', 'midnight', 'dogecoin', 'sui', 'tether'],
} as const

export const MAX_COINS_PER_COLUMN = 6

export function getCryptoAsset(id: string): CryptoAsset | undefined {
  return CRYPTO_CATALOG[id]
}

export function listWatchlistIds(watchlist: { left: string[]; right: string[] }): string[] {
  return [...watchlist.left, ...watchlist.right]
}

export function listAvailableToAdd(watchlist: { left: string[]; right: string[] }): CryptoAsset[] {
  const active = new Set(listWatchlistIds(watchlist))
  return Object.values(CRYPTO_CATALOG).filter((asset) => !active.has(asset.id))
}
