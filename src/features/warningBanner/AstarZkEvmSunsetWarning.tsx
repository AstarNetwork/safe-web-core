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
        As of <ExternalLink href="https://x.com/AstarNetwork/status/1906658995538194650">March 31, 2025</ExternalLink>,
        the Astar zkEVM has been officially deprecated and is no longer accessible to users or developers.
      </Typography>
    </ErrorMessage>
  )
}
