import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { Section } from '../utils';

interface SectionSelectProps {
  sectionHandler: any
}

function SectionSelect({sectionHandler}: SectionSelectProps) {
  const { t } = useTranslation();

  const sectionOptions = [
    { label: t('cathegory.appetizer'), value: Section.Appetizer },
    { label: t('cathegory.firstCourse'), value: Section.FirstCourse },
    { label: t('cathegory.secondCourse'), value: Section.SecondCourse },
    { label: t('cathegory.dessert'), value: Section.Dessert },
    { label: t('cathegory.none'), value: Section.None },
  ]

  const [sectionSelect, setSecSelect] = useState(sectionOptions[4])

  const handleSectionSelect = (e: any) => {
    setSecSelect(e)
    sectionHandler(e.value)
  }

  return (
    <Select
      value={sectionSelect}
      options={sectionOptions}
      onChange={handleSectionSelect}
      size='sm'
    />
  )
}

export default SectionSelect