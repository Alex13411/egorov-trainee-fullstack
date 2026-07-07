import { logout, startGoogleLogin } from '../services/auth'
import { addToWatchlist, removeFromWatchlist } from '../services/crypto-watchlist'
import type { ModalId } from '../ui/constants'
import { CRYPTO_UPDATED_EVENT } from './crypto-events'
import { closeAllModals, setModal } from './modals'
import {
  isCryptoDropdownOpen,
  isMobileMenuOpen,
  setBankingTab,
  setCryptoDropdownOpen,
  setMobileMenuOpen,
} from './ui-state'

function scrollToSection(root: HTMLElement, sectionId: string): void {
  if (sectionId === 'about') {
    setModal('learn-more', true)
    setMobileMenuOpen(root, false)
    return
  }

  const section = document.getElementById(sectionId)
  if (!section) return

  setMobileMenuOpen(root, false)
  setCryptoDropdownOpen(root, false)
  section.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleAction(root: HTMLElement, actionEl: HTMLElement): void {
  const action = actionEl.dataset.action

  if (action === 'google-login') {
    startGoogleLogin()
    return
  }

  if (action === 'logout') {
    logout()
    return
  }

  if (action === 'toggle-menu') {
    setMobileMenuOpen(root, !isMobileMenuOpen(root))
    return
  }

  if (action === 'close-menu' || action === 'close-modal') {
    setMobileMenuOpen(root, false)
    setCryptoDropdownOpen(root, false)
    closeAllModals()
    return
  }

  if (action === 'open-modal') {
    const modalId = actionEl.getAttribute('data-modal-target') as ModalId | null
    if (modalId) {
      setCryptoDropdownOpen(root, false)
      setModal(modalId, true)
    }
    return
  }

  if (action === 'toggle-crypto-dropdown') {
    setCryptoDropdownOpen(root, !isCryptoDropdownOpen(root))
    return
  }

  if (action === 'add-crypto') {
    const cryptoId = actionEl.dataset.cryptoId
    if (!cryptoId) return
    if (addToWatchlist(cryptoId)) {
      setCryptoDropdownOpen(root, false)
      window.dispatchEvent(new CustomEvent(CRYPTO_UPDATED_EVENT))
    }
    return
  }

  if (action === 'remove-crypto') {
    const cryptoId = actionEl.dataset.cryptoId
    if (!cryptoId) return
    if (removeFromWatchlist(cryptoId)) {
      window.dispatchEvent(new CustomEvent(CRYPTO_UPDATED_EVENT))
    }
  }
}

let eventsBound = false

export function bindEvents(root: HTMLElement): void {
  if (eventsBound) return
  eventsBound = true

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const tab = target.closest<HTMLButtonElement>('.banking-card__tab')
    if (tab && root.contains(tab)) {
      event.preventDefault()
      setBankingTab(root, tab.dataset.tab === 'business' ? 'business' : 'personal')
      return
    }

    const sectionLink = target.closest<HTMLAnchorElement>('[data-section]')
    if (sectionLink && root.contains(sectionLink)) {
      event.preventDefault()
      const sectionId = sectionLink.dataset.section
      if (sectionId) scrollToSection(root, sectionId)
      return
    }

    const actionEl = target.closest<HTMLElement>('[data-action]')
    if (actionEl) {
      if (root.contains(actionEl) || actionEl.closest('#modals-root')) {
        event.preventDefault()
        handleAction(root, actionEl)
        return
      }
    }

    if (isCryptoDropdownOpen(root) && !target.closest('[data-crypto-dropdown]')) {
      setCryptoDropdownOpen(root, false)
    }
  })

  root.querySelectorAll<HTMLFormElement>('.banking-card__panel').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      startGoogleLogin()
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllModals()
      setMobileMenuOpen(root, false)
      setCryptoDropdownOpen(root, false)
    }
  })
}
