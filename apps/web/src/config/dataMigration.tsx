import type { ReactNode } from 'react'
import ExternalLink from '@/components/common/ExternalLink'

/**
 * Shared UI origins, one per environment. This deployment picks the one matching its own
 * host (see resolveSharedUiOrigin): a staging host points to the staging shared UI and
 * anything else to production - no per-environment code change or env var needed.
 */
export const SHARED_UI_ORIGINS = {
  stage: 'https://app.stage.safe.protofire.io',
  prod: 'https://app.safe.protofire.io',
} as const

export type SharedUiEnvironment = keyof typeof SHARED_UI_ORIGINS

// Match the marker as its own host segment (`staging.astar-safe.protofire.io`,
// `safe-stg.example.org`) but not inside another word (`backstage.`).
const STAGE_HOST_RE = /(^|[.-])(stage|staging|stg)([.-]|$)/i

/**
 * Maps the current host of this (dedicated) deployment to the shared UI environment it
 * should hand users over to. Pure, so it can be unit-tested without a DOM.
 */
export const resolveSharedUiEnvironment = (host: string): SharedUiEnvironment =>
  STAGE_HOST_RE.test(host) ? 'stage' : 'prod'

export const resolveSharedUiOrigin = (host: string): string => SHARED_UI_ORIGINS[resolveSharedUiEnvironment(host)]

/**
 * Where the promo banner CTA redirects to, carrying the encoded payload as a URL fragment.
 * `source` is the chain's `shortName` from the config service, which the shared UI
 * validates against its own migration source allowlist - never a raw domain.
 */
export const getSharedUiMigrateUrl = (origin: string, source: string): string =>
  `${origin}/migrate?source=${encodeURIComponent(source)}`

/**
 * Opens the same Safe (`chain:address`) on the shared UI, used when there is no local data to migrate.
 */
export const getSharedUiSafeUrl = (origin: string, shortName: string, safeAddress: string): string =>
  `${origin}/home?safe=${encodeURIComponent(shortName)}:${safeAddress}`

export const getSharedUiWelcomeUrl = (origin: string): string => `${origin}/welcome/data-migration`

/**
 * Promo banner copy. Which chains show the banner is decided purely by the
 * DATA_MIGRATION_PROMO feature flag in the chain config.
 */
export const DATA_MIGRATION_BANNER = {
  title: 'Astar Safe is moving to Protofire Multisig!',
  description: (sharedUiOrigin: string): ReactNode => (
    <>
      Get started at: <ExternalLink href={getSharedUiWelcomeUrl(sharedUiOrigin)}>Protofire Multisig</ExternalLink>{' '}
      before November 5, 2026, when this interface will be discontinued.
    </>
  ),
}
