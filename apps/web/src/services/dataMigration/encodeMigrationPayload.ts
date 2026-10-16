import { getPersistedState } from '@/store'
import { addressBookSlice } from '@/store/addressBookSlice'
import { addedSafesSlice } from '@/store/addedSafesSlice'
import { settingsSlice } from '@/store/settingsSlice'
import { safeAppsSlice } from '@/store/safeAppsSlice'
import { undeployedSafesSlice } from '@/features/counterfactual/store'
import { visitedSafesSlice } from '@/store/visitedSafesSlice'

export type MigrationPayload = {
  addressBook?: unknown
  addedSafes?: unknown
  settings?: unknown
  safeApps?: unknown
  undeployedSafes?: unknown
  visitedSafes?: unknown
}

const MIGRATION_FRAGMENT_VERSION = 'v1'

/**
 * Collects the same six redux-persisted slices as the manual Settings -> Data JSON
 * export (see exportAppData in components/settings/DataManagement/index.tsx), for
 * encoding into a migration URL fragment instead of a downloaded file.
 */
export const collectMigrationPayload = (): MigrationPayload => {
  const {
    [addressBookSlice.name]: addressBook,
    [addedSafesSlice.name]: addedSafes,
    [settingsSlice.name]: settings,
    [safeAppsSlice.name]: safeApps,
    [undeployedSafesSlice.name]: undeployedSafes,
    [visitedSafesSlice.name]: visitedSafes,
  } = getPersistedState()

  return { addressBook, addedSafes, settings, safeApps, undeployedSafes, visitedSafes }
}

const isNonEmpty = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && Object.keys(value).length > 0

/**
 * Whether the user has any locally stored data worth migrating. `settings` is excluded
 * because it always holds defaults, so it can't tell a fresh user from an existing one.
 */
export const hasMigrationData = (payload: MigrationPayload): boolean =>
  Object.entries(payload).some(([key, value]) => key !== 'settings' && isNonEmpty(value))

const toBase64Url = (base64: string): string => base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/**
 * Encodes a migration payload as `v1.<base64url-gzip-json>` for the destination app to
 * read straight off `location.hash` - no iframe/postMessage bridge needed, since URL
 * fragments are never sent to the server and are readable regardless of origin. The exact
 * format is the contract with the shared UI's `decodeMigrationFragment` - changing it
 * requires updating both sides.
 */
export const encodeMigrationPayload = async (payload: MigrationPayload): Promise<string> => {
  const bytes = new TextEncoder().encode(JSON.stringify(payload))
  const gz = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()
  const b64 = btoa(String.fromCharCode(...new Uint8Array(gz)))
  return `${MIGRATION_FRAGMENT_VERSION}.${toBase64Url(b64)}`
}
