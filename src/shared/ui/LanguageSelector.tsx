import { useTranslation } from 'react-i18next'
import { Select } from 'chakra-react-select'
import { useState } from 'react'
import type { SingleValue } from 'react-select'
import { useClientSettings } from '../../hooks/useClientSettings'

type Language = 'it' | 'en'
type LanguageOption = { value: Language; label: string }

const languages: readonly LanguageOption[] = [
  {value: 'it', label: '🇮🇹'},
  {value: 'en', label: '🇬🇧'},
]

function LanguageSelector() {

  const { t, i18n } = useTranslation()
  const { setLanguagePersisted } = useClientSettings()
  const [selected, setSelected] = useState<LanguageOption>(() => {
    const current = i18n.language as Language
    return languages.find((l) => l.value === current) ?? languages[1]
  })

  const handleSelection = (value: SingleValue<LanguageOption>) => {
    if (!value) return
    setSelected(value)
    setLanguagePersisted(value.value)
  }

  return (
    <Select
      aria-label={t('topLeft.language')}
      inputId="language-selector"
      instanceId="language-selector"
      data-testid="language-selector"
      size='sm'
      options={languages}
      value={selected}
      onChange={handleSelection}
    />
  )
}

export default LanguageSelector
