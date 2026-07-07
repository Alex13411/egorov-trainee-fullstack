import { CRYPTO_CATALOG, getCryptoAsset, listWatchlistIds, type CryptoAsset } from './crypto-catalog'
import type { CryptoWatchlist } from './crypto-watchlist'

export type CryptoTicker = {
  id: string
  name: string
  icon: string
  color: string
  price: number
  changePercent: number
}

type BinanceStreamTicker = {
  s: string
  c: string
  P: string
}

const UPDATE_INTERVAL_MS = 500

function buildWsUrl(streams: string[]): string {
  const query = streams.map((stream) => `${stream}@ticker`).join('/')
  return `wss://stream.binance.com:9443/stream?streams=${query}`
}

function createTicker(asset: CryptoAsset): CryptoTicker {
  return {
    id: asset.id,
    name: asset.name,
    icon: asset.icon,
    color: asset.color,
    price: asset.staticPrice ?? 0,
    changePercent: asset.staticPrice ? 0 : 0,
  }
}

export class CryptoPriceStream {
  private socket: WebSocket | null = null
  private reconnectTimer: number | null = null
  private flushTimer: number | null = null
  private readonly prices = new Map<string, CryptoTicker>()
  private readonly onUpdate: (tickers: Map<string, CryptoTicker>) => void
  private readonly liveStreams: string[]

  constructor(watchlist: CryptoWatchlist, onUpdate: (tickers: Map<string, CryptoTicker>) => void) {
    this.onUpdate = onUpdate
    this.liveStreams = listWatchlistIds(watchlist)
      .map((id) => getCryptoAsset(id))
      .filter((asset): asset is CryptoAsset => Boolean(asset && asset.stream))
      .map((asset) => asset.stream as string)

    for (const id of listWatchlistIds(watchlist)) {
      const asset = getCryptoAsset(id)
      if (!asset) continue
      this.prices.set(id, createTicker(asset))
    }
  }

  connect(): void {
    this.flushNow()

    if (!this.liveStreams.length) return

    this.socket?.close()
    this.socket = new WebSocket(buildWsUrl(this.liveStreams))

    this.socket.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data as string) as { data: BinanceStreamTicker }
      const ticker = payload.data
      const stream = ticker.s.toLowerCase()
      const asset = Object.values(CRYPTO_CATALOG).find((item) => item.stream === stream)
      if (!asset) return

      this.prices.set(asset.id, {
        id: asset.id,
        name: asset.name,
        icon: asset.icon,
        color: asset.color,
        price: Number(ticker.c),
        changePercent: Number(ticker.P),
      })

      this.scheduleFlush()
    })

    this.socket.addEventListener('close', () => {
      this.scheduleReconnect()
    })

    this.socket.addEventListener('error', () => {
      this.socket?.close()
    })
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.flushTimer) {
      window.clearTimeout(this.flushTimer)
      this.flushTimer = null
    }
    this.socket?.close()
    this.socket = null
  }

  private scheduleFlush(): void {
    if (this.flushTimer) return

    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null
      this.onUpdate(new Map(this.prices))
    }, UPDATE_INTERVAL_MS)
  }

  private flushNow(): void {
    this.onUpdate(new Map(this.prices))
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, 3000)
  }
}

export function formatPrice(value: number): string {
  if (value === 0) {
    return '—'
  }

  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  if (value >= 1) {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`
  }

  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  })}`
}
