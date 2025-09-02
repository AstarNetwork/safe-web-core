import NETWORK_CONFIG from '@/config/networkConfig'
import { AppRoutes } from '@/config/routes'

export const findTemplateLink = (labelContains: string): string | undefined => {
  return NETWORK_CONFIG.EXTRA_FOOTER_LINKS?.find((obj) => obj.label.includes(labelContains))?.link
}

export const getTermsLink = (currentPath: string, getHref: (path: string) => string): string => {
  return findTemplateLink('Terms') ?? getHref(AppRoutes.terms)
}

export const getPrivacyLink = (): string | undefined => {
  return findTemplateLink('Privacy')
}
