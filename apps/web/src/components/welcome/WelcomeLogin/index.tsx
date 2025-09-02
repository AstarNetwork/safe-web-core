import { AppRoutes } from '@/config/routes'
import { Paper, SvgIcon, Typography, Divider, Box, Button, Link } from '@mui/material'
import SafeLogo from '@/public/images/logo-text.svg'
import css from './styles.module.css'
import { useRouter } from 'next/router'
import { CREATE_SAFE_EVENTS } from '@/services/analytics/events/createLoadSafe'
import { OVERVIEW_EVENTS, OVERVIEW_LABELS, trackEvent } from '@/services/analytics'
import useWallet from '@/hooks/wallets/useWallet'
import useHasSafes from '@/features/myAccounts/hooks/useHasSafes'
import Track from '@/components/common/Track'
import { useCallback, useEffect, useState } from 'react'
import WalletLogin from './WalletLogin'
import NETWORK_CONFIG from '@/config/networkConfig'
import LicensedLogo from '@/public/images/logo-licensed.svg'

const WelcomeLogin = () => {
  const router = useRouter()
  const wallet = useWallet()
  const { isLoaded, hasSafes } = useHasSafes()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const redirect = useCallback(() => {
    if (wallet) {
      if (isLoaded && !hasSafes) {
        trackEvent(CREATE_SAFE_EVENTS.OPEN_SAFE_CREATION)
        router.push({ pathname: AppRoutes.newSafe.create, query: router.query })
      } else {
        router.push({ pathname: AppRoutes.welcome.accounts, query: router.query })
      }
    }
  }, [hasSafes, isLoaded, router, wallet])

  const onLogin = useCallback(() => {
    setShouldRedirect(true)
  }, [])

  useEffect(() => {
    if (!shouldRedirect) return
    redirect()
  }, [redirect, shouldRedirect])

  return (
    <Paper className={css.loginCard} data-testid="welcome-login">
      <Box className={css.loginContent}>
        {NETWORK_CONFIG.IS_LICENSED ? (
          <SvgIcon component={LicensedLogo} inheritViewBox sx={{ height: '72px', width: '240px', ml: '-8px' }} />
        ) : (
          <SvgIcon
            component={SafeLogo}
            inheritViewBox
            sx={{
              height: NETWORK_CONFIG.LOGO_DIMENSIONS?.WELCOME?.H ?? '24px',
              width: NETWORK_CONFIG.LOGO_DIMENSIONS?.WELCOME?.W ?? '80px',
              ml: '-8px',
            }}
          />
        )}

        <Typography variant="h6" mt={6} fontWeight={700}>
          Get started
        </Typography>

        <Typography mb={2} textAlign="center">
          {wallet
            ? 'Open your existing Safe Accounts or create a new one'
            : 'Connect your wallet to create a new Safe Account or open an existing one'}
        </Typography>

        <Track {...OVERVIEW_EVENTS.OPEN_ONBOARD} label={OVERVIEW_LABELS.welcome_page}>
          <WalletLogin onLogin={onLogin} onContinue={redirect} />
        </Track>

        {!wallet && (
          <>
            <Divider sx={{ mt: 2, mb: 2, width: '100%' }}>
              <Typography color="text.secondary" fontWeight={700} variant="overline">
                or
              </Typography>
            </Divider>
            {hasSafes ? (
              <Link href={AppRoutes.welcome.accounts}>
                <Button disableElevation size="small">
                  View my accounts
                </Button>
              </Link>
            ) : (
              <Link href={AppRoutes.newSafe.load}>
                <Button disableElevation size="small">
                  Watch any account
                </Button>
              </Link>
            )}
          </>
        )}
      </Box>
    </Paper>
  )
}

export default WelcomeLogin
