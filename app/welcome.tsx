import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const animation = useRef<LottieView>(null);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = Colors.light.primary;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const lottieOpacity = useSharedValue(0);
  const lottieScale = useSharedValue(0.8);

  const animatedLottieStyle = useAnimatedStyle(() => {
    return {
      opacity: lottieOpacity.value,
      transform: [{ scale: lottieScale.value }],
    };
  });

  useEffect(() => {
    // Configura as barras do sistema para esta tela
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(backgroundColor);
      NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }

    // Animar entrada do Lottie
    lottieOpacity.value = withDelay(500, withSpring(1));
    lottieScale.value = withDelay(500, withSpring(1));
    
    // Iniciar animação Lottie
    const timer = setTimeout(() => {
      animation.current?.play();
    }, 800);

    return () => clearTimeout(timer);
  }, [backgroundColor, isDark]);

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      
      <ThemedView style={styles.content}>
        {/* Logo */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(800).springify()}
          style={styles.logoContainer}
        >
          <Logo size="xl" showText />
        </Animated.View>

        {/* Lottie Animation */}
        <Animated.View style={[styles.animationContainer, animatedLottieStyle]}>
          <LottieView
            ref={animation}
            source={require('@/assets/images/book.json')}
            style={styles.lottie}
            loop={true}
            autoPlay={false}
          />
        </Animated.View>

        {/* Texto de boas-vindas */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(800).springify()}
          style={styles.textContainer}
        >
          <ThemedText style={[styles.title, { color: primaryColor }]}>
            Histórias livres, para todos
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textColor }]}>
            Descubra, leia e escreva histórias incríveis na maior comunidade de leitores e escritores do Brasil
          </ThemedText>
        </Animated.View>

        {/* Botões */}
        <Animated.View
          entering={FadeInDown.delay(1400).duration(800).springify()}
          style={styles.buttonContainer}
        >
          <Button
            title="Começar a ler"
            variant="primary"
            size="lg"
            fullWidth
            onPress={navigateToRegister}
            style={{ marginBottom: Spacing.md }}
          />
          
          <Button
            title="Já tenho uma conta"
            variant="outline"
            size="lg"
            fullWidth
            onPress={navigateToLogin}
          />
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInUp.delay(1800).duration(800).springify()}
          style={styles.footer}
        >
          <ThemedText style={[styles.footerText, { color: textColor }]}>
            Junte-se a milhares de leitores e escritores
          </ThemedText>
        </Animated.View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lottie: {
    width: width * 0.7,
    height: width * 0.7,
    maxWidth: 300,
    maxHeight: 300,
  },
  textContainer: {
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Fonts.rounded,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  buttonContainer: {
    gap: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});