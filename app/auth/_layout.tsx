import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
        },
        headerTintColor: isDark ? Colors.dark.primary : Colors.light.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: isDark ? Colors.dark.text : Colors.light.text,
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