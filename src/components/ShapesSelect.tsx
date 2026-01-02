import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { Shape, SelectOption, capitalize } from '../utils'
import { FormControl, FormLabel } from '@chakra-ui/react';
import type { MultiValue } from 'react-select'

interface ShapeSelectProps {
  handler: (param: 'shapes', values: Shape[]) => void
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

  type ShapeOption = SelectOption<Shape>
  const [selected, setSelected] = useState<MultiValue<ShapeOption>>([])

  const handleSectionSelect = (value: MultiValue<ShapeOption>) => {
    setSelected(value)
    handler('shapes', value.map((el) => el.value))
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
