// import { Select } from "@chakra-ui/react"
import { changeLanguage } from "i18next"
import { useTranslation } from "react-i18next"
import { Select } from "chakra-react-select";
import { useState } from "react";

const languages = [
  {value: 'it', label: '🇮🇹'},
  {value: 'en', label: '🇬🇧'},
]

function LanguageSelector() {

  const {i18n} = useTranslation()
  const [selected, setSelected] = useState({label: languages[1].label, value: i18n.language})

  const handleSelection = (e: any) => {
    setSelected(e)
    changeLanguage(e.value)
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
