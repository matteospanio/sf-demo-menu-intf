import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { FormControl, FormLabel } from '@chakra-ui/react';
import { ApiEmotion } from '../api';

interface EmotionSelectApiProps {
  emotions: ApiEmotion[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

function EmotionSelectApi({ emotions, selectedIds, onChange }: EmotionSelectApiProps) {
  const { t } = useTranslation()

  const options = emotions.map(emotion => ({
    label: emotion.description,
    value: emotion.id,
  }));

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.value));

  const handleChange = (selected: typeof options) => {
    onChange(selected.map(item => item.value));
  }

  return (
    <FormControl>
      <FormLabel ml={6}>{t('emotions.description')}</FormLabel>
      <Select
        isMulti
        placeholder={t('emotions.select')}
        colorScheme="blue"
        value={selectedOptions}
        options={options}
        onChange={(e) => handleChange(e as typeof options)}
      />
    </FormControl>
  )
}

export default EmotionSelectApi;
