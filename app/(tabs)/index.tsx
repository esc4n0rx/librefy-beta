// app/(tabs)/index.tsx (versão atualizada)
import { mockCategories } from '@/data/mock-categories';
import { useBooks } from '@/hooks/use-books';
import { APIBook } from '@/types/books-api';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
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
import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  
  const {
    books: recentBooks,
    loading,
    refreshing,
    refresh,
  } = useBooks({
    orderBy: 'published_at',
    limit: 10,
  });

  const {
    books: popularBooks,
    refresh: refreshPopular,
  } = useBooks({
    orderBy: 'reads_count',
    limit: 5,
  });

  const {
    books: topRatedBooks,
    refresh: refreshTopRated,
  } = useBooks({
    orderBy: 'average_rating',
    limit: 5,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated, isLoading]);

  const onRefresh = React.useCallback(async () => {
    await Promise.all([
      refresh(),
      refreshPopular(),
      refreshTopRated(),
    ]);
  }, [refresh, refreshPopular, refreshTopRated]);

  const handleLogout = async () => {
    router.replace('/welcome');
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

  const renderRecentBook = ({ item, index }: { item: APIBook; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 2) * 100).duration(600).springify()}
      style={styles.bookContainer}
    >
      <BookCard book={item} variant="compact" />
    </Animated.View>
  );

  const renderPopularBook = ({ item, index }: { item: APIBook; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 4) * 100).duration(600).springify()}
    >
      <BookCard book={item} />
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
                Olá, {user?.name?.split(' ')[0]}!
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

          {/* Lançamentos Recentes */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            style={styles.section}
          >
            <SectionHeader
              title="Lançamentos Recentes"
              subtitle="Últimas histórias publicadas"
              actionTitle="Ver todos"
              onActionPress={() => router.push('/(tabs)/discover')}
            />
            <FlatList
              data={recentBooks.slice(0, 5)}
              renderItem={renderRecentBook}
              keyExtractor={(item) => `recent-${item.id}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>

          {/* Populares da Semana */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600).springify()}
            style={styles.section}
          >
            <SectionHeader
              title="Populares da Semana"
              subtitle="Os mais lidos pelos leitores"
              actionTitle="Ver ranking"
              onActionPress={() => console.log('Ver ranking')}
            />
            {popularBooks.slice(0, 2).map((book, index) => (
              <Animated.View
                key={book.id}
                entering={FadeInUp.delay((index + 5) * 100).duration(600).springify()}
              >
                <BookCard book={book} />
              </Animated.View>
            ))}
          </Animated.View>

          {/* Melhor Avaliados */}
          {topRatedBooks.length > 0 && (
            <Animated.View
              entering={FadeInUp.delay(400).duration(600).springify()}
              style={styles.section}
            >
              <SectionHeader
                title="Melhor Avaliados"
                subtitle="Com as melhores notas dos leitores"
                actionTitle="Ver todos"
                onActionPress={() => console.log('Ver melhor avaliados')}
              />
              {topRatedBooks.slice(0, 2).map((book, index) => (
                <Animated.View
                  key={book.id}
                  entering={FadeInUp.delay((index + 7) * 100).duration(600).springify()}
                >
                  <BookCard book={book} />
                </Animated.View>
              ))}
            </Animated.View>
          )}

          {/* Explorar por Categoria */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(600).springify()}
            style={styles.section}
          >
            <SectionHeader
              title="Explorar por Categoria"
              subtitle="Encontre livros do seu gênero favorito"
            />
            <View style={styles.categoriesGrid}>
              {mockCategories.slice(0, 6).map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeInUp.delay((index + 8) * 100).duration(600).springify()}
                  style={styles.categoryCard}
                >
                  <Button
                    title={category.name}
                    variant="outline"
                    size="md"
                    onPress={() => router.push('/(tabs)/discover')}
                    style={styles.categoryButton}
                  />
                </Animated.View>
              ))}
            </View>
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
  bookContainer: {
    marginBottom: Spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryCard: {
    flex: 0.48,
  },
  categoryButton: {
    width: '100%',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});