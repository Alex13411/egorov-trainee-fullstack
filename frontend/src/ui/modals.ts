import { FIGMA_COPY } from '../content/figma'

export function renderModals(): string {
  return `
    <div class="modal" data-modal="learn-more" aria-hidden="true">
      <div class="modal__backdrop" data-action="close-modal"></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="learn-more-title">
        <button class="modal__close" type="button" data-action="close-modal" aria-label="Close">×</button>
        <h2 class="modal__title" id="learn-more-title">${FIGMA_COPY.modalLearnMoreTitle}</h2>
        <p class="modal__text">${FIGMA_COPY.modalLearnMoreBody}</p>
        <button class="modal__action" type="button" data-action="close-modal">${FIGMA_COPY.modalLearnMoreAction}</button>
      </div>
    </div>

    <div class="modal modal--video" data-modal="video" aria-hidden="true">
      <div class="modal__backdrop" data-action="close-modal"></div>
      <div class="modal__dialog modal__dialog--video" role="dialog" aria-modal="true" aria-labelledby="video-title">
        <button class="modal__close" type="button" data-action="close-modal" aria-label="Close">×</button>
        <h2 class="modal__title modal__title--compact" id="video-title">${FIGMA_COPY.modalVideoTitle}</h2>
        <div class="modal__video-wrap">
          <video class="modal__video" controls playsinline preload="metadata">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  `
}
