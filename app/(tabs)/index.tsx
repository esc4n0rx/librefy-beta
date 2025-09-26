import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated, isLoading]);

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Carregando...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(100).duration(600).springify()}
          style={styles.welcomeContainer}
        >
          <ThemedText style={styles.title}>
            Bem-vindo ao Librefy!
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Olá, {user?.name}! 👋
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(600).springify()}
          style={styles.infoContainer}
        >
          <View style={styles.userInfo}>
            <ThemedText style={styles.label}>Nome:</ThemedText>
            <ThemedText style={styles.value}>{user?.name}</ThemedText>
          </View>
          
          <View style={styles.userInfo}>
            <ThemedText style={styles.label}>Username:</ThemedText>
            <ThemedText style={styles.value}>@{user?.username}</ThemedText>
          </View>
          
          <View style={styles.userInfo}>
            <ThemedText style={styles.label}>Email:</ThemedText>
            <ThemedText style={styles.value}>{user?.email}</ThemedText>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(600).springify()}
          style={styles.comingSoonContainer}
        >
          <ThemedText style={styles.comingSoonTitle}>
            🚧 Em construção
          </ThemedText>
          <ThemedText style={styles.comingSoonText}>
            Estamos trabalhando nas próximas funcionalidades do Librefy. Em breve você poderá descobrir, ler e escrever histórias incríveis!
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(600).springify()}
          style={styles.logoutContainer}
        >
          <Button
            title="Sair da conta"
            variant="outline"
            size="md"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.8,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: Colors.light.neutral,
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  comingSoonContainer: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
  },
  logoutContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoutButton: {
    borderColor: Colors.light.error,
  },
});