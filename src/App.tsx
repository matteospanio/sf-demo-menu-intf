import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Divider, Spinner, Center, Box, useColorModeValue } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MenuBar } from './shared/ui'
import { MenuRequestForm } from './features/menu'
import MenuListPage from './features/menu/ui/MenuListPage'
import MenuDetailsPage from './features/menu/ui/MenuDetailsPage'
import { LoginPage, useAuth, ProfilePage } from './features/auth'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useState } from 'react'

type PageState =
  | { type: 'new' }
  | { type: 'list' }
  | { type: 'details'; menuId: number; menuTitle?: string }
  | { type: 'edit'; menuId: number; menuTitle?: string }
  | { type: 'profile' }

function App() {

  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuth()

  const [page, setPage] = useState<PageState>({ type: 'list' })

  useEffect(() => {
    if (isAuthenticated) {
      setPage({ type: 'list' })
    }
  }, [isAuthenticated])

  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; onClick?: () => void }> = [
      { label: t('menus.title'), onClick: () => setPage({ type: 'list' }) },
    ]

    if (page.type === 'list') {
      return [{ label: t('menus.title') }]
    }

    if (page.type === 'profile') {
      return [
        { label: t('menus.title'), onClick: () => setPage({ type: 'list' }) },
        { label: t('profile.title') },
      ]
    }

    if (page.type === 'new') {
      items.push({ label: t('main.newMenuRequest') })
      return items
    }

    if (page.type === 'details') {
      items.push({ label: page.menuTitle ?? `Menu #${page.menuId}` })
      return items
    }

    if (page.type === 'edit') {
      items.push({
        label: page.menuTitle ?? `Menu #${page.menuId}`,
        onClick: () => setPage({ type: 'details', menuId: page.menuId, menuTitle: page.menuTitle }),
      })
      items.push({ label: t('menus.editTitle') })
      return items
    }

    return items
  }, [page, t])

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const spinnerBg = useColorModeValue('gray.50', 'gray.900')

  if (isLoading) {
    return (
      <Center h="100vh" bg={spinnerBg}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <Box minH="100vh" bg={bgColor}>
    <MenuBar
      onGoToMenus={() => setPage({ type: 'list' })}
      onGoToNewMenu={() => setPage({ type: 'new' })}
      onGoToProfile={() => setPage({ type: 'profile' })}
    />

    <Container mt='2rem' maxW='900px' p={4}>

      <Breadcrumb separator={<ChevronRightIcon color='gray.500' />} mb={4}>
        {breadcrumbItems.map((item, idx) => (
          <BreadcrumbItem key={`${item.label}-${idx}`}>
            <BreadcrumbLink
              onClick={item.onClick}
              cursor={item.onClick ? 'pointer' : 'default'}
            >
              {item.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      {page.type === 'new' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <MenuRequestForm onDone={() => setPage({ type: 'list' })} />
        </>
      )}

      {page.type === 'list' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <MenuListPage
            onCreateNew={() => setPage({ type: 'new' })}
            onViewMenu={(menuId, menuTitle) => setPage({ type: 'details', menuId, menuTitle })}
            onEditMenu={(menuId, menuTitle) => setPage({ type: 'edit', menuId, menuTitle })}
          />
        </>
      )}

      {page.type === 'details' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <MenuDetailsPage
            menuId={page.menuId}
            onBack={() => setPage({ type: 'list' })}
            onMenuLoaded={(menuTitle) => setPage(prev => prev.type === 'details' && prev.menuId === page.menuId ? { ...prev, menuTitle } : prev)}
            onEdit={(menuId, menuTitle) => setPage({ type: 'edit', menuId, menuTitle: menuTitle ?? page.menuTitle })}
            onDeleted={() => setPage({ type: 'list' })}
          />
        </>
      )}

      {page.type === 'edit' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <MenuRequestForm
            menuId={page.menuId}
            onDone={() => setPage({ type: 'details', menuId: page.menuId, menuTitle: page.menuTitle })}
          />
        </>
      )}

      {page.type === 'profile' && (
        <>
          <Divider my={5} orientation='horizontal' />
          <ProfilePage onBack={() => setPage({ type: 'list' })} />
        </>
      )}

    </Container>
    </Box>
  )
}

export default App
