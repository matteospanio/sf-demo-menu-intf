import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Stack,
  Switch,
  useColorModeValue,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../../../shared/ui/LanguageSelector'
import { useClientSettings } from '../../../hooks/useClientSettings'

export interface MenuSettingsPageProps {
  onBack: () => void
}

export default function MenuSettingsPage({ onBack }: MenuSettingsPageProps) {
  const { t } = useTranslation()
  const { colorMode, setColorModePersisted } = useClientSettings()

  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.700')

  return (
    <Stack spacing={4}>
      <HStack justify="space-between" align="baseline">
        <Heading size="lg">{t('settings.title')}</Heading>
        <Button variant="ghost" size="sm" onClick={onBack}>
          {t('menus.actions.back')}
        </Button>
      </HStack>

      <Card bg={cardBg} borderWidth="1px" borderColor={cardBorder} borderRadius="xl">
        <CardBody>
          <Stack spacing={6}>
            <FormControl display="flex" alignItems="center" justifyContent="space-between">
              <FormLabel mb={0}>{t('settings.themeDark')}</FormLabel>
              <Switch
                aria-label={t('settings.themeDark')}
                isChecked={colorMode === 'dark'}
                onChange={(e) => setColorModePersisted(e.target.checked ? 'dark' : 'light')}
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('settings.language')}</FormLabel>
              <LanguageSelector />
            </FormControl>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}
