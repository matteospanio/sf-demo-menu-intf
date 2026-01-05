import { useTranslation } from 'react-i18next'
import { Select } from "chakra-react-select";
import { FormControl, FormLabel } from '@chakra-ui/react';
import { ApiShape } from '../../../api';

interface ShapesSelectApiProps {
  shapes: ApiShape[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

function ShapesSelectApi({ shapes, selectedIds, onChange }: ShapesSelectApiProps) {
  const { t } = useTranslation()

  const options = shapes.map(shape => ({
    label: t(`shapes.${shape.description}`),
    value: shape.id,
  }));

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.value));

  const handleChange = (selected: typeof options) => {
    onChange(selected.map(item => item.value));
  }

  return (
    <FormControl>
      <FormLabel ml={6}>{t('shapes.description')}</FormLabel>
      <Select
        isMulti
        colorScheme="yellow"
        placeholder={t('shapes.select')}
        value={selectedOptions}
        options={options}
        onChange={(e) => handleChange(e as typeof options)}
      />
    </FormControl>
  )
}

export default ShapesSelectApi;
