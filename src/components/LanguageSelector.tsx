// import { Select } from "@chakra-ui/react"
import { changeLanguage } from "i18next"
import { useTranslation } from "react-i18next"
import { Select } from "chakra-react-select";
import { useState } from "react";
import type { SingleValue } from 'react-select'

type Language = 'it' | 'en'
type LanguageOption = { value: Language; label: string }

const languages: readonly LanguageOption[] = [
  {value: 'it', label: '🇮🇹'},
  {value: 'en', label: '🇬🇧'},
]

function LanguageSelector() {

  const {i18n} = useTranslation()
  const [selected, setSelected] = useState<LanguageOption>(() => {
    const current = i18n.language as Language
    return languages.find((l) => l.value === current) ?? languages[1]
  })

  const handleSelection = (value: SingleValue<LanguageOption>) => {
    if (!value) return
    setSelected(value)
    changeLanguage(value.value)
  }

  return (
    <Select
      size='sm'
      options={languages}
      value={selected}
      onChange={handleSelection}
    />
  )
}

export default LanguageSelector
