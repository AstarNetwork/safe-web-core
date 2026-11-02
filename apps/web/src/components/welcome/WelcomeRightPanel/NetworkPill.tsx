import Link from 'next/link'
import type { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { AppRoutes } from '@/config/routes'
import { ChainLogo } from '@/components/common/ChainIndicator'
import css from './styles.module.css'

interface NetworkPillProps {
  chain: Chain
  animationDelayMs?: number
  isFocusable?: boolean
}

const NetworkPill = ({ chain, animationDelayMs, isFocusable = true }: NetworkPillProps) => (
  <Link
    href={{ pathname: AppRoutes.newSafe.load, query: { chain: chain.shortName } }}
    className={css.networkPill}
    title={`Load a Safe on ${chain.chainName}`}
    tabIndex={isFocusable ? undefined : -1}
    style={animationDelayMs !== undefined ? { animationDelay: `${animationDelayMs}ms` } : undefined}
  >
    <span className={css.networkPillIcon}>
      <ChainLogo chain={chain} size={20} />
    </span>
    <span className={css.networkPillLabel}>{chain.chainName}</span>
  </Link>
)

export default NetworkPill
