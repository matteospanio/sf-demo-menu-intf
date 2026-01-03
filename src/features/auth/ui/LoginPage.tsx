import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
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
  Image,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../model';
import logoSoundfood from '../../../assets/logo-soundfood.png';

function LoginPage() {
  const { t } = useTranslation();
  const { login, register, error, clearError, isLoading } = useAuth();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
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

    if (!registerUsername || !registerEmail || !registerPassword) {
      setLocalError(t('auth.fieldsRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setLocalError(t('auth.invalidEmail'));
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
      await register(registerUsername, registerEmail, registerPassword);
    } catch {
      // Error is handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  // Color mode values
  const bgGradient = useColorModeValue(
    'linear(to-br, brand.50, white, gray.50)',
    'linear(to-br, gray.900, gray.800, gray.900)'
  );
  const cardBg = useColorModeValue(
    'rgba(255, 255, 255, 0.8)',
    'rgba(39, 39, 42, 0.8)'
  );
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const logoContainerBg = useColorModeValue('white', 'gray.800');

  if (isLoading) {
    return null;
  }

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={12}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative gradient orbs */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="500px"
        h="500px"
        bg="brand.200"
        filter="blur(120px)"
        opacity={0.4}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="400px"
        h="400px"
        bg="brand.300"
        filter="blur(100px)"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <Box
          bg={cardBg}
          backdropFilter="blur(20px)"
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          border="1px"
          borderColor={cardBorder}
        >
          <VStack spacing={4} mb={6}>
            <Box
              p={4}
              borderRadius="2xl"
              bg={logoContainerBg}
              boxShadow="md"
            >
              <Image
                src={logoSoundfood}
                alt="SoundFood"
                boxSize="80px"
                objectFit="contain"
              />
            </Box>
            <Text fontSize="2xl" fontWeight="bold" color="brand.500">
              SoundFood
            </Text>
            <Text textAlign="center" color={textColor}>
              {t('auth.welcome')}
            </Text>
          </VStack>

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
                    w="full"
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
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <Input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
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
                    w="full"
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
    </Box>
  );
}

export default LoginPage;
