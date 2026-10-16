import { useEffect, useState } from 'react'
import { resolveSharedUiOrigin } from '@/config/dataMigration'

/**
 * Shared UI origin matching this deployment's environment (staging -> stage, else prod).
 * `undefined` until mounted, since it depends on `window.location`.
 */
const useSharedUiOrigin = (): string | undefined => {
  const [origin, setOrigin] = useState<string | undefined>(undefined)

  useEffect(() => {
    setOrigin(resolveSharedUiOrigin(window.location.host))
  }, [])

  return origin
}

export default useSharedUiOrigin
