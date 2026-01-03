import { useCallback, useEffect } from 'react'
import { useColorMode } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import {
  type ClientColorMode,
  type ClientLanguage,
  loadClientSettings,
  updateClientSettings,
} from '../shared/lib/clientSettingsStorage'

export interface UseClientSettingsResult {
  colorMode: ClientColorMode
  language: string
  setColorModePersisted: (mode: ClientColorMode) => void
  setLanguagePersisted: (language: ClientLanguage) => void
}

export const useClientSettings = (): UseClientSettingsResult => {
  const { colorMode, setColorMode } = useColorMode()
  const { i18n } = useTranslation()

  useEffect(() => {
    const stored = loadClientSettings()

    if (stored.language && stored.language !== i18n.language) {
      void i18n.changeLanguage(stored.language)
    }

    if (stored.colorMode && stored.colorMode !== colorMode) {
      setColorMode(stored.colorMode)
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setColorModePersisted = useCallback(
    (mode: ClientColorMode) => {
      setColorMode(mode)
      updateClientSettings({ colorMode: mode })
    },
    [setColorMode]
  )

  const setLanguagePersisted = useCallback(
    (language: ClientLanguage) => {
      void i18n.changeLanguage(language)
      updateClientSettings({ language })
    },
    [i18n]
  )

  return {
    colorMode: colorMode as ClientColorMode,
    language: i18n.language,
    setColorModePersisted,
    setLanguagePersisted,
  }
}
