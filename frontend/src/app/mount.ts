import { resolveAuthUser } from '../services/auth'
import { CryptoPriceStream } from '../services/crypto'
import { updateCryptoOrbit } from '../ui/crypto-orbit'
import { renderPage } from '../ui/page'
import { bindEvents } from './events'
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

  const cryptoContainer = root.querySelector<HTMLElement>('.crypto-orbit__items')
  if (!cryptoContainer) return

  const stream = new CryptoPriceStream((tickers) => {
    updateCryptoOrbit(cryptoContainer, tickers)
  })
  stream.connect()

  window.addEventListener('beforeunload', () => stream.disconnect())
}
