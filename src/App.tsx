import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Divider, Text, Spinner, Center } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MenuBar } from './shared/ui'
import { MenuRequestForm } from './features/menu'
import MenuListPage from './features/menu/ui/MenuListPage'
import MenuDetailsPage from './features/menu/ui/MenuDetailsPage'
import { LoginPage, useAuth } from './features/auth'
import { useTranslation } from 'react-i18next'
import { useMemo, useState } from 'react'

type PageState =
  | { type: 'new' }
  | { type: 'list' }
  | { type: 'details'; menuId: number }
  | { type: 'edit'; menuId: number }

function App() {

  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuth()

  const [page, setPage] = useState<PageState>({ type: 'new' })

  const breadcrumbItems = useMemo(() => {
    const items: string[] = [t('main.actions')]

    if (page.type === 'new') items.push(t('main.newMenuRequest'))
    if (page.type === 'list') items.push(t('menus.title'))
    if (page.type === 'details') items.push(t('menus.detailsTitle'))
    if (page.type === 'edit') items.push(t('menus.editTitle'))

    return items
  }, [page.type, t])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <>
    <MenuBar
      onGoToMenus={() => setPage({ type: 'list' })}
      onGoToNewMenu={() => setPage({ type: 'new' })}
    />

    <Container mt='1.5rem' maxW='850px' p={3} borderRadius={5}>

      <Breadcrumb separator={<ChevronRightIcon color='gray..500' />}>
        {breadcrumbItems.map((label, idx) => (
          <BreadcrumbItem key={`${label}-${idx}`}>
            <BreadcrumbLink>{label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      {page.type === 'new' && (
        <>
          <Text m={3}>{t('main.formDescription')}</Text>
          <Text m={3}>{t('main.formDescription2')}</Text>
          <Divider my={5} orientation='horizontal' />
          <MenuRequestForm onDone={() => setPage({ type: 'list' })} />
        </>
      )}

      {page.type === 'list' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <MenuListPage
            onCreateNew={() => setPage({ type: 'new' })}
            onViewMenu={(menuId) => setPage({ type: 'details', menuId })}
            onEditMenu={(menuId) => setPage({ type: 'edit', menuId })}
          />
        </>
      )}

      {page.type === 'details' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <MenuDetailsPage
            menuId={page.menuId}
            onBack={() => setPage({ type: 'list' })}
            onEdit={(menuId) => setPage({ type: 'edit', menuId })}
            onDeleted={() => setPage({ type: 'list' })}
          />
        </>
      )}

      {page.type === 'edit' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <MenuRequestForm
            menuId={page.menuId}
            onDone={() => setPage({ type: 'details', menuId: page.menuId })}
          />
        </>
      )}

    </Container>
    </>
  )
}

export default App
