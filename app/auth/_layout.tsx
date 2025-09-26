import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.background,
        },
        headerTintColor: Colors.light.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerShadowVisible: Platform.OS === 'ios',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Entrar',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Criar Conta',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Recuperar Senha',
          headerBackTitle: 'Voltar',
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          title: 'Nova Senha',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack>
  );
}