import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Alert,
  AlertIcon,
  AlertDescription,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts';

function LoginPage() {
  const { t } = useTranslation();
  const { login, register, error, clearError, isLoading } = useAuth();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!loginUsername || !loginPassword) {
      setLocalError(t('auth.fieldsRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      await login(loginUsername, loginPassword);
    } catch {
      // Error is handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!registerUsername || !registerPassword) {
      setLocalError(t('auth.fieldsRequired'));
      return;
    }

    if (registerPassword !== confirmPassword) {
      setLocalError(t('auth.passwordMismatch'));
      return;
    }

    if (registerPassword.length < 6) {
      setLocalError(t('auth.passwordTooShort'));
      return;
    }

    setIsSubmitting(true);
    try {
      await register(registerUsername, registerPassword);
    } catch {
      // Error is handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  if (isLoading) {
    return null;
  }

  return (
    <Container maxW="md" py={12}>
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
      >
        <Heading mb={6} textAlign="center" size="lg">
          🍽️ SoundFood
        </Heading>
        <Text mb={6} textAlign="center" color="gray.600">
          {t('auth.welcome')}
        </Text>

        {displayError && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <Tabs isFitted variant="enclosed" onChange={() => { setLocalError(null); clearError(); }}>
          <TabList mb={4}>
            <Tab>{t('auth.login')}</Tab>
            <Tab>{t('auth.register')}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <form onSubmit={handleLogin} noValidate>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t('auth.username')}</FormLabel>
                    <Input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder={t('auth.usernamePlaceholder')}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder={t('auth.passwordPlaceholder')}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText={t('auth.loggingIn')}
                  >
                    {t('auth.login')}
                  </Button>
                </Stack>
              </form>
            </TabPanel>

            <TabPanel p={0}>
              <form onSubmit={handleRegister} noValidate>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>{t('auth.username')}</FormLabel>
                    <Input
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      placeholder={t('auth.usernamePlaceholder')}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder={t('auth.passwordPlaceholder')}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText={t('auth.registering')}
                  >
                    {t('auth.register')}
                  </Button>
                </Stack>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default LoginPage;
