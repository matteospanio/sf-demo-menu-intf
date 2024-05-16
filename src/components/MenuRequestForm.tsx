import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Flex, 
  FormHelperText, 
  Heading, 
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { AddIcon, EmailIcon } from '@chakra-ui/icons'
import { FaSave } from 'react-icons/fa'
import { RiRestaurantFill } from 'react-icons/ri'
import { useState } from 'react'
import InputWrapper from './InputWrapper'
import TasteSlider from './TasteSlider'
import { capitalize, Dish } from '../utils'
import { Reorder } from "framer-motion"
import { MdDragIndicator } from 'react-icons/md'

const SLIDER_DEFAULT = 0

function MenuRequestForm() {
  const [title, setTitle] = useState('')
  const [menuDesc, setMenuDesc] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sweetSlider, setSweetSlider] = useState(SLIDER_DEFAULT)
  const [bitterSlider, setBitterSlider] = useState(SLIDER_DEFAULT)
  const [sourSlider, setSourSlider] = useState(SLIDER_DEFAULT)
  const [saltySlider, setSaltySlider] = useState(SLIDER_DEFAULT)
  const [umamiSlider, setUmamiSlider] = useState(SLIDER_DEFAULT)
  const [piquantSlider, setPiquantSlider] = useState(SLIDER_DEFAULT)
  const [fatSlider, setFatSlider] = useState(SLIDER_DEFAULT)
  const [tempSlider, setTempSlider] = useState(SLIDER_DEFAULT)
  const [textureSlider, setTextureSlider] = useState(SLIDER_DEFAULT)
  const [shapeSlider, setShapeSlider] = useState(SLIDER_DEFAULT)
  const [isActive, setIsActive] = useState(false)
  const [color, setColor] = useState('')

  const baseParams = [
    {label: 'sweet', value: sweetSlider, setter: setSweetSlider},
    {label: 'bitter', value: bitterSlider, setter: setBitterSlider},
    {label: 'sour', value: sourSlider, setter: setSourSlider},
    {label: 'salty', value: saltySlider, setter: setSaltySlider},
    {label: 'umami', value: umamiSlider, setter: setUmamiSlider},
  ]

  const otherParams = [
    {label: 'piquant', value: piquantSlider, setter: setPiquantSlider},
    {label: 'fat', value: fatSlider, setter: setFatSlider},
    {label: 'temperature', value: tempSlider, setter: setTempSlider, min: -10, max: 40},
    {label: 'texture', value: textureSlider, setter: setTextureSlider},
    {label: 'shape', value: shapeSlider, setter: setShapeSlider},
  ]
  const [dishes, setDishes] = useState<Array<Dish>>([])
  
  const toast = useToast()
  const {isOpen, onOpen, onClose} = useDisclosure()

  const saveDish = () => {

    if (!name) {
      toast({
        title: 'Name is required',
        description: 'Please provide a name for the dish.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    if (dishes.find((dish) => dish.name === name)) {
      toast({
        title: 'Dish already exists',
        description: 'A dish with the same name already exists. Please provide a different name.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    setDishes([...dishes, {
      name: name,
      description: description,
      sweet: sweetSlider,
      bitter: bitterSlider,
      sour: sourSlider,
      salty: saltySlider,
      umami: umamiSlider,
      piquant: piquantSlider,
      fat: fatSlider,
      temperature: tempSlider,
      texture: textureSlider,
      shape: shapeSlider,
      color: color,
    }])

    setName('')
    setDescription('')

    onClose()
  }

  const loadDish = (name: string) => {
    const dish = dishes.find((dish) => dish.name === name)
    if (!dish) {
      toast({
        title: 'Dish not found',
        description: 'The dish you are trying to edit does not exist.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    setName(dish.name)
    setDescription(dish.description ?? '')
    setSweetSlider(dish.sweet ?? SLIDER_DEFAULT)
    setBitterSlider(dish.bitter ?? SLIDER_DEFAULT)
    setSourSlider(dish.sour ?? SLIDER_DEFAULT)
    setSaltySlider(dish.salty ?? SLIDER_DEFAULT)
    setUmamiSlider(dish.umami ?? SLIDER_DEFAULT)
    setPiquantSlider(dish.piquant ?? SLIDER_DEFAULT)
    setFatSlider(dish.fat ?? SLIDER_DEFAULT)
    setTempSlider(dish.temperature ?? SLIDER_DEFAULT)
    setTextureSlider(dish.texture ?? SLIDER_DEFAULT)
    setShapeSlider(dish.shape ?? SLIDER_DEFAULT)
    setColor(dish.color ?? '')
  }

  const submitMenu = () => {

    if (!title) {
      toast({
        title: 'Title is required',
        description: 'Please provide a title for the menu.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    if (dishes.length === 0) {
      toast({
        title: 'Dishes are required',
        description: 'Please add at least one dish to the menu.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      return
    }

    toast({
      title: 'Menu request submitted',
      description: `Your request for a menu titled ${title} has been submitted.`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    })

    console.log('Menu request submitted')
    const menu = {
      title: title,
      description: menuDesc,
      dishes: dishes,
    }
    console.log(menu)
  }

  return (
    <>
      <InputWrapper label='Menu title' isRequired>
        <Input value={title} onChange={(e) => { e.preventDefault(); setTitle(e.target.value) }} />
        <FormHelperText mb={3}>The id you'll use to refer to the menu.</FormHelperText>
      </InputWrapper>

      <InputWrapper label='Description' isRequired={false}>
        <Textarea
          value={menuDesc}
          onChange={(e) => {e.preventDefault(); setMenuDesc(e.target.value)}}
          placeholder='A qualitative description of the menu.'
        />
      </InputWrapper>

      <Container maxW={'xl'} bg={'gray.300'} borderRadius={5} p={3} mt={6}>
        <Flex>
          <Center>
            <Icon boxSize={6} mr={2} as={RiRestaurantFill} />
            <Text>Portate</Text>
          </Center>
          <Spacer />
          <Button onClick={onOpen} leftIcon={<AddIcon />}>Add</Button>

          <Modal
            scrollBehavior='outside'
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Nuova portata</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <InputWrapper label='Nome' isRequired>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </InputWrapper>
                <InputWrapper label='Descrizione' isRequired={false}>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </InputWrapper>

                <Heading mt={4} mb={6} size='md'>Base tastes</Heading>
                <Stack direction='column' spacing='2.5rem'>

                  {baseParams.map((param, index) => {
                    return (
                      <TasteSlider
                        key={index}
                        label={capitalize(param.label)}
                        ariaLabel={`${param.label}-slider`}
                        value={param.value}
                        setValueCallback={param.setter}
                      />
                    )
                  })}

                </Stack>
                <Heading mt={6} mb={6} size='md'>Other parameters</Heading>
                <Stack direction='column' spacing='2.5rem'>

                  {otherParams.map((param, index) => {
                    return (
                      <TasteSlider
                        key={index}
                        label={capitalize(param.label)}
                        ariaLabel={`${param.label}-slider`}
                        value={param.value}
                        setValueCallback={param.setter}
                        min={param.min}
                        max={param.max}
                      />
                    )
                  })}

                </Stack>
                <Heading mt={4} mb={6} size='md'>Scala cromatica</Heading>

                <Stack direction={'row'}>
                  <Checkbox mr='5rem' isChecked={isActive} onChange={(e) => setIsActive(e.target.checked)}>Color</Checkbox>
                  <input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
                </Stack>

                <Heading mt={4} mb={6} size='md'>Emozioni</Heading>

                <Stack direction='row'>
                <Checkbox mr='3rem'>Emotion</Checkbox>
                <Select placeholder='None'>
                  <option value='option1'>Joy</option>
                  <option value='option2'>Anger</option>
                  <option value='option3'>Fear</option>
                </Select>
                </Stack>

              </ModalBody>

              <ModalFooter justifyContent={'center'}>
                <Button colorScheme='blue' mr={3} onClick={saveDish}>Save</Button>
                <Button colorScheme='red' onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </Flex>

        <Center>
          <Box minHeight='5rem'>
              <Reorder.Group style={{listStyleType: 'none', width: '24rem'}} axis='y' values={dishes} onReorder={setDishes}>
                {dishes.length != 0 ? dishes.map((dish) => (
                  <Reorder.Item style={{marginBottom: 6}} key={dish.name} value={dish}>
                    <Stack direction='row'>
                      <Center>
                        <Icon as={MdDragIndicator} boxSize={6} />
                        <Text>{dish.name}</Text>
                      </Center>
                      <Spacer />
                      <Button variant='outline' colorScheme='red'>Delete</Button>
                      <Button variant='outline' colorScheme='blue'>Edit</Button>
                    </Stack>
                  </Reorder.Item>
                )) : 
                  <Text color={'gray.500'}>
                    Empty
                  </Text>
                }
              </Reorder.Group>
          </Box>
        </Center>

      </Container>

      <Center mt={5}>
        <Stack direction={'row'}>
          <Button onClick={submitMenu} variant={'solid'} colorScheme='blue' leftIcon={<EmailIcon />}>
            Send
          </Button>
          <Button variant={'outline'} colorScheme='blue' leftIcon={<FaSave />}>
            Save
          </Button>
        </Stack>
      </Center>
    </>
  )
}

export default MenuRequestForm