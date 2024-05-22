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
import { capitalize, Dish, Section } from '../utils'
import { Reorder } from "framer-motion"
import { MdDragIndicator } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

const SLIDER_DEFAULT = 0
const MODAL_TIMER = 6000

function MenuRequestForm() {

  const { t } = useTranslation()

  const [title, setTitle] = useState('')
  const [menuDesc, setMenuDesc] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [section, setSection] = useState(Section.None)
  const [sweetChecked, setSweetChecked] = useState(false)
  const [sweetSlider, setSweetSlider] = useState(SLIDER_DEFAULT)
  const [bitterChecked, setBitterChecked] = useState(false)
  const [bitterSlider, setBitterSlider] = useState(SLIDER_DEFAULT)
  const [sourChecked, setSourChecked] = useState(false)
  const [sourSlider, setSourSlider] = useState(SLIDER_DEFAULT)
  const [saltyChecked, setSaltyChecked] = useState(false)
  const [saltySlider, setSaltySlider] = useState(SLIDER_DEFAULT)
  const [umamiChecked, setUmamiChecked] = useState(false)
  const [umamiSlider, setUmamiSlider] = useState(SLIDER_DEFAULT)
  const [piquantChecked, setPiquantChecked] = useState(false)
  const [piquantSlider, setPiquantSlider] = useState(SLIDER_DEFAULT)
  const [fatChecked, setFatChecked] = useState(false)
  const [fatSlider, setFatSlider] = useState(SLIDER_DEFAULT)
  const [temperatureChecked, setTemperatureChecked] = useState(false)
  const [tempSlider, setTempSlider] = useState(SLIDER_DEFAULT)
  const [textureChecked, setTextureChecked] = useState(false)
  const [textureSlider, setTextureSlider] = useState(SLIDER_DEFAULT)
  const [shapeChecked, setShapeChecked] = useState(false)
  const [shapeSlider, setShapeSlider] = useState(SLIDER_DEFAULT)
  const [isActive, setIsActive] = useState(false)
  const [color, setColor] = useState('')
  const [emotions, setEmotions] = useState([])

  const baseParams = [
    {label: t('param.sweet'), value: sweetSlider, setter: setSweetSlider, isChecked: sweetChecked, checkCallback: setSweetChecked},
    {label: t('param.bitter'), value: bitterSlider, setter: setBitterSlider, isChecked: bitterChecked, checkCallback: setBitterChecked},
    {label: t('param.sour'), value: sourSlider, setter: setSourSlider, isChecked: sourChecked, checkCallback: setSourChecked},
    {label: t('param.salty'), value: saltySlider, setter: setSaltySlider, isChecked: saltyChecked, checkCallback: setSaltyChecked},
    {label: t('param.umami'), value: umamiSlider, setter: setUmamiSlider, isChecked: umamiChecked, checkCallback: setUmamiChecked},
  ]

  const otherParams = [
    {label: t('param.piquant'), value: piquantSlider, setter: setPiquantSlider, isChecked: piquantChecked, checkCallback: setPiquantChecked},
    {label: t('param.fat'), value: fatSlider, setter: setFatSlider, isChecked: fatChecked, checkCallback: setFatChecked},
    {label: t('param.temperature'), value: tempSlider, setter: setTempSlider, min: -10, max: 40, isChecked: temperatureChecked, checkCallback: setTemperatureChecked},
    {label: t('param.texture'), value: textureSlider, setter: setTextureSlider, isChecked: textureChecked, checkCallback: setTextureChecked},
    {label: t('param.shape'), value: shapeSlider, setter: setShapeSlider, isChecked: shapeChecked, checkCallback: setShapeChecked},
  ]
  const [dishes, setDishes] = useState<Array<Dish>>([])
  
  const toast = useToast()
  const {isOpen, onOpen, onClose} = useDisclosure()

  const updateDish = (name: string, dish: Dish) => {
    const newDishes = dishes.map((d) => d.name === name ? dish : d)
    setDishes(newDishes)
  }

  const saveDish = () => {
    let state = {
      name: name,
      description: description,
      section: section,
      sweet: sweetChecked ? sweetSlider : null,
      bitter: bitterChecked ? bitterSlider : null,
      sour: sourChecked ? sourSlider : null,
      salty: saltyChecked ? saltySlider : null,
      umami: umamiChecked ? umamiSlider : null,
      piquant: piquantChecked ? piquantSlider : null,
      fat: fatChecked ? fatSlider : null,
      temperature: temperatureChecked ? tempSlider : null,
      texture: textureChecked ? textureSlider : null,
      shape: shapeChecked ? shapeSlider : null,
      color: isActive ? color : null,
    }

    if (!name) {
      toast({
        title: t("toast.nameRequired.title"),
        description: t("toast.nameRequired.description"),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    if (dishes.find((dish) => dish.name === name)) {
      updateDish(name, state)
      toast({
        title: t("toast.dishUpdated.title"),
        description: t("toast.dishUpdated.description"),
        status: 'success',
        duration: MODAL_TIMER,
        isClosable: true,
      })
    } else
      setDishes([...dishes, state])

    setName('')
    setDescription('')

    onClose()
  }

  const deleteDish = (name: string) => {
    const newDishes = dishes.filter((dish) => dish.name !== name)
    setDishes(newDishes)
  }

  const loadDish = (name: string) => {
    const dish = dishes.find((dish) => dish.name === name)
    if (!dish) {
      toast({
        title: t("toast.dishNotFound.title"),
        description: t("toast.dishNotFound.description"),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    setName(dish.name)
    setDescription(dish.description ?? '')
    setSweetChecked(dish.sweet != null)
    setSweetSlider(dish.sweet ?? SLIDER_DEFAULT)
    setBitterChecked(dish.bitter != null)
    setBitterSlider(dish.bitter ?? SLIDER_DEFAULT)
    setSourChecked(dish.sour != null)
    setSourSlider(dish.sour ?? SLIDER_DEFAULT)
    setSaltyChecked(dish.salty != null)
    setSaltySlider(dish.salty ?? SLIDER_DEFAULT)
    setUmamiChecked(dish.umami != null)
    setUmamiSlider(dish.umami ?? SLIDER_DEFAULT)
    setPiquantChecked(dish.piquant != null)
    setPiquantSlider(dish.piquant ?? SLIDER_DEFAULT)
    setFatChecked(dish.fat != null)
    setFatSlider(dish.fat ?? SLIDER_DEFAULT)
    setTemperatureChecked(dish.temperature != null)
    setTempSlider(dish.temperature ?? SLIDER_DEFAULT)
    setTextureChecked(dish.texture != null)
    setTextureSlider(dish.texture ?? SLIDER_DEFAULT)
    setShapeChecked(dish.shape != null)
    setShapeSlider(dish.shape ?? SLIDER_DEFAULT)
    setIsActive(dish.color != null)
    setColor(dish.color ?? '')
  }

  const submitMenu = () => {

    if (!title) {
      toast({
        title: t("toast.menuTitleRequired.title"),
        description: t("toast.menuTitleRequired.description"),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    if (dishes.length === 0) {
      toast({
        title: t("toast.dishesRequired.title"),
        description: t("toast.dishesRequired.description"),
        status: 'error',
        duration: MODAL_TIMER,
        isClosable: true,
      })
      return
    }

    toast({
      title: t("toast.menuSubmitted.title"),
      description: t("toast.menuSubmitted.description"),
      status: 'success',
      duration: MODAL_TIMER,
      isClosable: true,
    })

    const menu = {
      title: title,
      description: menuDesc,
      dishes: dishes,
    }
    console.log(menu)
  }

  return (
    <>
      <InputWrapper label={t("main.menuTitle")} isRequired>
        <Input value={title} onChange={(e) => { e.preventDefault(); setTitle(e.target.value) }} />
        <FormHelperText mb={3}>{t("main.formTitleCaption")}</FormHelperText>
      </InputWrapper>

      <InputWrapper label={t("main.description")} isRequired={false}>
        <Textarea
          value={menuDesc}
          onChange={(e) => {e.preventDefault(); setMenuDesc(e.target.value)}}
          placeholder={t("main.descriptionPlaceholder")}
        />
      </InputWrapper>

      <Container maxW={'xl'} bg={'gray.300'} borderRadius={5} p={3} mt={6}>
        <Flex>
          <Center>
            <Icon boxSize={6} mr={2} as={RiRestaurantFill} />
            <Text>{t("main.menuItems")}</Text>
          </Center>
          <Spacer />
          <Button
            onClick={() => {
              if (dishes.length != 0) {
                loadDish(dishes[dishes.length - 1]?.name ?? '')
                setName('')
                setDescription('')
              }
              onOpen()
            }}
            leftIcon={<AddIcon />}
          >
            {t("main.addItem")}
          </Button>

          <Modal
            scrollBehavior='outside'
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <Stack direction='row'>
                <Center>
                  <div>
                    <ModalHeader>{t('modal.title')}</ModalHeader>
                  </div>
                </Center>
                <Center>
                  <div>
                    <Select
                      value={section}
                      onChange={(e) => setSection(e.target.value as Section)}
                      size='sm'
                      borderRadius='1rem'
                      bg='coral'
                      color='white'
                    >
                      <option value={Section.Appetizer}>{t('cathegory.appetizer')}</option>
                      <option value={Section.FirstCourse}>{t('cathegory.firstCourse')}</option>
                      <option value={Section.SecondCourse}>{t('cathegory.secondCourse')}</option>
                      <option value={Section.Dessert}>{t('cathegory.dessert')}</option>
                      <option value={Section.None}>{t('cathegory.none')}</option>
                    </Select>
                  </div>
                </Center>
              </Stack>
              <ModalCloseButton />
              <ModalBody>
                <InputWrapper label={t('modal.name')} isRequired>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </InputWrapper>
                <InputWrapper label={t('modal.description')} isRequired={false}>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </InputWrapper>

                <Heading mt={4} mb={6} size='md'>Base tastes</Heading>
                <Stack direction='column' spacing='2.5rem'>

                  {baseParams.map((param, index) => {
                    return (
                      <TasteSlider
                        key={index}
                        label={capitalize(param.label)}
                        ariaLabel={`${param.label.toLowerCase()}-slider`}
                        value={param.value}
                        setValueCallback={param.setter}
                        isChecked={param.isChecked}
                        checkCallback={param.checkCallback}
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
                        isChecked={param.isChecked}
                        checkCallback={param.checkCallback}
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
                  <option value='option1'>{capitalize(t('emotions.joy'))}</option>
                  <option value='option2'>{capitalize(t('emotions.anger'))}</option>
                  <option value='option3'>{capitalize(t('emotions.fear'))}</option>
                  <option value='option4'>{capitalize(t('emotions.sadness'))}</option>
                  <option value='option5'>{capitalize(t('emotions.surprise'))}</option>
                </Select>
                </Stack>

              </ModalBody>

              <ModalFooter justifyContent={'center'}>
                <Button colorScheme='blue' mr={3} onClick={saveDish}>{t('modal.submit')}</Button>
                <Button colorScheme='red' onClick={onClose}>{t('modal.cancel')}</Button>
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
                      <Button
                        variant='outline'
                        colorScheme='red'
                        onClick={() => deleteDish(dish.name)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant='outline'
                        colorScheme='blue'
                        onClick={() => {loadDish(dish.name); onOpen()}}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </Reorder.Item>
                )) : 
                  <Text color={'gray.500'}>
                    {t("main.emptyMenu")}
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