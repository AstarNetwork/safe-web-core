import { useCallback, useEffect, useMemo, useState } from 'react'
import classnames from 'classnames'
import chunk from 'lodash/chunk'
import { IconButton, Skeleton, useMediaQuery } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import type { Chain } from '@safe-global/store/gateway/AUTO_GENERATED/chains'
import NetworkPill from './NetworkPill'
import type { CarouselLayout } from './utils'
import {
  CAROUSEL_LAYOUT_DESKTOP,
  CAROUSEL_LAYOUT_MOBILE,
  CAROUSEL_LAYOUT_TABLET,
  getNetworksPerSlide,
  groupNetworksMainnetsFirst,
} from './utils'
import css from './styles.module.css'

const AUTO_ADVANCE_MS = 6000
const PILL_STAGGER_MS = 40

const useCarouselLayout = (): CarouselLayout => {
  const isMobile = useMediaQuery('(max-width: 599.95px)')
  const isTablet = useMediaQuery('(max-width: 899.95px)')

  if (isMobile) return CAROUSEL_LAYOUT_MOBILE
  if (isTablet) return CAROUSEL_LAYOUT_TABLET
  return CAROUSEL_LAYOUT_DESKTOP
}

interface NetworkCarouselProps {
  chains: Chain[]
  loading?: boolean
}

const NetworkCarousel = ({ chains, loading = false }: NetworkCarouselProps) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const { networksPerRow, rowsPerSlide } = useCarouselLayout()
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = useMemo(
    () => chunk(groupNetworksMainnetsFirst(chains), getNetworksPerSlide({ networksPerRow, rowsPerSlide })),
    [chains, networksPerRow, rowsPerSlide],
  )
  const slideCount = slides.length
  const hasMultipleSlides = slideCount > 1

  useEffect(() => {
    setActiveSlide(0)
  }, [slideCount])

  const goToPreviousSlide = useCallback(() => {
    setActiveSlide((currentSlide) => (currentSlide - 1 + slideCount) % slideCount)
  }, [slideCount])

  const goToNextSlide = useCallback(() => {
    setActiveSlide((currentSlide) => (currentSlide + 1) % slideCount)
  }, [slideCount])

  useEffect(() => {
    if (!hasMultipleSlides || isPaused || prefersReducedMotion) return

    const timer = window.setTimeout(goToNextSlide, AUTO_ADVANCE_MS)

    return () => window.clearTimeout(timer)
  }, [activeSlide, hasMultipleSlides, isPaused, prefersReducedMotion, goToNextSlide])

  if (loading) {
    return (
      <div className={css.carouselContainer} data-testid="welcome-network-carousel-loading">
        <Skeleton variant="rounded" className={css.carouselSkeleton} />
      </div>
    )
  }

  if (slideCount === 0) return null

  return (
    <div
      className={css.carouselContainer}
      role="region"
      aria-roledescription="carousel"
      aria-label="Supported networks"
      data-testid="welcome-network-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={classnames(css.carouselStage, { [css.carouselStageWithNav]: hasMultipleSlides })}>
        {hasMultipleSlides && (
          <IconButton
            className={css.carouselButton}
            aria-label="Previous networks"
            title="Previous networks"
            onClick={goToPreviousSlide}
          >
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>
        )}

        <div className={css.carouselViewport}>
          <div className={css.carouselTrack} style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            {slides.map((slideChains, slideIndex) => {
              const isActive = slideIndex === activeSlide

              return (
                <div
                  key={slideChains[0].chainId}
                  className={classnames(css.carouselSlide, { [css.carouselSlideActive]: isActive })}
                  aria-hidden={!isActive}
                >
                  {chunk(slideChains, networksPerRow).map((row, rowIndex) => (
                    <div key={row[0].chainId} className={css.carouselRow}>
                      {row.map((chain, columnIndex) => {
                        const chainIndex = rowIndex * networksPerRow + columnIndex

                        return (
                          <NetworkPill
                            key={chain.chainId}
                            chain={chain}
                            animationDelayMs={isActive ? 120 + chainIndex * PILL_STAGGER_MS : undefined}
                            isFocusable={isActive}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {hasMultipleSlides && (
          <IconButton
            className={classnames(css.carouselButton, css.carouselButtonNext)}
            aria-label="Next networks"
            title="Next networks"
            onClick={goToNextSlide}
          >
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  )
}

export default NetworkCarousel
