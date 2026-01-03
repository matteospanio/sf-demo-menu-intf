import { describe, expect, it } from 'vitest'
import {
  loadClientSettings,
  saveClientSettings,
  updateClientSettings,
  type ClientSettings,
} from './clientSettingsStorage'

const createMemoryStorage = () => {
  const data = new Map<string, string>()

  const storage: Storage = {
    length: 0,
    clear: () => data.clear(),
    getItem: (key: string) => data.get(key) ?? null,
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    removeItem: (key: string) => data.delete(key),
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
  }

  return storage
}

describe('clientSettingsStorage', () => {
  it('returns empty settings for missing key', () => {
    const storage = createMemoryStorage()
    expect(loadClientSettings(storage)).toEqual({})
  })

  it('saves and loads settings', () => {
    const storage = createMemoryStorage()
    const settings: ClientSettings = { colorMode: 'dark', language: 'it' }

    saveClientSettings(settings, storage)

    expect(loadClientSettings(storage)).toEqual(settings)
  })

  it('ignores invalid JSON', () => {
    const storage = createMemoryStorage()
    storage.setItem('sf_client_settings', '{not-json')

    expect(loadClientSettings(storage)).toEqual({})
  })

  it('merges patches on update', () => {
    const storage = createMemoryStorage()
    saveClientSettings({ colorMode: 'light', language: 'en' }, storage)

    const updated = updateClientSettings({ language: 'it' }, storage)

    expect(updated).toEqual({ colorMode: 'light', language: 'it' })
    expect(loadClientSettings(storage)).toEqual({ colorMode: 'light', language: 'it' })
  })
})
