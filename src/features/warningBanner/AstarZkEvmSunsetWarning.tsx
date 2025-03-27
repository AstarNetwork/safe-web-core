import ErrorMessage from '@/components/tx/ErrorMessage'
import { Typography } from '@mui/material'
import ExternalLink from '@/components/common/ExternalLink'
import { useHasFeature } from '@/hooks/useChains'
import { FEATURES } from '@/utils/chains'

export const AstarZkEvmSunsetWarning = () => {
  const isFeatureEnabled = useHasFeature(FEATURES.ZKEVM_SUNSET_BANNER)

  if (!isFeatureEnabled) return null

  return (
    <ErrorMessage level="warning" title="Astar zkEVM Sunsetting & Migration Plan">
      <Typography display="inline" mr={1}>
        Dear users, Support for Astar zkEVM will end soon. Please withdraw your funds before April 1st, 2025.
      </Typography>
      <Typography display="inline">
        For more details about migration, please visit Astar Forum
        <ExternalLink href="https://forum.astar.network/t/astar-zkevm-sunsetting-migration-plan/7780">
          https://forum.astar.network/t/astar-zkevm-sunsetting-migration-plan/7780
        </ExternalLink>
      </Typography>
    </ErrorMessage>
  )
}
