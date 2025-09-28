import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { LoginCredentials } from '@/types/auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await login(formData);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Erro ao entrar',
        error.message || 'Verifique suas credenciais e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  const navigateToForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LoadingOverlay visible={loading} message="Entrando..." />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.content}>
            {/* Logo */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(600).springify()}
              style={styles.logoContainer}
            >
              <Logo size="lg" />
            </Animated.View>

            {/* Título */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
              style={styles.titleContainer}
            >
              <ThemedText style={styles.title}>Bem-vindo de volta!</ThemedText>
              <ThemedText style={styles.subtitle}>
                Entre na sua conta para continuar lendo
              </ThemedText>
            </Animated.View>

            {/* Formulário */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(600).springify()}
              style={styles.formContainer}
            >
              <Input
                label="Nome de usuário"
                placeholder="Digite seu nome de usuário"
                value={formData.username}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, username: text.toLowerCase().trim() }));
                  if (errors.username) {
                    setErrors(prev => ({ ...prev, username: undefined }));
                  }
                }}
                error={errors.username}
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="person"
              />

              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, password: text }));
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                error={errors.password}
                secureTextEntry={!showPassword}
                leftIcon="lock"
                rightIcon={showPassword ? "eye.slash" : "eye"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
            </Animated.View>

            {/* Esqueci a senha */}
            <Animated.View
              entering={FadeInUp.delay(400).duration(600).springify()}
              style={styles.forgotContainer}
            >
              <Button
                title="Esqueci minha senha"
                variant="ghost"
                size="sm"
                onPress={navigateToForgotPassword}
              />
            </Animated.View>

            {/* Botão de login */}
            <Animated.View
              entering={FadeInDown.delay(500).duration(600).springify()}
              style={styles.buttonContainer}
            >
              <Button
                title="Entrar"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleLogin}
              />
            </Animated.View>

            {/* Link para registro */}
            <Animated.View
              entering={FadeInUp.delay(600).duration(600).springify()}
              style={styles.registerContainer}
            >
              <ThemedText style={styles.registerText}>
                Ainda não tem uma conta?
              </ThemedText>
              <Button
                title="Criar conta"
                variant="ghost"
                size="sm"
                onPress={navigateToRegister}
                textStyle={styles.registerButton}
              />
            </Animated.View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  registerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  registerButton: {
    fontSize: 14,
    fontWeight: '600',
  },
});