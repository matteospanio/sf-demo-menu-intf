import { Checkbox, Stack } from '@chakra-ui/react'

interface ColorSelectorProps {
  label: string
  value: string
  isChecked: boolean
  checkHandler: (checked: boolean) => void
  colorSetter: (color: string) => void
}

function ColorSelector({colorSetter, isChecked, checkHandler, value, label}: ColorSelectorProps) {
  return (
    <Stack direction={'row'}>
      <Checkbox mr='5rem' isChecked={isChecked} onChange={(e) => checkHandler(e.target.checked)}>{label}</Checkbox>
      <input disabled={!isChecked} type='color' value={value} onChange={(e) => colorSetter(e.target.value)} />
    </Stack>
  )
}

export default ColorSelector
