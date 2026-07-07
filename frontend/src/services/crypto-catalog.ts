export type CryptoAsset = {
  id: string
  stream: string | null
  name: string
  icon: string
  iconSlug?: string
  color: string
  staticPrice?: number
}

export const CRYPTO_CATALOG: Record<string, CryptoAsset> = {
  bitcoin: {
    id: 'bitcoin',
    stream: 'btcusdt',
    name: 'Bitcoin',
    icon: '₿',
    iconSlug: 'btc',
    color: '#f7931a',
  },
  ethereum: {
    id: 'ethereum',
    stream: 'ethusdt',
    name: 'Ethereum',
    icon: 'Ξ',
    iconSlug: 'eth',
    color: '#627eea',
  },
  solana: {
    id: 'solana',
    stream: 'solusdt',
    name: 'Solana',
    icon: 'S',
    iconSlug: 'sol',
    color: '#14f195',
  },
  xrp: {
    id: 'xrp',
    stream: 'xrpusdt',
    name: 'XRP',
    icon: 'X',
    iconSlug: 'xrp',
    color: '#23292f',
  },
  usdc: {
    id: 'usdc',
    stream: 'usdcusdt',
    name: 'USD Coin',
    icon: '$',
    iconSlug: 'usdc',
    color: '#2775ca',
  },
  'binance-coin': {
    id: 'binance-coin',
    stream: 'bnbusdt',
    name: 'Binance Coin',
    icon: 'B',
    iconSlug: 'bnb',
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
    iconSlug: 'doge',
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
    iconSlug: 'usdt',
    color: '#26a17b',
    staticPrice: 1,
  },
  cardano: {
    id: 'cardano',
    stream: 'adausdt',
    name: 'Cardano',
    icon: 'A',
    iconSlug: 'ada',
    color: '#0033ad',
  },
  avalanche: {
    id: 'avalanche',
    stream: 'avaxusdt',
    name: 'Avalanche',
    icon: 'A',
    iconSlug: 'avax',
    color: '#e84142',
  },
  chainlink: {
    id: 'chainlink',
    stream: 'linkusdt',
    name: 'Chainlink',
    icon: 'L',
    iconSlug: 'link',
    color: '#2a5ada',
  },
  polkadot: {
    id: 'polkadot',
    stream: 'dotusdt',
    name: 'Polkadot',
    icon: 'P',
    iconSlug: 'dot',
    color: '#e6007a',
  },
  litecoin: {
    id: 'litecoin',
    stream: 'ltcusdt',
    name: 'Litecoin',
    icon: 'Ł',
    iconSlug: 'ltc',
    color: '#345d9d',
  },
  tron: {
    id: 'tron',
    stream: 'trxusdt',
    name: 'TRON',
    icon: 'T',
    iconSlug: 'trx',
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
