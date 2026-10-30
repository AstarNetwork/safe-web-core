import partition from 'lodash/partition'
import type { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'

export interface CarouselLayout {
  networksPerRow: number
  rowsPerSlide: number
}

export const CAROUSEL_LAYOUT_MOBILE: CarouselLayout = { networksPerRow: 2, rowsPerSlide: 4 }
export const CAROUSEL_LAYOUT_TABLET: CarouselLayout = { networksPerRow: 3, rowsPerSlide: 4 }
export const CAROUSEL_LAYOUT_DESKTOP: CarouselLayout = { networksPerRow: 4, rowsPerSlide: 4 }

export const getNetworksPerSlide = ({ networksPerRow, rowsPerSlide }: CarouselLayout): number =>
  networksPerRow * rowsPerSlide

export const NETWORKS_PER_ROW = CAROUSEL_LAYOUT_DESKTOP.networksPerRow
export const NETWORKS_PER_SLIDE = getNetworksPerSlide(CAROUSEL_LAYOUT_DESKTOP)

export const formatNetworkCountLabel = (count: number): string => {
  if (count <= 0) return 'Multiple networks'
  if (count === 1) return '1 network'
  if (count < 10) return `${count} networks`

  const step = count >= 100 ? 100 : 10
  return `${Math.floor(count / step) * step}+ networks`
}

export const groupNetworksMainnetsFirst = (chains: Chain[]): Chain[] => {
  const [mainnets, testnets] = partition(chains, (chain) => !chain.isTestnet)
  return [...mainnets, ...testnets]
}
