import { getCryptoAsset } from './crypto-catalog'

const ICON_CDN = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color'

export function getCryptoIconUrl(iconSlug: string | undefined): string | null {
  if (!iconSlug) return null
  return `${ICON_CDN}/${iconSlug}.svg`
}

export function renderCryptoIconMarkup(assetId: string, className = 'crypto-item__icon-img'): string {
  const asset = getCryptoAsset(assetId)
  if (!asset) return ''

  const iconUrl = getCryptoIconUrl(asset.iconSlug)
  if (iconUrl) {
    return `<img class="${className}" src="${iconUrl}" alt="" width="34" height="34" loading="lazy" />`
  }

  return `<span class="crypto-item__icon crypto-item__icon--fallback" style="--icon-color: ${asset.color}">${asset.icon}</span>`
}
