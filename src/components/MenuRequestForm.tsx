import {
  Box,
  Button,
  Center,
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
  // Select,
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
import { BasicTasteConfiguration, Emotion, Optional, OtherSlideableConfig, Section, Shape, Texture } from '../utils'
import { Reorder } from "framer-motion"
import { MdDragIndicator } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { Dish, deleteListElement, saveDish } from '../dish'
import { MODAL_TIMER, SLIDER_DEFAULT } from '../constants'
// import { MultiSelect } from 'chakra-multiselect'
import { Select } from "chakra-react-select";
import SectionSelect from './SectionSelect'
import EmotionSelect from './EmotionSelect'


function MenuRequestForm() {
  // translation hook
  const { t } = useTranslation()

  // main menu state
  const [title, setTitle] = useState('')
  const [menuDesc, setMenuDesc] = useState('')

  // modal state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [section, setSection] = useState(Section.None)

  const [basicTastes, setBasicTastes] = useState<BasicTasteConfiguration>({
    sweet: SLIDER_DEFAULT,
    bitter: SLIDER_DEFAULT,
    sour: SLIDER_DEFAULT,
    salty: SLIDER_DEFAULT,
    umami: SLIDER_DEFAULT,
  })

  const [otherTastes, setOtherTastes] = useState<OtherSlideableConfig>({
    piquant: SLIDER_DEFAULT,
    fat: SLIDER_DEFAULT,
    temperature: SLIDER_DEFAULT,
  })

  const [visionParams, setVisionParams] = useState<{ colors: string[], shapes: Shape[] }>({
    colors: [],
    shapes: [],
  })

  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [texture, setTexture] = useState<Optional<Texture>>(null)

  const handleTasteChange = (taste: string, value: Optional<number>) => {
    if (taste in basicTastes)
      setBasicTastes({ ...basicTastes, [taste]: value })
    else if (taste in otherTastes)
      setOtherTastes({ ...otherTastes, [taste]: value })
    else
      throw new Error('Invalid taste parameter')
  }

  const handleVisionChange = (param: string, value: string | Shape) => {
    if (param == 'shapes')
      setVisionParams({ ...visionParams, shapes: [...visionParams.shapes, value as Shape] })
    else if (param == 'colors')
      setVisionParams({ ...visionParams, colors: [...visionParams.colors, value as string] })
    else
      throw new Error('Invalid vision parameter')
  }



  const [sweetChecked, setSweetChecked] = useState(false)
  const [bitterChecked, setBitterChecked] = useState(false)
  const [sourChecked, setSourChecked] = useState(false)
  const [saltyChecked, setSaltyChecked] = useState(false)
  const [umamiChecked, setUmamiChecked] = useState(false)
  const [piquantChecked, setPiquantChecked] = useState(false)
  const [fatChecked, setFatChecked] = useState(false)
  const [temperatureChecked, setTemperatureChecked] = useState(false)

  const baseParams = [
    { label: t('tastes.base.sweet'), isChecked: sweetChecked, checkCallback: setSweetChecked },
    { label: t('tastes.base.bitter'), isChecked: bitterChecked, checkCallback: setBitterChecked },
    { label: t('tastes.base.sour'), isChecked: sourChecked, checkCallback: setSourChecked },
    { label: t('tastes.base.salty'), isChecked: saltyChecked, checkCallback: setSaltyChecked },
    { label: t('tastes.base.umami'), isChecked: umamiChecked, checkCallback: setUmamiChecked },
  ]

  const otherParams = [
    { label: t('tastes.other.piquant'), isChecked: piquantChecked, checkCallback: setPiquantChecked },
    { label: t('tastes.other.fat'), isChecked: fatChecked, checkCallback: setFatChecked },
    { label: t('tastes.other.temperature'), min: -10, max: 40, isChecked: temperatureChecked, checkCallback: setTemperatureChecked },
  ]
  const [dishes, setDishes] = useState<Array<Dish>>([])

  const toast = useToast()
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure()

  const saveDishes = () => {
    let state: Dish = {
      name,
      description,
      section,
      tastes: {
        basic: {
          sweet: sweetChecked ? basicTastes.sweet : null,
          bitter: bitterChecked ? basicTastes.bitter : null,
          sour: sourChecked ? basicTastes.sour : null,
          salty: saltyChecked ? basicTastes.salty : null,
          umami: umamiChecked ? basicTastes.umami : null,
        },
        other: {
          piquant: piquantChecked ? otherTastes.piquant : null,
          fat: fatChecked ? otherTastes.fat : null,
          temperature: temperatureChecked ? otherTastes.temperature : null,
        },
      },
      vision: visionParams,
      texture,
      emotions,
    }

    const [newDishes, result] = saveDish(name, state, dishes)

    setDishes(newDishes)
    toast({
      title: t(`toast.${result}.title`),
      description: t(`toast.${result}.description`),
      status: result === 'nameRequired' ? 'error' : 'success',
      duration: MODAL_TIMER,
      isClosable: true,
    })

    if (result === 'nameRequired') return

    setName('')
    setDescription('')

    closeModal()
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

    const basic = dish.tastes.basic;
    const other = dish.tastes.other;

    // dish state
    setName(dish.name)
    setDescription(dish.description ?? '')
    setBasicTastes({
      sweet: basic.sweet ?? 0,
      bitter: basic.bitter ?? 0,
      sour: basic.sour ?? 0,
      salty: basic.salty ?? 0,
      umami: basic.umami ?? 0,
    })
    setOtherTastes({
      piquant: other.piquant ?? 0,
      fat: other.fat ?? 0,
      temperature: other.temperature ?? 0,
    })
    setVisionParams(dish.vision)
    setTexture(dish.texture)
    setEmotions(dish.emotions)

    // checkbuttons
    setSweetChecked(basic.sweet != null)
    setBitterChecked(basic.bitter != null)
    setSourChecked(basic.sour != null)
    setSaltyChecked(basic.salty != null)
    setUmamiChecked(basic.umami != null)
    setPiquantChecked(other.piquant != null)
    setFatChecked(other.fat != null)
    setTemperatureChecked(other.temperature != null)
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
          onChange={(e) => { e.preventDefault(); setMenuDesc(e.target.value) }}
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
              openModal()
            }}
            leftIcon={<AddIcon />}
          >
            {t("main.addItem")}
          </Button>

          <Modal
            scrollBehavior='outside'
            closeOnOverlayClick={false}
            isOpen={isModalOpen}
            onClose={closeModal}
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
                    <SectionSelect sectionHandler={setSection} />
                    {/* <Select
                      value={sectionSelect}
                      options={sectionOptions}
                      onChange={handleSectionSelect}
                      size='sm'
                    /> */}
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

                <Heading mt={4} mb={6} size='md'>{t('modal.sections.tastes.base')}</Heading>
                <Stack direction='column' spacing='2.5rem'>

                  {baseParams.map((param, index) => {
                    return (
                      <TasteSlider
                        key={index}
                        label={param.label}
                        ariaLabel={`${param.label.toLowerCase()}-slider`}
                        value={basicTastes[param.label]}
                        setValueCallback={handleTasteChange}
                        isChecked={param.isChecked}
                        checkCallback={param.checkCallback}
                      />
                    )
                  })}

                </Stack>
                <Heading mt={6} mb={6} size='md'>{t('modal.sections.tastes.other')}</Heading>
                <Stack direction='column' spacing='2.5rem'>

                  {otherParams.map((param, index) => {
                    return (
                      <TasteSlider
                        key={index}
                        label={param.label}
                        ariaLabel={`${param.label}-slider`}
                        value={otherTastes[param.label]}
                        setValueCallback={handleTasteChange}
                        min={param.min}
                        max={param.max}
                        isChecked={param.isChecked}
                        checkCallback={param.checkCallback}
                      />
                    )
                  })}

                </Stack>
                <Heading mt={4} mb={6} size='md'>{t('modal.sections.vision')}</Heading>

                {/* <Stack direction={'row'}>
                  <Checkbox mr='5rem' isChecked={isActive} onChange={(e) => setIsActive(e.target.checked)}>Color</Checkbox>
                  <input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
                </Stack> */}

                <Heading mt={4} mb={6} size='md'>{t('modal.sections.emotions')}</Heading>
                <EmotionSelect handler={setEmotions} />

                {/* <MultiSelect
                  options={emotionOptions}
                  value={emotions}
                  label='Choose an item'
                  onChange={(selection) => {
                    if (Array.isArray(selection))
                      setEmotions(selection.map((item) => item.value as Emotion))
                    else
                      setEmotions([selection.value as Emotion])
                  }}
                /> */}

              </ModalBody>

              <ModalFooter justifyContent={'center'}>
                <Button colorScheme='blue' mr={3} onClick={saveDishes}>{t('modal.submit')}</Button>
                <Button colorScheme='red' onClick={closeModal}>{t('modal.cancel')}</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </Flex>

        <Center>
          <Box minHeight='5rem'>
            <Reorder.Group style={{ listStyleType: 'none', width: '24rem' }} axis='y' values={dishes} onReorder={setDishes}>
              {dishes.length != 0 ? dishes.map((dish) => (
                <Reorder.Item style={{ marginBottom: 6 }} key={dish.name} value={dish}>
                  <Stack direction='row'>
                    <Center>
                      <Icon as={MdDragIndicator} boxSize={6} />
                      <Text>{dish.name}</Text>
                    </Center>
                    <Spacer />
                    <Button
                      variant='outline'
                      colorScheme='red'
                      onClick={() => setDishes(deleteListElement(dishes, dish.name))}
                    >
                      {t('main.delete')}
                    </Button>
                    <Button
                      variant='outline'
                      colorScheme='blue'
                      onClick={() => { loadDish(dish.name); openModal() }}
                    >
                      {t('main.edit')}
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
            {t('main.submit')}
          </Button>
          <Button variant={'outline'} colorScheme='blue' leftIcon={<FaSave />}>
            {t('main.save')}
          </Button>
        </Stack>
      </Center>
    </>
  )
}

export default MenuRequestForm