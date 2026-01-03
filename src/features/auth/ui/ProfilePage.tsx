import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  VStack,
  HStack,
  Heading,
  Divider,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Avatar,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../model';
import { authService } from '../../../api';

/**
 * Profile page component for viewing and editing user information.
 *
 * @example
 * <ProfilePage onBack={() => setPage({ type: 'list' })} />
 */
export function ProfilePage({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const toast = useToast();

  // Email editing state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Password editing state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textMuted = useColorModeValue('gray.600', 'gray.400');
  const avatarBg = useColorModeValue('gray.200', 'gray.600');

  const handleEmailEdit = () => {
    setIsEditingEmail(true);
    setNewEmail('');
    setEmailError(null);
  };

  const handleEmailCancel = () => {
    setIsEditingEmail(false);
    setNewEmail('');
    setEmailError(null);
  };

  const handleEmailSave = async () => {
    setEmailError(null);

    if (!newEmail.trim()) {
      setEmailError(t('profile.emailRequired'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError(t('auth.invalidEmail'));
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await authService.updateEmail({ email: newEmail });
      toast({
        title: t('profile.emailUpdated.title'),
        description: t('profile.emailUpdated.description'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditingEmail(false);
      setNewEmail('');
    } catch (err) {
      const message = err instanceof Error ? err.message : t('toast.apiError.description');
      setEmailError(message);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordEdit = () => {
    setIsEditingPassword(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handlePasswordCancel = () => {
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handlePasswordSave = async () => {
    setPasswordError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('auth.fieldsRequired'));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t('auth.passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('auth.passwordMismatch'));
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authService.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast({
        title: t('profile.passwordUpdated.title'),
        description: t('profile.passwordUpdated.description'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : t('toast.apiError.description');
      setPasswordError(message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <Container maxW="600px" py={4}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Heading size="lg">{t('profile.title')}</Heading>
          <Button variant="ghost" onClick={onBack}>
            {t('menus.actions.back')}
          </Button>
        </HStack>

        {/* User Info Card */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardHeader pb={0}>
            <HStack spacing={4}>
              <Avatar
                size="lg"
                name={user?.username}
                bg={avatarBg}
                color={useColorModeValue('gray.600', 'white')}
              />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="xl">
                  {user?.username}
                </Text>
                <Text color={textMuted} fontSize="sm">
                  {t('profile.memberSince', {
                    date: user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : '-',
                  })}
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Divider />

              {/* Email Section */}
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  {t('auth.email')}
                </Text>
                {!isEditingEmail ? (
                  <HStack justify="space-between">
                    <Text color={textMuted}>{t('profile.emailHidden')}</Text>
                    <Button size="sm" variant="outline" onClick={handleEmailEdit}>
                      {t('profile.changeEmail')}
                    </Button>
                  </HStack>
                ) : (
                  <Stack spacing={3}>
                    <FormControl isInvalid={!!emailError}>
                      <FormLabel>{t('profile.newEmail')}</FormLabel>
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={t('auth.emailPlaceholder')}
                      />
                    </FormControl>
                    {emailError && (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        <AlertDescription>{emailError}</AlertDescription>
                      </Alert>
                    )}
                    <HStack justify="flex-end" spacing={2}>
                      <IconButton
                        aria-label={t('modal.cancel')}
                        icon={<CloseIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={handleEmailCancel}
                        isDisabled={isUpdatingEmail}
                      />
                      <IconButton
                        aria-label={t('modal.submit')}
                        icon={<CheckIcon />}
                        size="sm"
                        colorScheme="green"
                        onClick={handleEmailSave}
                        isLoading={isUpdatingEmail}
                      />
                    </HStack>
                  </Stack>
                )}
              </Box>

              <Divider />

              {/* Password Section */}
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  {t('auth.password')}
                </Text>
                {!isEditingPassword ? (
                  <HStack justify="space-between">
                    <Text color={textMuted}>••••••••</Text>
                    <Button size="sm" variant="outline" onClick={handlePasswordEdit}>
                      {t('profile.changePassword')}
                    </Button>
                  </HStack>
                ) : (
                  <Stack spacing={3}>
                    <FormControl isInvalid={!!passwordError}>
                      <FormLabel>{t('profile.currentPassword')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder={t('profile.currentPasswordPlaceholder')}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={
                              showCurrentPassword
                                ? t('profile.hidePassword')
                                : t('profile.showPassword')
                            }
                            icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>{t('profile.newPassword')}</FormLabel>
                      <InputGroup>
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={t('profile.newPasswordPlaceholder')}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={
                              showNewPassword
                                ? t('profile.hidePassword')
                                : t('profile.showPassword')
                            }
                            icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                      />
                    </FormControl>

                    {passwordError && (
                      <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}
                    <HStack justify="flex-end" spacing={2}>
                      <IconButton
                        aria-label={t('modal.cancel')}
                        icon={<CloseIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={handlePasswordCancel}
                        isDisabled={isUpdatingPassword}
                      />
                      <IconButton
                        aria-label={t('modal.submit')}
                        icon={<CheckIcon />}
                        size="sm"
                        colorScheme="green"
                        onClick={handlePasswordSave}
                        isLoading={isUpdatingPassword}
                      />
                    </HStack>
                  </Stack>
                )}
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default ProfilePage;
