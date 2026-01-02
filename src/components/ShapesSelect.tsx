import {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { Shape, SelectOption, capitalize } from '../utils'
import { FormControl, FormLabel } from '@chakra-ui/react';

interface ShapeSelectProps {
  handler: any
}

function ShapesSelect({handler}: ShapeSelectProps) {
  const {t} = useTranslation()
  const options = [
    { label: capitalize(t('shapes.sharp')), value: Shape.Sharp },
    { label: capitalize(t('shapes.round')), value: Shape.Round },
    { label: capitalize(t('shapes.smooth')), value: Shape.Smooth },
    { label: capitalize(t('shapes.symmetric')), value: Shape.Symmetric },
    { label: capitalize(t('shapes.asymmetric')), value: Shape.Asymmetric },
    { label: capitalize(t('shapes.compact')), value: Shape.Compact },
    { label: capitalize(t('shapes.loose')), value: Shape.Loose }
  ]

  const [selected, setSelected] = useState()

  const handleSectionSelect = (e: any) => {
    setSelected(e)
    handler('shapes', e.map((el: SelectOption<Shape>) => el.value))
  }

  return (
    <FormControl>
      <FormLabel ml={6}>{t('shapes.description')}</FormLabel>
    <Select
      isMulti
      colorScheme="blue"
      placeholder={t('shapes.select')}
      value={selected}
      options={options}
      onChange={handleSectionSelect}
    />
    </FormControl>
  )
}

export default ShapesSelect
