import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { Texture, SelectOption, capitalize } from '../utils'
import { FormControl, FormLabel } from '@chakra-ui/react';
import type { MultiValue } from 'react-select'

interface TextureSelectProps {
  handler: (values: Texture[]) => void
}

function TextureSelect({handler}: TextureSelectProps) {
  const {t} = useTranslation()
  const options = [
    { label: capitalize(t('textures.rough')), value: Texture.Rough },
    { label: capitalize(t('textures.soft')), value: Texture.Soft },
    { label: capitalize(t('textures.hard')), value: Texture.Hard },
    { label: capitalize(t('textures.creamy')), value: Texture.Creamy},
    { label: capitalize(t('textures.crunchy')), value: Texture.Crunchy},
    { label: capitalize(t('textures.liquid')), value: Texture.Liquid},
    { label: capitalize(t('textures.viscous')), value: Texture.Viscous},
    { label: capitalize(t('textures.solid')), value: Texture.Solid},
    { label: capitalize(t('textures.hollow')), value: Texture.Hollow},
    { label: capitalize(t('textures.dense')), value: Texture.Dense},
    { label: capitalize(t('textures.porous')), value: Texture.Porous},
    { label: capitalize(t('textures.airy')), value: Texture.Airy},
  ]

  type TextureOption = SelectOption<Texture>
  const [selected, setSelected] = useState<MultiValue<TextureOption>>([])

  const handleSelect = (value: MultiValue<TextureOption>) => {
    setSelected(value)
    handler(value.map((el) => el.value))
  }

  return (
    <FormControl>

      <FormLabel ml={6}>{t('textures.description')}</FormLabel>
      <Select
        isMulti
        colorScheme="blue"
        placeholder={t('textures.select')}
        value={selected}
        options={options}
        onChange={handleSelect}
      />
    </FormControl>
  )
}

export default TextureSelect
