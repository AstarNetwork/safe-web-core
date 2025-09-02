import type { ReactElement, ReactNode } from 'react'
import { SvgIcon, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import Link from 'next/link'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '@/config/routes'
import packageJson from '../../../../package.json'
import ExternalLink from '../ExternalLink'
import MUILink from '@mui/material/Link'
import { useIsOfficialHost } from '@/hooks/useIsOfficialHost'
import { HELP_CENTER_URL } from '@safe-global/utils/config/constants'
import { BRAND_NAME } from '@/config/constants'
import ProtofireLogo from '@/public/images/protofire.svg'
import darkPalette from '@/components/theme/darkPalette'
import { PROTOFIRE_SUPPORT_LINK } from '@/config/constants.extra'
import NETWORK_CONFIG from '@/config/networkConfig'
import { findTemplateLink } from '@/utils/networkConfig'
import DiscordIcon from '@/public/images/common/discord-icon.svg'

const footerPages = [
  AppRoutes.welcome.index,
  AppRoutes.settings.index,
  AppRoutes.imprint,
  AppRoutes.privacy,
  AppRoutes.cookie,
  AppRoutes.terms,
  AppRoutes.licenses,
]

const FooterLink = ({ children, href }: { children: ReactNode; href: string }): ReactElement => {
  return href ? (
    <Link href={href} passHref legacyBehavior>
      <MUILink>{children}</MUILink>
    </Link>
  ) : (
    <MUILink>{children}</MUILink>
  )
}

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const isOfficialHost = useIsOfficialHost()

  if (!footerPages.some((path) => router.pathname.startsWith(path))) {
    return null
  }

  const getHref = (path: string): string => {
    return router.pathname === path ? '' : path
  }

  return (
    <footer className={css.container}>
      <ul>
        {isOfficialHost ? (
          <>
            <li>
              <Typography variant="caption">&copy;2022–{new Date().getFullYear()} Core Contributors GmbH</Typography>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.terms)}>Terms</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.privacy)}>Privacy</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.licenses)}>Licenses</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.imprint)}>Imprint</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.cookie)}>Cookie policy</FooterLink>
            </li>
            <li>
              <FooterLink href={getHref(AppRoutes.settings.index)}>Preferences</FooterLink>
            </li>
            <li>
              <ExternalLink href={HELP_CENTER_URL} noIcon sx={{ span: { textDecoration: 'underline' } }}>
                Help
              </ExternalLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <Typography variant="caption">
                {NETWORK_CONFIG.IS_LICENSED
                  ? 'This is a Safe{Wallet} Partner website'
                  : '©' + new Date().getFullYear() + ' ' + BRAND_NAME}
              </Typography>
            </li>

            {NETWORK_CONFIG.EXTRA_FOOTER_LINKS?.map((link, index) => {
              return (
                <li key={index}>
                  <ExternalLink href={link.link} noIcon>
                    {link.label.toLowerCase() === 'discord' && (
                      <SvgIcon component={DiscordIcon} inheritViewBox fontSize="inherit" sx={{ mr: 0.5 }} />
                    )}
                    {link.label}
                  </ExternalLink>
                </li>
              )
            })}
            {NETWORK_CONFIG.IS_LICENSED && (
              <li>
                <FooterLink href={getHref(AppRoutes.imprint)}>Imprint</FooterLink>
              </li>
            )}
            <li>
              <FooterLink href={getHref(AppRoutes.cookie)}>Cookie policy</FooterLink>
            </li>
            {!findTemplateLink('Terms') && (
              <li>
                <FooterLink href={getHref(AppRoutes.terms)}>Terms</FooterLink>
              </li>
            )}
            <li>
              <FooterLink href={getHref(AppRoutes.settings.index)}>Preferences</FooterLink>
            </li>
            <li>
              <ExternalLink href={PROTOFIRE_SUPPORT_LINK} noIcon sx={{ span: { textDecoration: 'underline' } }}>
                Help
              </ExternalLink>
            </li>
          </>
        )}
        <li>
          <ExternalLink href={`${packageJson.homepage}/releases/tag/v${packageJson.version}`} noIcon>
            <SvgIcon component={GitHubIcon} inheritViewBox fontSize="inherit" sx={{ mr: 0.5 }} /> v{packageJson.version}
          </ExternalLink>
        </li>
        <li>
          <Typography variant="caption">
            Supported by{' '}
            <SvgIcon
              component={ProtofireLogo}
              inheritViewBox
              fontSize="small"
              sx={{ verticalAlign: 'middle', mx: 0.5 }}
            />
            <MUILink href="https://protofire.io" sx={{ color: darkPalette.primary.main, textDecoration: 'none' }}>
              Protofire
            </MUILink>
          </Typography>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
