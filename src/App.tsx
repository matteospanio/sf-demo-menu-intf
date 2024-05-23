import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Divider, Text } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import MenuBar from './components/MenuBar'
import MenuRequestForm from './components/MenuRequestForm'
import { useTranslation } from 'react-i18next'

function App() {

  const { t } = useTranslation()

  return (
    <>
    <MenuBar />

    <Container mt='1.5rem' maxW='850px' p={3} borderRadius={5}>

      <Breadcrumb separator={<ChevronRightIcon color='gray..500' />}>
        <BreadcrumbItem>
          <BreadcrumbLink>
            {t("main.actions")}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink>
            {t("main.newMenuRequest")}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Text m={3}>
        {t("main.formDescription")}
      </Text>
      <Text m={3}>
        {t("main.formDescription2")}
      </Text>

      <Divider my={5} orientation='horizontal' />

      <MenuRequestForm />

    </Container>
    </>
  )
}

export default App
