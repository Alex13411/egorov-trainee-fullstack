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
  if (!streams.length) return ''
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
    changePercent: 0,
  }
}

function collectLiveStreams(watchlist: CryptoWatchlist): string[] {
  return listWatchlistIds(watchlist)
    .map((id) => getCryptoAsset(id))
    .filter((asset): asset is CryptoAsset => Boolean(asset?.stream))
    .map((asset) => asset.stream as string)
}

function sameStreams(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((stream, index) => stream === sortedB[index])
}

export class CryptoPriceStream {
  private socket: WebSocket | null = null
  private reconnectTimer: number | null = null
  private flushTimer: number | null = null
  private active = true
  private liveStreams: string[] = []
  private readonly prices = new Map<string, CryptoTicker>()
  private readonly onUpdate: (tickers: Map<string, CryptoTicker>) => void

  constructor(watchlist: CryptoWatchlist, onUpdate: (tickers: Map<string, CryptoTicker>) => void) {
    this.onUpdate = onUpdate
    this.applyWatchlist(watchlist)
  }

  connect(): void {
    this.active = true
    this.emitPrices()

    if (!this.liveStreams.length) {
      this.closeSocket()
      return
    }

    this.openSocket()
  }

  disconnect(): void {
    this.active = false
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.flushTimer) {
      window.clearTimeout(this.flushTimer)
      this.flushTimer = null
    }
    this.closeSocket()
  }

  updateWatchlist(watchlist: CryptoWatchlist): Map<string, CryptoTicker> {
    const streamsChanged = this.applyWatchlist(watchlist)

    if (!this.active) {
      return this.getPrices()
    }

    if (streamsChanged) {
      this.openSocket()
    }

    this.emitPrices()
    return this.getPrices()
  }

  getPrices(): Map<string, CryptoTicker> {
    return new Map(this.prices)
  }

  private applyWatchlist(watchlist: CryptoWatchlist): boolean {
    const ids = new Set(listWatchlistIds(watchlist))

    for (const id of [...this.prices.keys()]) {
      if (!ids.has(id)) {
        this.prices.delete(id)
      }
    }

    for (const id of ids) {
      if (this.prices.has(id)) continue
      const asset = getCryptoAsset(id)
      if (asset) {
        this.prices.set(id, createTicker(asset))
      }
    }

    const nextStreams = collectLiveStreams(watchlist)
    const streamsChanged = !sameStreams(nextStreams, this.liveStreams)
    this.liveStreams = nextStreams
    return streamsChanged
  }

  private openSocket(): void {
    this.closeSocket()

    const url = buildWsUrl(this.liveStreams)
    if (!url) return

    this.socket = new WebSocket(url)

    this.socket.addEventListener('message', (event) => {
      if (!this.active) return

      const payload = JSON.parse(event.data as string) as { data: BinanceStreamTicker }
      const ticker = payload.data
      const stream = ticker.s.toLowerCase()
      const asset = Object.values(CRYPTO_CATALOG).find((item) => item.stream === stream)
      if (!asset || !this.prices.has(asset.id)) return

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
      if (!this.active) return
      this.scheduleReconnect()
    })

    this.socket.addEventListener('error', () => {
      this.socket?.close()
    })
  }

  private closeSocket(): void {
    this.socket?.close()
    this.socket = null
  }

  private scheduleFlush(): void {
    if (this.flushTimer || !this.active) return

    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null
      this.emitPrices()
    }, UPDATE_INTERVAL_MS)
  }

  private emitPrices(): void {
    if (!this.active) return
    this.onUpdate(this.getPrices())
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || !this.active) return
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      this.openSocket()
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
