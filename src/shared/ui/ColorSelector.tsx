import { Box, Checkbox, Stack } from '@chakra-ui/react'

interface ColorSelectorProps {
  label: string
  value: string
  isChecked: boolean
  checkHandler: (checked: boolean) => void
  colorSetter: (color: string) => void
}

function ColorSelector({colorSetter, isChecked, checkHandler, value, label}: ColorSelectorProps) {
  return (
    <Stack direction={'row'} align="center">
      <Checkbox mr='5rem' isChecked={isChecked} onChange={(e) => checkHandler(e.target.checked)}>{label}</Checkbox>
      <Box
        as="input"
        type="color"
        disabled={!isChecked}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => colorSetter(e.target.value)}
        w="40px"
        h="40px"
        p={0}
        border="2px solid"
        borderColor={isChecked ? "brand.500" : "gray.600"}
        borderRadius="md"
        cursor={isChecked ? "pointer" : "not-allowed"}
        opacity={isChecked ? 1 : 0.5}
        _hover={isChecked ? { borderColor: "brand.400" } : {}}
        sx={{
          '&::-webkit-color-swatch-wrapper': { padding: 0 },
          '&::-webkit-color-swatch': { border: 'none', borderRadius: '4px' },
        }}
      />
    </Stack>
  )
}

export default ColorSelector
