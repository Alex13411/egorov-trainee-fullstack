import { consumeAuthError, resolveAuthUser } from '../services/auth'
import { renderPage } from '../ui/page'
import { destroyCryptoStream, initCryptoStream } from './crypto-stream'
import { bindEvents } from './events'
import { mountModals } from './modals'
import { setMobileMenuOpen } from './ui-state'

export function mount(): void {
  const root = document.querySelector<HTMLDivElement>('#app')
  if (!root) return

  mountModals()

  const authError = consumeAuthError()
  const user = resolveAuthUser()
  root.innerHTML = renderPage(user, authError)

  setMobileMenuOpen(root, false)
  bindEvents(root)
  initCryptoStream(root)

  window.addEventListener('beforeunload', destroyCryptoStream)
}
