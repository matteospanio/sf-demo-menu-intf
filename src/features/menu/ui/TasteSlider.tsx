import { Box, Checkbox, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Stack } from "@chakra-ui/react"
import { RxValue } from "react-icons/rx"
import { capitalize, Optional } from "../../../shared/lib"
import { useTranslation } from "react-i18next"

interface TasteSliderProps {
    label: string
    ariaLabel: string
    value: number
    isChecked: boolean
    checkCallback: (checked: boolean) => void
    max?: number
    min?: number
    setValueCallback: (taste: string, value: Optional<number>) => void
}

function TasteSlider({label, ariaLabel, value, max, min, setValueCallback, isChecked, checkCallback} : TasteSliderProps) {
  const {t} = useTranslation()
  const propertyName = label.split('.').pop()

  return (
    <Stack direction={'row'} justifyContent='space-between'>
    <Checkbox
        isChecked={isChecked}
        onChange={(e) => {
            checkCallback(e.target.checked)
        }}
    >
        {capitalize(t(`tastes.${label}`))}
    </Checkbox>
    <Slider
        w={'250px'}
        isDisabled={!isChecked}
        value={isChecked ? value : (min ?? 0)}
        step={0.5}
        max={max ?? 10}
        min={min ?? 0}
        aria-label={ariaLabel}
        onChange={(val) => setValueCallback(propertyName ?? label, val)}
    >
        <SliderMark
            hidden={!isChecked}
            borderRadius={15}
            value={value}
            textAlign='center'
            bg='brand.500'
            color='gray.800'
            mt='-9'
            ml='-6'
            w='14'
            fontWeight='semibold'
        >
            {label == 'other.temperature' ? `${value}°C` : value}
        </SliderMark>
        <SliderTrack bg='gray.600'>
            <SliderFilledTrack bg='brand.500' />
        </SliderTrack>
        <SliderThumb boxSize={5} bg='brand.500'>
            <Box color='gray.800' as={RxValue} />
        </SliderThumb>
    </Slider>
    </Stack>
  )
}

export default TasteSlider
