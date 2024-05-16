import { Box, Checkbox, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Stack } from "@chakra-ui/react"
import { useState } from "react"
import { RxValue } from "react-icons/rx"

interface TasteSliderProps {
    label: string
    ariaLabel: string
    value: number
    max?: number
    min?: number
    setValueCallback: (value: number) => void
}

function TasteSlider({label, ariaLabel, value, max, min, setValueCallback} : TasteSliderProps) {

  const [isActive, setIsActive] = useState(false)

  return (
    <Stack direction={'row'} justifyContent='space-between'>
    <Checkbox isChecked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{label}</Checkbox>
    <Slider
        w={'250px'}
        isDisabled={!isActive}
        value={isActive ? value : (min ?? 0)}
        step={0.5}
        max={max ?? 10}
        min={min ?? 0}
        aria-label={ariaLabel}
        onChange={(val) => setValueCallback(val)}
    >
        <SliderMark
            hidden={!isActive}
            borderRadius={15}
            value={value}
            textAlign='center'
            bg='blue.600'
            color='white'
            mt='-9'
            ml='-6'
            w='12'
        >
            {value}
        </SliderMark>
        <SliderTrack>
            <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={5}>
            <Box color='blue.600' as={RxValue} />
        </SliderThumb>
    </Slider>
    </Stack>
  )
}

export default TasteSlider