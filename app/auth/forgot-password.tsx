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
import { AuthService } from '@/services/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await AuthService.forgotPassword({ email });
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToResetPassword = () => {
    router.push({
      pathname: '/auth/reset-password',
      params: { email },
    });
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ThemedView style={styles.content}>
          <Animated.View
            entering={FadeInUp.delay(100).duration(600).springify()}
            style={styles.logoContainer}
          >
            <Logo size="lg" />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            style={styles.successContainer}
          >
            <ThemedText style={styles.successTitle}>
              Código enviado!
            </ThemedText>
            <ThemedText style={styles.successText}>
              Enviamos um código de 6 dígitos para{'\n'}
              <ThemedText style={styles.emailText}>{email}</ThemedText>
            </ThemedText>
            <ThemedText style={styles.helperText}>
              Verifique sua caixa de entrada e spam. O código expira em 15 minutos.
            </ThemedText>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).duration(600).springify()}
            style={styles.buttonContainer}
          >
            <Button
              title="Inserir código"
              variant="primary"
              size="lg"
              fullWidth
              onPress={navigateToResetPassword}
            />
            
            <Button
              title="Enviar novamente"
              variant="outline"
              size="md"
              fullWidth
              onPress={() => {
                setEmailSent(false);
                setEmail('');
              }}
              style={{ marginTop: Spacing.md }}
            />
          </Animated.View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LoadingOverlay visible={loading} message="Enviando código..." />
      
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
              <ThemedText style={styles.title}>Esqueceu sua senha?</ThemedText>
              <ThemedText style={styles.subtitle}>
                Digite seu email para receber um código de recuperação
              </ThemedText>
            </Animated.View>

            {/* Formulário */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(600).springify()}
              style={styles.formContainer}
            >
              <Input
                label="Email"
                placeholder="Digite seu email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase().trim());
                  if (error) setError('');
                }}
                error={error}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="envelope"
              />
            </Animated.View>

            {/* Botão */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={styles.buttonContainer}
            >
              <Button
                title="Enviar código"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleSendCode}
              />
            </Animated.View>

            {/* Info adicional */}
            <Animated.View
              entering={FadeInUp.delay(500).duration(600).springify()}
              style={styles.infoContainer}
            >
              <ThemedText style={styles.infoText}>
                Lembrou da senha?{' '}
                <ThemedText 
                  style={styles.linkText}
                  onPress={() => router.back()}
                >
                  Voltar ao login
                </ThemedText>
              </ThemedText>
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
    paddingHorizontal: Spacing.md,
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  linkText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.success,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  emailText: {
    fontWeight: '600',
    color: Colors.light.primary,
  },
  helperText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
});