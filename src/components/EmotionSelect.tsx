import {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { Emotion, SelectOption, capitalize } from '../utils'
import { FormControl, FormLabel } from '@chakra-ui/react';

interface EmotionSelectProps {
  handler: any
}

function EmotionSelect({handler}: EmotionSelectProps) {
  const {t} = useTranslation()

  const emotionOptions = [
    { label: capitalize(t('emotions.joy')), value: Emotion.Joy },
    { label: capitalize(t('emotions.anger')), value: Emotion.Anger },
    { label: capitalize(t('emotions.fear')), value: Emotion.Fear },
    { label: capitalize(t('emotions.sadness')), value: Emotion.Sadness },
    { label: capitalize(t('emotions.surprise')), value: Emotion.Surprise },
  ]

  const [emotionSelect, setEmoSelect] = useState()

  const handleSectionSelect = (e: any) => {
    setEmoSelect(e)
    handler(e.map((el: SelectOption<Emotion>) => el.value))
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

