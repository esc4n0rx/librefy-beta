import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/components/book-card';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Colors, Spacing } from '@/constants/theme';
import { mockBooks, mockNews, mockRecentlyRead } from '@/data/mock-books';
import { useAuth } from '@/hooks/use-auth';
import { Book } from '@/types/book';

export default function HomeScreen() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated, isLoading]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simular carregamento
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleBookPress = (book: Book) => {
    Alert.alert(
      book.title,
      `Por ${book.author}\n\n${book.description}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Livro', onPress: () => console.log('Abrir:', book.title) },
      ]
    );
  };

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

  const renderNewsItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 1) * 100).duration(600).springify()}
    >
      <View style={styles.newsCard}>
        <View style={styles.newsContent}>
          <ThemedText style={styles.newsTitle}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.newsDescription}>
            {item.description}
          </ThemedText>
          <ThemedText style={styles.newsDate}>
            {new Date(item.date).toLocaleDateString('pt-BR')}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );

  const renderRecentBook = ({ item, index }: { item: Book; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 2) * 100).duration(600).springify()}
      style={styles.recentBookContainer}
    >
      <BookCard 
        book={item} 
        variant="compact"
        onPress={handleBookPress}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {/* Header de Boas-vindas */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(600).springify()}
            style={styles.welcomeHeader}
          >
            <View style={styles.welcomeContent}>
              <ThemedText style={styles.welcomeTitle}>
                Olá, {user?.name?.split(' ')[0]}! 👋
              </ThemedText>
              <ThemedText style={styles.welcomeSubtitle}>
                O que você quer ler hoje?
              </ThemedText>
            </View>
            <Button
              title="Sair"
              variant="ghost"
              size="sm"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
          </Animated.View>

          {/* Últimas Leituras */}
          {mockRecentlyRead.length > 0 && (
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
              style={styles.section}
            >
              <SectionHeader
                title="Continue lendo"
                subtitle="Retome suas leituras onde parou"
                actionTitle="Ver todas"
                onActionPress={() => router.push('/(tabs)/library')}
              />
              <FlatList
                data={mockRecentlyRead}
                renderItem={renderRecentBook}
                keyExtractor={(item) => `recent-${item.id}`}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          )}

          {/* Notícias */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600).springify()}
            style={styles.section}
          >
            <SectionHeader
              title="Notícias Literárias"
              subtitle="Fique por dentro do mundo dos livros"
              actionTitle="Ver mais"
              onActionPress={() => console.log('Ver todas as notícias')}
            />
            <FlatList
              data={mockNews}
              renderItem={renderNewsItem}
              keyExtractor={(item) => `news-${item.id}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>

          {/* Livros Recomendados */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600).springify()}
            style={styles.section}
          >
            <SectionHeader
              title="Recomendados para você"
              subtitle="Baseado nas suas leituras"
              actionTitle="Ver todos"
              onActionPress={() => router.push('/(tabs)/discover')}
            />
            {mockBooks.slice(0, 2).map((book, index) => (
              <Animated.View
                key={book.id}
                entering={FadeInUp.delay((index + 5) * 100).duration(600).springify()}
              >
                <BookCard 
                  book={book} 
                  onPress={handleBookPress}
                />
              </Animated.View>
            ))}
          </Animated.View>

          {/* Espaço extra para o final */}
          <View style={styles.bottomSpacer} />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  logoutButton: {
    marginLeft: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  recentBookContainer: {
    marginBottom: Spacing.sm,
  },
  newsCard: {
    backgroundColor: Colors.light.neutral,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  newsContent: {
    gap: Spacing.xs,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  newsDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  newsDate: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});