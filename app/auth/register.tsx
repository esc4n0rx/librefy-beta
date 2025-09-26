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
import { RegisterData } from '@/types/auth';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    username: '',
    email: '',
    password: '',
    birth_date: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData & { confirmPassword: string }>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData & { confirmPassword: string }> = {};

    // Nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Username
    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Nome de usuário deve conter apenas letras, números e underscore';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Data de nascimento - CORREÇÃO DO BUG
    if (!formData.birth_date.trim()) {
      newErrors.birth_date = 'Data de nascimento é obrigatória';
    } else {
      // Verifica se a data está no formato DD/MM/AAAA
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(formData.birth_date)) {
        newErrors.birth_date = 'Use o formato DD/MM/AAAA';
      } else {
        // Valida se a data é válida
        const [day, month, year] = formData.birth_date.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        const isValidDate = date.getDate() === day && 
                           date.getMonth() === month - 1 && 
                           date.getFullYear() === year;
        
        if (!isValidDate) {
          newErrors.birth_date = 'Data inválida';
        } else if (year < 1900 || year > new Date().getFullYear()) {
          newErrors.birth_date = 'Ano deve estar entre 1900 e ' + new Date().getFullYear();
        }
      }
    }

    // Senha
    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Confirmar senha
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (text: string): string => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    // Formata como DD/MM/AAAA
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const convertDateToAPI = (dateString: string): string => {
    // Converte DD/MM/AAAA para AAAA-MM-DD
    const [day, month, year] = dateString.split('/');
    if (day && month && year && year.length === 4) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        birth_date: convertDateToAPI(formData.birth_date),
      };
      
      await register(dataToSend);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Erro ao criar conta',
        error.message || 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LoadingOverlay visible={loading} message="Criando conta..." />
      
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
              <Logo size="md" />
            </Animated.View>

            {/* Título */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
              style={styles.titleContainer}
            >
              <ThemedText style={styles.title}>Criar sua conta</ThemedText>
              <ThemedText style={styles.subtitle}>
                Junte-se à comunidade de leitores e escritores
              </ThemedText>
            </Animated.View>

            {/* Formulário */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(600).springify()}
              style={styles.formContainer}
            >
              <Input
                label="Nome completo"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, name: text }));
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                error={errors.name}
                leftIcon="person"
              />

              <Input
                label="Nome de usuário"
                placeholder="Digite um nome de usuário único"
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
                leftIcon="at"
              />

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
                label="Data de nascimento"
                placeholder="DD/MM/AAAA"
                value={formData.birth_date}
                onChangeText={(text) => {
                  const formatted = formatDate(text);
                  setFormData(prev => ({ ...prev, birth_date: formatted }));
                  if (errors.birth_date) {
                    setErrors(prev => ({ ...prev, birth_date: undefined }));
                  }
                }}
                error={errors.birth_date}
                keyboardType="numeric"
                maxLength={10}
                leftIcon="calendar"
              />

              <Input
                label="Senha"
                placeholder="Crie uma senha segura"
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

              <Input
                label="Confirmar senha"
                placeholder="Digite sua senha novamente"
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

            {/* Botão de registro */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600).springify()}
              style={styles.buttonContainer}
            >
              <Button
                title="Criar conta"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleRegister}
              />
            </Animated.View>

            {/* Link para login */}
            <Animated.View
              entering={FadeInUp.delay(500).duration(600).springify()}
              style={styles.loginContainer}
            >
              <ThemedText style={styles.loginText}>
                Já tem uma conta?
              </ThemedText>
              <Button
                title="Entrar"
                variant="ghost"
                size="sm"
                onPress={navigateToLogin}
                textStyle={styles.loginButton}
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
    marginBottom: Spacing.lg,
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
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    marginBottom: Spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loginText: {
    fontSize: 14,
    opacity: 0.7,
  },
  loginButton: {
    fontSize: 14,
    fontWeight: '600',
  },
});