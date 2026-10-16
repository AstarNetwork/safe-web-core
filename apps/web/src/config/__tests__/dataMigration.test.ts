import {
  getSharedUiMigrateUrl,
  getSharedUiSafeUrl,
  getSharedUiWelcomeUrl,
  resolveSharedUiEnvironment,
  resolveSharedUiOrigin,
  SHARED_UI_ORIGINS,
} from '../dataMigration'

describe('dataMigration config', () => {
  describe('resolveSharedUiEnvironment', () => {
    it.each([
      ['staging.astar-safe.protofire.io', 'stage'],
      ['safe-stg.example.org', 'stage'],
      ['stage-safe.example.org', 'stage'],
      ['safe.astar.network', 'prod'],
      ['app.safe.protofire.io', 'prod'],
      ['localhost:3000', 'prod'],
    ])('%s -> %s', (host, expected) => {
      expect(resolveSharedUiEnvironment(host)).toBe(expected)
    })

    it('does not treat a marker inside another word as an environment', () => {
      expect(resolveSharedUiEnvironment('backstage.example.org')).toBe('prod')
      expect(resolveSharedUiEnvironment('stages.example.org')).toBe('prod')
    })

    it('is case-insensitive', () => {
      expect(resolveSharedUiEnvironment('STAGING.EXAMPLE.ORG')).toBe('stage')
    })
  })

  describe('resolveSharedUiOrigin', () => {
    it('maps each environment to its shared UI origin', () => {
      expect(resolveSharedUiOrigin('staging.astar-safe.protofire.io')).toBe(SHARED_UI_ORIGINS.stage)
      expect(resolveSharedUiOrigin('safe.astar.network')).toBe(SHARED_UI_ORIGINS.prod)
    })
  })

  describe('url builders', () => {
    it('builds the migrate URL with an encoded source', () => {
      expect(getSharedUiMigrateUrl(SHARED_UI_ORIGINS.prod, 'astr')).toBe(
        'https://app.safe.protofire.io/migrate?source=astr',
      )
    })

    it('builds the safe URL', () => {
      expect(getSharedUiSafeUrl(SHARED_UI_ORIGINS.prod, 'astr', '0x1')).toBe(
        'https://app.safe.protofire.io/home?safe=astr:0x1',
      )
    })

    it('builds the welcome URL', () => {
      expect(getSharedUiWelcomeUrl(SHARED_UI_ORIGINS.stage)).toBe(
        'https://app.stage.safe.protofire.io/welcome/data-migration',
      )
    })
  })
})
