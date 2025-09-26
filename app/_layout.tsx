import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { AuthProvider } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Configura as barras do Android
    if (Platform.OS === 'android') {
      const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
      
      // StatusBar
      const statusBarStyle = isDark ? 'light' : 'dark';
      
      // Navigation Bar
      NavigationBar.setBackgroundColorAsync(backgroundColor);
      NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }
  }, [isDark]);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
            },
            headerTintColor: isDark ? Colors.dark.text : Colors.light.text,
            contentStyle: {
              backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
            },
          }}
        >
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar 
          style={isDark ? 'light' : 'dark'} 
          backgroundColor={isDark ? Colors.dark.background : Colors.light.background}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}