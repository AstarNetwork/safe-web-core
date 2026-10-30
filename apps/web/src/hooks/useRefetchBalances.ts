import { useCallback } from 'react'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useAppSelector } from '@/store'
import { selectCurrency } from '@/store/settingsSlice'
import { usePositionsGetPositionsV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/positions'
import { useBalancesGetBalancesV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/balances'
import { usePortfolioGetPortfolioV1Query } from '@safe-global/store/gateway/AUTO_GENERATED/portfolios'
import { FEATURES } from '@safe-global/utils/utils/chains'
import { getPositionsEndpointConfig } from '@safe-global/utils/features/positions'
import { useHasFeature } from '@/hooks/useChains'
import { useTokenListSetting } from '@/hooks/loadables/useLoadBalances'

/**
 * Shared hook for refetching positions and balances data.
 * Uses the same endpoint selection as useLoadBalances and only refetches active queries.
 *
 * @returns Object containing:
 *   - `refetch`: Function to refetch all active queries
 *   - `shouldUsePortfolioEndpoint`: Boolean indicating if portfolio endpoint is active
 *   - `fulfilledTimeStamp`: Timestamp of the last successful fetch (undefined if no data yet)
 *   - `isFetching`: Boolean indicating if a fetch is currently in progress
 */
export const useRefetchBalances = () => {
  const { safe, safeAddress } = useSafeInfo()
  const chainId = safe.chainId
  const currency = useAppSelector(selectCurrency)
  const isTrustedTokenList = useTokenListSetting()
  const isPositionsEnabled = useHasFeature(FEATURES.POSITIONS)
  const shouldUsePortfolioEndpoint = useHasFeature(FEATURES.PORTFOLIO_ENDPOINT) ?? false
  const { shouldUsePositionsEndpoint } = getPositionsEndpointConfig(isPositionsEnabled, shouldUsePortfolioEndpoint)

  const hasQueryParams = !!safeAddress && !!chainId && !!currency && isTrustedTokenList !== undefined
  const isPortfolioActive = shouldUsePortfolioEndpoint && hasQueryParams
  const isPositionsActive = shouldUsePositionsEndpoint && hasQueryParams && safe.deployed
  const isBalancesActive = (!shouldUsePortfolioEndpoint || !isTrustedTokenList) && hasQueryParams && safe.deployed

  const {
    refetch: portfolioRefetch,
    fulfilledTimeStamp: portfolioFulfilledTimeStamp,
    isFetching: portfolioIsFetching,
  } = usePortfolioGetPortfolioV1Query(
    { address: safeAddress, chainIds: chainId, fiatCode: currency, trusted: isTrustedTokenList },
    { skip: !isPortfolioActive },
  )

  const { refetch: positionsRefetch, isFetching: positionsIsFetching } = usePositionsGetPositionsV1Query(
    { chainId, safeAddress, fiatCode: currency },
    { skip: !isPositionsActive },
  )

  const { refetch: txServiceBalancesRefetch, isFetching: txServiceBalancesIsFetching } = useBalancesGetBalancesV1Query(
    { chainId, safeAddress, fiatCode: currency, trusted: isTrustedTokenList },
    { skip: !isBalancesActive },
  )

  const refetch = useCallback(async () => {
    await Promise.all([
      isPortfolioActive ? portfolioRefetch() : undefined,
      isPositionsActive ? positionsRefetch() : undefined,
      isBalancesActive ? txServiceBalancesRefetch() : undefined,
    ])
  }, [
    isPortfolioActive,
    isPositionsActive,
    isBalancesActive,
    portfolioRefetch,
    positionsRefetch,
    txServiceBalancesRefetch,
  ])

  const fulfilledTimeStamp = shouldUsePortfolioEndpoint ? portfolioFulfilledTimeStamp : undefined

  const isFetching = portfolioIsFetching || positionsIsFetching || txServiceBalancesIsFetching

  return { refetch, shouldUsePortfolioEndpoint, fulfilledTimeStamp, isFetching }
}
