import type { Meta, StoryObj } from '@storybook/react'
import type { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import { createChainData } from '@/stories/mocks'
import NetworkCarousel from './NetworkCarousel'
import { NETWORKS_PER_SLIDE } from './utils'
import css from './styles.module.css'

const createMockChains = (count: number): Chain[] =>
  Array.from({ length: count }, (_, index) => ({
    ...createChainData(),
    chainId: String(index + 1),
    chainName: `Network ${index + 1}`,
    shortName: `net${index + 1}`,
    isTestnet: index % 5 === 0,
  }))

const meta = {
  title: 'Components/Welcome/NetworkCarousel',
  component: NetworkCarousel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <section className={css.panel} style={{ background: '#121312', paddingBlock: 'var(--space-6)' }}>
        <div className={css.footer}>
          <Story />
        </div>
      </section>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof NetworkCarousel>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    chains: [],
    loading: true,
  },
}

export const SingleSlide: Story = {
  args: {
    chains: createMockChains(NETWORKS_PER_SLIDE),
    loading: false,
  },
}

export const MultipleSlides: Story = {
  args: {
    chains: createMockChains(NETWORKS_PER_SLIDE + 1),
    loading: false,
  },
}
