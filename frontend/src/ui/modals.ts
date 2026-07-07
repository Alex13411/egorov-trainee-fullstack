import { FIGMA_COPY } from '../content/figma'

export function renderModals(): string {
  return `
    <div class="modal" data-modal="learn-more" aria-hidden="true">
      <div class="modal__backdrop" data-action="close-modal"></div>
      <div class="modal__dialog modal__dialog--learn-more" role="dialog" aria-modal="true" aria-labelledby="learn-more-title">
        <button class="modal__close modal__close--light" type="button" data-action="close-modal" aria-label="Close">×</button>
        <h2 class="modal__title modal__title--learn-more" id="learn-more-title">
          ${FIGMA_COPY.modalLearnMoreTitle.map((line) => `<span>${line}</span>`).join('')}
        </h2>
        ${FIGMA_COPY.modalLearnMoreBody.map((paragraph) => `<p class="modal__text modal__text--learn-more">${paragraph}</p>`).join('')}
        <button class="modal__action modal__action--learn-more" type="button" data-action="close-modal">${FIGMA_COPY.modalLearnMoreAction}</button>
      </div>
    </div>

    <div class="modal" data-modal="add-crypto" aria-hidden="true">
      <div class="modal__backdrop" data-action="close-modal"></div>
      <div class="modal__dialog modal__dialog--add-crypto" role="dialog" aria-modal="true" aria-labelledby="add-crypto-title">
        <button class="modal__close modal__close--light" type="button" data-action="close-modal" aria-label="Close">×</button>
        <h2 class="modal__title modal__title--add-crypto" id="add-crypto-title">${FIGMA_COPY.modalAddCryptoTitle}</h2>
        <p class="modal__text modal__text--add-crypto">${FIGMA_COPY.modalAddCryptoHint}</p>
        <div class="add-crypto__list"></div>
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
