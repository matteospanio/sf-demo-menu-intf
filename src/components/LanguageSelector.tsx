import { Select } from "@chakra-ui/react"
import { changeLanguage } from "i18next"
import { useTranslation } from "react-i18next"

const languages = [
    {code: 'it', language: 'Italiano', flag: '🇮🇹'},
    {code: 'en', language: 'English', flag: '🇬🇧'},
]

function LanguageSelector() {

  const {i18n} = useTranslation()
  console.log(i18n.language)

  return (
    <Select size='sm' bg='white' mr={3}>
        {languages.map((lang) => {
            return (
                <option
                    selected={i18n.language === lang.code}
                    onClick={() => {changeLanguage(lang.code)}}
                    key={lang.code}
                >
                    {lang.flag} {lang.code}
                </option>
            )
        })}
    </Select>
  )
}

export default LanguageSelector