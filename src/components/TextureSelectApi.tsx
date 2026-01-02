import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { FormControl, FormLabel } from '@chakra-ui/react';
import { ApiTexture } from '../api';

interface TextureSelectApiProps {
  textures: ApiTexture[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

function TextureSelectApi({ textures, selectedIds, onChange }: TextureSelectApiProps) {
  const { t } = useTranslation()

  const options = textures.map(texture => ({
    label: texture.description,
    value: texture.id,
  }));

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.value));

  const handleChange = (selected: typeof options) => {
    onChange(selected.map(item => item.value));
  }

  return (
    <FormControl>
      <FormLabel ml={6}>{t('textures.description')}</FormLabel>
      <Select
        isMulti
        colorScheme="blue"
        placeholder={t('textures.select')}
        value={selectedOptions}
        options={options}
        onChange={(e) => handleChange(e as typeof options)}
      />
    </FormControl>
  )
}

export default TextureSelectApi;
