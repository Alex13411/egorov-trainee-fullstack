import { logout, startGoogleLogin } from '../services/auth'
import type { ModalId } from '../ui/constants'
import { closeAllModals, setModal } from './modals'
import { isMobileMenuOpen, setAuthTab, setMobileMenuOpen } from './ui-state'

function scrollToSection(root: HTMLElement, sectionId: string): void {
  if (sectionId === 'about') {
    setModal('learn-more', true)
    setMobileMenuOpen(root, false)
    return
  }

  const section = document.getElementById(sectionId)
  if (!section) return

  setMobileMenuOpen(root, false)
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
    closeAllModals()
    return
  }

  if (action === 'open-modal') {
    const modalId = actionEl.getAttribute('data-modal-target') as ModalId | null
    if (modalId) setModal(modalId, true)
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
      setAuthTab(root, tab.dataset.tab === 'signup' ? 'signup' : 'login')
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
    if (!actionEl) return
    if (!root.contains(actionEl) && !actionEl.closest('#modals-root')) return

    event.preventDefault()
    handleAction(root, actionEl)
  })

  root.querySelector('.banking-card__form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    startGoogleLogin()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllModals()
      setMobileMenuOpen(root, false)
    }
  })
}
