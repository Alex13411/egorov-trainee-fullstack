export const NAV_ITEMS = [
  { label: 'HOME', section: 'home' },
  { label: 'ABOUT US', section: 'about' },
  { label: 'PRODUCTS', section: 'products' },
  { label: 'CONTACT US', section: 'contact' },
] as const

export type ModalId = 'learn-more' | 'video'

export const LOGO_MARK = `
  <svg class="logo__mark" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
    <path d="M14 2L26 14L14 26L2 14L14 2Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M14 8L20 14L14 20L8 14L14 8Z" fill="currentColor"/>
  </svg>
`
