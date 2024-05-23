import {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { Emotion } from '../utils'

interface EmotionSelectProps {
  handler: any
}

interface Option<T> {
  label: string,
  value: T
}

function EmotionSelect({handler}: EmotionSelectProps) {
  const {t} = useTranslation()

  const emotionOptions = [
    { label: t('emotions.joy'), value: Emotion.Joy },
    { label: t('emotions.anger'), value: Emotion.Anger },
    { label: t('emotions.fear'), value: Emotion.Fear },
    { label: t('emotions.sadness'), value: Emotion.Sadness },
    { label: t('emotions.surprise'), value: Emotion.Surprise },
  ]

  const [emotionSelect, setEmoSelect] = useState()

  const handleSectionSelect = (e: any) => {
    setEmoSelect(e)
    handler(e.map((el: Option<Emotion>) => el.value))
  }

  return (
    <Select
      isMulti
      colorScheme="blue"
      value={emotionSelect}
      options={emotionOptions}
      onChange={handleSectionSelect}
      // size='sm'
    />
  )
}

export default EmotionSelect

