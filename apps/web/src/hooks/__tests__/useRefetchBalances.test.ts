import { renderHook } from '@/tests/test-utils'
import { useRefetchBalances } from '@/hooks/useRefetchBalances'
import * as useSafeInfo from '@/hooks/useSafeInfo'
import * as useChains from '@/hooks/useChains'
import * as useLoadBalances from '@/hooks/loadables/useLoadBalances'
import * as positionsQueries from '@safe-global/store/gateway/AUTO_GENERATED/positions'
import * as balancesQueries from '@safe-global/store/gateway/AUTO_GENERATED/balances'
import * as portfolioQueries from '@safe-global/store/gateway/AUTO_GENERATED/portfolios'
import * as store from '@/store'
import { extendedSafeInfoBuilder } from '@/tests/builders/safe'
import { toBeHex } from 'ethers'
import { FEATURES } from '@safe-global/utils/utils/chains'

const SAFE_ADDRESS = toBeHex('0x1234', 20)
const CHAIN_ID = '5'

type QueryOptions = { skip?: boolean }

// Mirrors RTK Query: refetching a skipped query throws
const mockQuery = <T extends (...args: never[]) => unknown>(refetch: jest.Mock) =>
  ((_args: unknown, options?: QueryOptions) => ({
    refetch: () => {
      if (options?.skip) throw new Error('Cannot refetch a query that has not been started yet.')
      return refetch()
    },
    isFetching: false,
    fulfilledTimeStamp: undefined,
  })) as unknown as T

const setFeatures = (features: { positions: boolean; portfolio: boolean }) => {
  jest.spyOn(useChains, 'useHasFeature').mockImplementation((feature) => {
    if (feature === FEATURES.POSITIONS) return features.positions
    if (feature === FEATURES.PORTFOLIO_ENDPOINT) return features.portfolio
    return false
  })
}

const setSafe = (deployed: boolean) => {
  const safe = extendedSafeInfoBuilder()
    .with({ address: { value: SAFE_ADDRESS }, chainId: CHAIN_ID, deployed })
    .build()
  jest.spyOn(useSafeInfo, 'default').mockReturnValue({
    safe,
    safeAddress: SAFE_ADDRESS,
    safeLoaded: true,
    safeLoading: false,
    safeError: undefined,
  })
}

describe('useRefetchBalances', () => {
  const portfolioRefetch = jest.fn().mockResolvedValue({})
  const positionsRefetch = jest.fn().mockResolvedValue({})
  const balancesRefetch = jest.fn().mockResolvedValue({})

  beforeEach(() => {
    jest.clearAllMocks()
    setSafe(true)
    setFeatures({ positions: true, portfolio: false })
    jest.spyOn(useLoadBalances, 'useTokenListSetting').mockReturnValue(true)
    jest.spyOn(store, 'useAppSelector').mockReturnValue('USD')

    jest
      .spyOn(portfolioQueries, 'usePortfolioGetPortfolioV1Query')
      .mockImplementation(mockQuery<typeof portfolioQueries.usePortfolioGetPortfolioV1Query>(portfolioRefetch))
    jest
      .spyOn(positionsQueries, 'usePositionsGetPositionsV1Query')
      .mockImplementation(mockQuery<typeof positionsQueries.usePositionsGetPositionsV1Query>(positionsRefetch))
    jest
      .spyOn(balancesQueries, 'useBalancesGetBalancesV1Query')
      .mockImplementation(mockQuery<typeof balancesQueries.useBalancesGetBalancesV1Query>(balancesRefetch))
  })

  describe('shouldUsePortfolioEndpoint', () => {
    it('should follow the PORTFOLIO_ENDPOINT feature', () => {
      setFeatures({ positions: false, portfolio: true })

      const { result } = renderHook(() => useRefetchBalances())

      expect(result.current.shouldUsePortfolioEndpoint).toBe(true)
    })

    it('should be false when PORTFOLIO_ENDPOINT is disabled', () => {
      const { result } = renderHook(() => useRefetchBalances())

      expect(result.current.shouldUsePortfolioEndpoint).toBe(false)
    })
  })

  describe('refetch', () => {
    it('should refetch positions and balances when portfolio endpoint is disabled', async () => {
      const { result } = renderHook(() => useRefetchBalances())

      await result.current.refetch()

      expect(positionsRefetch).toHaveBeenCalled()
      expect(balancesRefetch).toHaveBeenCalled()
      expect(portfolioRefetch).not.toHaveBeenCalled()
    })

    it('should only refetch balances when positions feature is disabled', async () => {
      setFeatures({ positions: false, portfolio: false })

      const { result } = renderHook(() => useRefetchBalances())

      await result.current.refetch()

      expect(positionsRefetch).not.toHaveBeenCalled()
      expect(balancesRefetch).toHaveBeenCalled()
    })

    it('should refetch portfolio when portfolio endpoint is enabled without positions', async () => {
      setFeatures({ positions: false, portfolio: true })

      const { result } = renderHook(() => useRefetchBalances())

      await result.current.refetch()

      expect(portfolioRefetch).toHaveBeenCalled()
      expect(positionsRefetch).not.toHaveBeenCalled()
      expect(balancesRefetch).not.toHaveBeenCalled()
    })

    it('should also refetch balances when portfolio endpoint is enabled and all tokens are selected', async () => {
      setFeatures({ positions: true, portfolio: true })
      jest.spyOn(useLoadBalances, 'useTokenListSetting').mockReturnValue(false)

      const { result } = renderHook(() => useRefetchBalances())

      await result.current.refetch()

      expect(portfolioRefetch).toHaveBeenCalled()
      expect(balancesRefetch).toHaveBeenCalled()
    })

    it('should not throw for an undeployed Safe', async () => {
      setSafe(false)

      const { result } = renderHook(() => useRefetchBalances())

      await expect(result.current.refetch()).resolves.toBeUndefined()
      expect(positionsRefetch).not.toHaveBeenCalled()
      expect(balancesRefetch).not.toHaveBeenCalled()
    })
  })

  describe('positions query', () => {
    it('should be skipped when positions feature is disabled', () => {
      setFeatures({ positions: false, portfolio: false })
      const positionsQuery = jest.spyOn(positionsQueries, 'usePositionsGetPositionsV1Query')

      renderHook(() => useRefetchBalances())

      expect(positionsQuery).toHaveBeenCalledWith(expect.anything(), { skip: true })
    })

    it('should use the chainId of the loaded Safe', () => {
      const positionsQuery = jest.spyOn(positionsQueries, 'usePositionsGetPositionsV1Query')

      renderHook(() => useRefetchBalances())

      expect(positionsQuery).toHaveBeenCalledWith(
        { chainId: CHAIN_ID, safeAddress: SAFE_ADDRESS, fiatCode: 'USD' },
        { skip: false },
      )
    })
  })
})
