import { log, warn } from '../utils/debug'

export type CryptoTicker = {
  symbol: string
  label: string
  price: number
  changePercent: number
}

type BinanceStreamTicker = {
  s: string
  c: string
  P: string
}

const SYMBOLS: Array<{ stream: string; label: string }> = [
  { stream: 'btcusdt', label: 'BTC/USD' },
  { stream: 'ethusdt', label: 'ETH/USD' },
  { stream: 'bnbusdt', label: 'BNB/USD' },
  { stream: 'solusdt', label: 'SOL/USD' },
  { stream: 'xrpusdt', label: 'XRP/USD' },
  { stream: 'adausdt', label: 'ADA/USD' },
]

const streams = SYMBOLS.map(({ stream }) => `${stream}@ticker`).join('/')
const WS_URL = `wss://stream.binance.com:9443/stream?streams=${streams}`
const UPDATE_INTERVAL_MS = 500

export class CryptoPriceStream {
  private socket: WebSocket | null = null
  private reconnectTimer: number | null = null
  private flushTimer: number | null = null
  private hasFlushed = false
  private readonly prices = new Map<string, CryptoTicker>()
  private readonly onUpdate: (tickers: CryptoTicker[]) => void

  constructor(onUpdate: (tickers: CryptoTicker[]) => void) {
    log('CryptoPriceStream: created')
    this.onUpdate = onUpdate
    for (const { stream, label } of SYMBOLS) {
      this.prices.set(stream, {
        symbol: stream.toUpperCase(),
        label,
        price: 0,
        changePercent: 0,
      })
    }
  }

  connect(): void {
    log('CryptoPriceStream: connect', WS_URL)
    this.socket?.close()
    this.socket = new WebSocket(WS_URL)

    this.socket.addEventListener('open', () => {
      log('CryptoPriceStream: socket open')
    })

    this.socket.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data as string) as { data: BinanceStreamTicker }
      const ticker = payload.data
      const stream = ticker.s.toLowerCase()
      const meta = SYMBOLS.find((item) => item.stream === stream)
      if (!meta) return

      this.prices.set(stream, {
        symbol: ticker.s,
        label: meta.label,
        price: Number(ticker.c),
        changePercent: Number(ticker.P),
      })

      this.scheduleFlush()
    })

    this.socket.addEventListener('close', () => {
      warn('CryptoPriceStream: socket closed, reconnecting')
      this.scheduleReconnect()
    })

    this.socket.addEventListener('error', (event) => {
      warn('CryptoPriceStream: socket error', event)
      this.socket?.close()
    })
  }

  disconnect(): void {
    log('CryptoPriceStream: disconnect')
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
      if (!this.hasFlushed) {
        log('CryptoPriceStream: first prices received', this.prices.size)
        this.hasFlushed = true
      }
      this.onUpdate(Array.from(this.prices.values()))
    }, UPDATE_INTERVAL_MS)
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
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function formatChange(value: number): string {
  if (value === 0) {
    return '—'
  }

  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
