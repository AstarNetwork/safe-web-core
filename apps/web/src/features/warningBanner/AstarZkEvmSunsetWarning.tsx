import { Alert } from '@mui/material'
import { type ReactElement } from 'react'
import { useCurrentChain } from '@/hooks/useChains'

export const AstarZkEvmSunsetWarning = (): ReactElement | null => {
  const currentChain = useCurrentChain()

  // Only show for Astar zkEVM chain
  if (!currentChain?.chainId || currentChain.chainId !== '3776') {
    return null
  }

  return (
    <Alert severity="warning">Astar zkEVM network will be sunset. Please migrate your assets to another network.</Alert>
  )
}
