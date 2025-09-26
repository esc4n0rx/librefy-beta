import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
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
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SearchBar } from '@/components/ui/search-bar';
import { Colors, Spacing } from '@/constants/theme';
import { mockBooks, mockCategories } from '@/data/mock-books';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Book } from '@/types/book';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const backgroundColor = useThemeColor({}, 'background');

  const genres = [
    'Todos',
    'Ficção',
    'Romance',
    'Fantasia',
    'História',
    'Ciência',
    'Clássico',
    'Autoajuda',
  ];

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || selectedGenre === 'Todos' || 
                        book.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleBookPress = (book: Book) => {
    console.log('Livro selecionado:', book.title);
  };

  const renderGenreChip = (genre: string, index: number) => (
    <Animated.View
      key={genre}
      entering={FadeInUp.delay((index + 2) * 50).duration(400).springify()}
    >
      <Button
        title={genre}
        variant={selectedGenre === genre ? 'primary' : 'outline'}
        size="sm"
        onPress={() => setSelectedGenre(genre)}
        style={styles.genreChip}
      />
    </Animated.View>
  );

  const renderBookItem = ({ item, index }: { item: Book; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 5) * 100).duration(600).springify()}
      style={viewMode === 'grid' ? styles.gridItem : undefined}
    >
      <BookCard 
        book={item} 
        variant={viewMode === 'grid' ? 'compact' : 'default'}
        onPress={handleBookPress}
      />
    </Animated.View>
  );

  const renderCategorySection = ({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 3) * 150).duration(600).springify()}
      style={styles.categorySection}
    >
      <SectionHeader
        title={item.name}
        subtitle={item.description}
        actionTitle="Ver todos"
        onActionPress={() => console.log(`Ver todos de ${item.name}`)}
      />
      <FlatList
        data={item.books.slice(0, 3)}
        renderItem={({ item: book, index: bookIndex }) => (
          <Animated.View
            key={book.id}
            entering={FadeInUp.delay((bookIndex + 1) * 100).duration(600).springify()}
          >
            <BookCard 
              book={book} 
              variant="compact"
              onPress={handleBookPress}
            />
          </Animated.View>
        )}
        keyExtractor={(book) => `category-${item.id}-${book.id}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <FlatList
        data={searchQuery ? [{ type: 'results' }] : mockCategories}
        keyExtractor={(item, index) => searchQuery ? 'results' : `category-${item.id}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ThemedView style={styles.header}>
            {/* Título da tela */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(600).springify()}
              style={styles.titleContainer}
            >
              <ThemedText style={styles.title}>Descobrir</ThemedText>
              <ThemedText style={styles.subtitle}>
                Encontre sua próxima leitura
              </ThemedText>
            </Animated.View>

            {/* Barra de pesquisa */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
              style={styles.searchContainer}
            >
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Pesquisar livros, autores..."
              />
            </Animated.View>

            {/* Filtros de gênero */}
            <Animated.View
              entering={FadeInUp.delay(300).duration(600).springify()}
              style={styles.filtersContainer}
            >
              <View style={styles.filtersHeader}>
                <ThemedText style={styles.filtersTitle}>Gêneros</ThemedText>
                <Button
                  title={viewMode === 'list' ? 'Grade' : 'Lista'}
                  variant="ghost"
                  size="sm"
                  onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  style={styles.viewModeButton}
                >
                  <IconSymbol
                    name={viewMode === 'list' ? 'square.grid.2x2' : 'list.bullet'}
                    size={16}
                    color={Colors.light.primary}
                  />
                </Button>
              </View>
              <FlatList
                data={genres}
                renderItem={({ item, index }) => renderGenreChip(item, index)}
                keyExtractor={(genre) => genre}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.genresList}
              />
            </Animated.View>

            {/* Contador de resultados */}
            {searchQuery && (
              <Animated.View
                entering={FadeInUp.delay(400).duration(600).springify()}
                style={styles.resultsContainer}
              >
                <ThemedText style={styles.resultsText}>
                  {filteredBooks.length} resultado(s) encontrado(s)
                </ThemedText>
              </Animated.View>
            )}
          </ThemedView>
        }
        renderItem={searchQuery ? undefined : renderCategorySection}
        ListFooterComponent={
          searchQuery ? (
            <ThemedView style={styles.content}>
              <FlatList
                data={filteredBooks}
                renderItem={renderBookItem}
                keyExtractor={(book) => `search-${book.id}`}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode} // Force re-render when view mode changes
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
              />
            </ThemedView>
          ) : (
            <View style={styles.bottomSpacer} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  titleContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  filtersContainer: {
    marginBottom: Spacing.lg,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  genresList: {
    gap: Spacing.sm,
  },
  genreChip: {
    marginRight: Spacing.sm,
  },
  resultsContainer: {
    marginBottom: Spacing.md,
  },
  resultsText: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 0.48,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});