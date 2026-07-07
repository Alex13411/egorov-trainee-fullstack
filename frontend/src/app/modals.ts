import type { ModalId } from '../ui/constants'
import { renderModals } from '../ui/modals'

export function mountModals(): void {
  const host = document.getElementById('modals-root') ?? document.createElement('div')
  host.id = 'modals-root'
  host.innerHTML = renderModals()
  if (!host.parentElement) {
    document.body.appendChild(host)
  }
  closeAllModals()
}

export function closeAllModals(): void {
  document.querySelectorAll<HTMLElement>('#modals-root .modal').forEach((modal) => {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
    modal.querySelector<HTMLVideoElement>('.modal__video')?.pause()
  })
  document.body.classList.remove('modal-open')
}

function getModalElement(id: ModalId): HTMLElement | null {
  return document.querySelector<HTMLElement>(`#modals-root .modal[data-modal="${id}"]`)
}

export function setModal(id: ModalId, open: boolean): void {
  if (!open) {
    closeAllModals()
    return
  }

  closeAllModals()

  const modal = getModalElement(id)
  if (!modal) return

  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')

  const video = modal.querySelector<HTMLVideoElement>('.modal__video')
  if (video) {
    video.currentTime = 0
    void video.play()
  }
}
