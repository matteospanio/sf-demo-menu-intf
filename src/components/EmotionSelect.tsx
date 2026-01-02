import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { Emotion, SelectOption, capitalize } from '../utils'
import { FormControl, FormLabel } from '@chakra-ui/react';
import type { MultiValue } from 'react-select'

interface EmotionSelectProps {
  handler: (values: Emotion[]) => void
}

function EmotionSelect({handler}: EmotionSelectProps) {
  const {t} = useTranslation()

  const emotionOptions = [
    { label: capitalize(t('emotions.joy')), value: Emotion.Joy },
    { label: capitalize(t('emotions.surprise')), value: Emotion.Surprise },
    { label: capitalize(t('emotions.satisfaction')), value: Emotion.Satisfaction },
    { label: capitalize(t('emotions.serenity')), value: Emotion.Serenity },
    { label: capitalize(t('emotions.euphoria')), value: Emotion.Euphoria },
    { label: capitalize(t('emotions.conviviality')), value: Emotion.Conviviality },
    { label: capitalize(t('emotions.playfulness')), value: Emotion.Playfulness },
  ]

  type EmotionOption = SelectOption<Emotion>
  const [emotionSelect, setEmoSelect] = useState<MultiValue<EmotionOption>>([])

  const handleSectionSelect = (value: MultiValue<EmotionOption>) => {
    setEmoSelect(value)
    handler(value.map((el) => el.value))
  }

  return (
    <FormControl>
    <FormLabel ml={6}>{t('emotions.description')}</FormLabel>
    <Select
      isMulti
      placeholder={t('emotions.select')}
      colorScheme="blue"
      value={emotionSelect}
      options={emotionOptions}
      onChange={handleSectionSelect}
    />
    </FormControl>
  )
}

export default EmotionSelect
