import { collectMigrationPayload, encodeMigrationPayload, type MigrationPayload } from '../encodeMigrationPayload'
import * as store from '@/store'
import { addressBookSlice } from '@/store/addressBookSlice'
import { settingsSlice } from '@/store/settingsSlice'

// Mirrors the shared UI's `decodeMigrationFragment` - kept local to this test so it stays
// an independent check of the wire format, not a reuse of the implementation under test.
const decodeMigration = async (hash: string): Promise<unknown> => {
  const [ver, b64url] = hash.replace(/^#/, '').split('.')
  if (ver !== 'v1' || !b64url) throw new Error('bad payload')
  const b64 = b64url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(b64url.length / 4) * 4, '=')
  const gz = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  const json = await new Response(new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip'))).text()
  return JSON.parse(json)
}

describe('encodeMigrationPayload', () => {
  it('round-trips a payload through the v1 fragment format', async () => {
    const payload: MigrationPayload = {
      addressBook: { '1': { '0xAecDFD3A19f777F0c03e6bf99AAfB59937d6467b': 'Alice' } },
      settings: { currency: 'usd' },
    }

    const encoded = await encodeMigrationPayload(payload)

    expect(encoded.startsWith('v1.')).toBe(true)
    await expect(decodeMigration(`#${encoded}`)).resolves.toEqual(payload)
  })

  it('produces a URL-safe fragment with no padding or reserved characters', async () => {
    const encoded = await encodeMigrationPayload({ addressBook: { '1': { '0x1': 'A very long name '.repeat(50) } } })

    expect(encoded).toMatch(/^v1\.[A-Za-z0-9_-]+$/)
  })
})

describe('collectMigrationPayload', () => {
  it('reads the same six slices as the manual Settings -> Data export', () => {
    jest.spyOn(store, 'getPersistedState').mockReturnValue({
      [addressBookSlice.name]: { '1': { '0x1': 'Alice' } },
      [settingsSlice.name]: { currency: 'usd' },
    } as never)

    const payload = collectMigrationPayload()

    expect(payload.addressBook).toEqual({ '1': { '0x1': 'Alice' } })
    expect(payload.settings).toEqual({ currency: 'usd' })
    expect(payload.addedSafes).toBeUndefined()
  })
})
