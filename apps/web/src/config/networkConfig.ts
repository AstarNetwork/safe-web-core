import type { NetworkConfig } from './constants.extra'

const NETWORK_CONFIG = {
  SAFE_UTILS_SUPPORTED: false,
  EXTRA_FOOTER_LINKS: [
    { label: 'Astar Website', link: 'https://astar.network/' },
    { label: 'Astar Portal', link: 'https://portal.astar.network/' },
  ],
  LOGO_DIMENSIONS: {
    HEADER: {
      H: '30px',
    },
    WELCOME: {
      W: '149px',
      H: '44px',
    },
  },
} as NetworkConfig
export default NETWORK_CONFIG
