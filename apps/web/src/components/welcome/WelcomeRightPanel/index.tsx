import useChains from '@/hooks/useChains'
import NetworkCarousel from './NetworkCarousel'
import css from './styles.module.css'
import { formatNetworkCountLabel } from './utils'
import { WELCOME_FEATURES, WELCOME_LABEL, WELCOME_TITLE } from './constants'

const WelcomeRightPanel = () => {
  const { configs, loading } = useChains()
  const networkCountLabel = formatNetworkCountLabel(configs.length)

  return (
    <section className={css.panel} data-testid="welcome-right-panel">
      <div className={css.hero}>
        <p className={css.label}>{WELCOME_LABEL}</p>
        <h2 className={css.title}>{WELCOME_TITLE}</h2>
        <ul className={css.featureList}>
          {[...WELCOME_FEATURES, networkCountLabel].map((label) => (
            <li key={label} className={css.featureItem}>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className={css.footer}>
        <NetworkCarousel chains={configs} loading={loading} />
      </div>
    </section>
  )
}

export default WelcomeRightPanel
