import { CLIENT_SETTINGS_STORAGE_KEY } from '../config'

export type ClientColorMode = 'light' | 'dark'
export type ClientLanguage = 'en' | 'it'

export interface ClientSettings {
  colorMode?: ClientColorMode
  language?: ClientLanguage
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const parseLanguage = (value: unknown): ClientLanguage | undefined =>
  value === 'en' || value === 'it' ? value : undefined

const parseColorMode = (value: unknown): ClientColorMode | undefined =>
  value === 'light' || value === 'dark' ? value : undefined

export const loadClientSettings = (storage: Storage = window.localStorage): ClientSettings => {
  try {
    const raw = storage.getItem(CLIENT_SETTINGS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!isRecord(parsed)) return {}

    return {
      language: parseLanguage(parsed.language),
      colorMode: parseColorMode(parsed.colorMode),
    }
  } catch {
    return {}
  }
}

export const saveClientSettings = (
  settings: ClientSettings,
  storage: Storage = window.localStorage
): void => {
  storage.setItem(CLIENT_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export const updateClientSettings = (
  patch: Partial<ClientSettings>,
  storage: Storage = window.localStorage
): ClientSettings => {
  const current = loadClientSettings(storage)
  const next: ClientSettings = {
    ...current,
    ...patch,
  }

  saveClientSettings(next, storage)
  return next
}
