import { router, useLocalSearchParams } from 'expo-router';
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
import { ResetPasswordData } from '@/types/auth';

export default function ResetPasswordScreen() {
  const { email: paramEmail } = useLocalSearchParams<{ email: string }>();
  
  const [formData, setFormData] = useState<ResetPasswordData>({
    email: paramEmail || '',
    code: '',
    new_password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<ResetPasswordData & { confirmPassword: string }>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordData & { confirmPassword: string }> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório';
    } else if (!/^\d{6}$/.test(formData.code)) {
      newErrors.code = 'Código deve ter exatamente 6 dígitos';
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password = 'Nova senha é obrigatória';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.new_password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await AuthService.resetPassword(formData);
      
      Alert.alert(
        'Senha alterada!',
        'Sua senha foi alterada com sucesso. Faça login com a nova senha.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Código inválido ou expirado. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToForgotPassword = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={loading} message="Alterando senha..." />
      
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
              <ThemedText style={styles.title}>Redefinir senha</ThemedText>
              <ThemedText style={styles.subtitle}>
                Digite o código que enviamos por email e sua nova senha
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
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text.toLowerCase().trim() }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="envelope"
              />

              <Input
                label="Código de verificação"
                placeholder="Digite o código de 6 dígitos"
                value={formData.code}
                onChangeText={(text) => {
                  const numbers = text.replace(/\D/g, '').slice(0, 6);
                  setFormData(prev => ({ ...prev, code: numbers }));
                  if (errors.code) {
                    setErrors(prev => ({ ...prev, code: undefined }));
                  }
                }}
                error={errors.code}
                keyboardType="numeric"
                maxLength={6}
                leftIcon="key"
              />

              <Input
                label="Nova senha"
                placeholder="Digite sua nova senha"
                value={formData.new_password}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, new_password: text }));
                  if (errors.new_password) {
                    setErrors(prev => ({ ...prev, new_password: undefined }));
                  }
                }}
                error={errors.new_password}
                secureTextEntry={!showPassword}
                leftIcon="lock"
                rightIcon={showPassword ? "eye.slash" : "eye"}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <Input
                label="Confirmar nova senha"
                placeholder="Digite sua nova senha novamente"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                error={errors.confirmPassword}
                secureTextEntry={!showConfirmPassword}
                leftIcon="lock"
                rightIcon={showConfirmPassword ? "eye.slash" : "eye"}
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </Animated.View>

            {/* Botão */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={styles.buttonContainer}
            >
              <Button
                title="Alterar senha"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleResetPassword}
              />
            </Animated.View>

            {/* Links */}
            <Animated.View
              entering={FadeInUp.delay(500).duration(600).springify()}
              style={styles.linksContainer}
            >
              <ThemedText style={styles.linkText}>
                Não recebeu o código?{' '}
                <ThemedText 
                  style={styles.actionLink}
                  onPress={navigateToForgotPassword}
                >
                  Enviar novamente
                </ThemedText>
              </ThemedText>
              
              <ThemedText style={[styles.linkText, { marginTop: Spacing.sm }]}>
                <ThemedText 
                  style={styles.actionLink}
                  onPress={() => router.replace('/auth/login')}
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
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  linksContainer: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  actionLink: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
});