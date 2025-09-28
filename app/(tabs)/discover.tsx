// app/(tabs)/discover.tsx (versão atualizada)
import { mockCategories } from '@/data/mock-categories';
import { useBooks } from '@/hooks/use-books';
import { APIBook } from '@/types/books-api';
import React, { useCallback, useEffect, useState } from 'react';
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
import { useThemeColor } from '@/hooks/use-theme-color';

type SortOption = 'published_at' | 'reads_count' | 'likes_count' | 'average_rating';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<APIBook[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<SortOption>('published_at');
  const [searchLoading, setSearchLoading] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');

  const {
    books,
    loading,
    refreshing,
    error,
    refresh,
    loadMore,
    searchBooks,
  } = useBooks({
    orderBy: sortBy,
    limit: 20,
  });

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchBooks(searchQuery);
        setSearchResults(results);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchBooks]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  }, [selectedCategory]);

  const handleSortPress = useCallback(() => {
    const sortOptions: { key: SortOption; label: string }[] = [
      { key: 'published_at', label: 'Mais Recentes' },
      { key: 'reads_count', label: 'Mais Lidos' },
      { key: 'likes_count', label: 'Mais Curtidos' },
      { key: 'average_rating', label: 'Melhor Avaliados' },
    ];

    // Simular seleção - em um app real seria um ActionSheet ou Modal
    const currentIndex = sortOptions.findIndex(opt => opt.key === sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex].key);
  }, [sortBy]);

  // Filtrar livros por categoria se selecionada
  const filteredBooks = selectedCategory
    ? books.filter(book => {
        const category = mockCategories.find(cat => cat.id === selectedCategory);
        return category && category.tags.some(tag => 
          book.tags.some(bookTag => 
            bookTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
      })
    : books;

  // Decidir quais livros mostrar
  const displayBooks = searchQuery.trim() ? searchResults : filteredBooks;

  const renderCategoryChip = useCallback((category: any, index: number) => (
    <Animated.View
      key={category.id}
      entering={FadeInUp.delay((index + 2) * 50).duration(400).springify()}
    >
      <Button
        title={category.name}
        variant={selectedCategory === category.id ? 'primary' : 'outline'}
        size="sm"
        onPress={() => handleCategoryPress(category.id)}
        style={styles.categoryChip}
      />
    </Animated.View>
  ), [selectedCategory, handleCategoryPress]);

  const renderBookItem = useCallback(({ item, index }: { item: APIBook; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 5) * 100).duration(600).springify()}
      style={viewMode === 'grid' ? styles.gridItem : undefined}
    >
      <BookCard 
        book={item} 
        variant={viewMode === 'grid' ? 'compact' : 'default'}
      />
    </Animated.View>
  ), [viewMode]);

  const renderCategorySection = useCallback(({ item, index }: { item: any; index: number }) => {
    // Filtrar livros desta categoria
    const categoryBooks = books.filter(book => 
      item.tags.some((tag: string) => 
        book.tags.some(bookTag => 
          bookTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    ).slice(0, 3);

    if (categoryBooks.length === 0) return null;

    return (
      <Animated.View
        entering={FadeInUp.delay((index + 3) * 150).duration(600).springify()}
        style={styles.categorySection}
      >
        <SectionHeader
          title={item.name}
          subtitle={item.description}
          actionTitle="Ver todos"
          onActionPress={() => handleCategoryPress(item.id)}
        />
        <FlatList
          data={categoryBooks}
          renderItem={({ item: book, index: bookIndex }) => (
            <Animated.View
              key={book.id}
              entering={FadeInUp.delay((bookIndex + 1) * 100).duration(600).springify()}
            >
              <BookCard book={book} variant="compact" />
            </Animated.View>
          )}
          keyExtractor={(book) => `category-${item.id}-${book.id}`}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    );
  }, [books, handleCategoryPress]);

  const renderHeader = () => (
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

      {/* Filtros de categoria */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(600).springify()}
        style={styles.filtersContainer}
      >
        <View style={styles.filtersHeader}>
          <ThemedText style={styles.filtersTitle}>
            {searchQuery ? 'Resultados da Busca' : 'Categorias'}
          </ThemedText>
          <View style={styles.headerActions}>
            <Button
              title={getSortLabel()}
              variant="ghost"
              size="sm"
              onPress={handleSortPress}
              style={styles.sortButton}
            >
              <IconSymbol
                name="arrow.up.arrow.down"
                size={16}
                color={Colors.light.primary}
              />
            </Button>
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
        </View>
        
        {!searchQuery && (
          <FlatList
            data={mockCategories}
            renderItem={({ item, index }) => renderCategoryChip(item, index)}
            keyExtractor={(category) => category.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        )}
      </Animated.View>

      {/* Contador de resultados */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(600).springify()}
        style={styles.resultsContainer}
      >
        <ThemedText style={styles.resultsText}>
          {searchLoading ? 'Buscando...' : 
           `${displayBooks.length} livro${displayBooks.length !== 1 ? 's' : ''} ${getResultsLabel()}`}
        </ThemedText>
        {error && (
          <ThemedText style={styles.errorText}>
            {error}
          </ThemedText>
        )}
      </Animated.View>
    </ThemedView>
  );

  const getSortLabel = () => {
    const labels = {
      published_at: 'Recentes',
      reads_count: 'Mais Lidos', 
      likes_count: 'Curtidos',
      average_rating: 'Avaliações',
    };
    return labels[sortBy];
  };

  const getResultsLabel = () => {
    if (searchQuery) return 'encontrado(s)';
    if (selectedCategory) {
      const category = mockCategories.find(cat => cat.id === selectedCategory);
      return `em ${category?.name}`;
    }
    return 'disponíveis';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <FlatList
        data={searchQuery || selectedCategory ? [{ type: 'results' }] : mockCategories}
        keyExtractor={(item, index) => 
          searchQuery || selectedCategory ? 'results' : `category-${item.id}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        renderItem={searchQuery || selectedCategory ? undefined : renderCategorySection}
        ListFooterComponent={
          (searchQuery || selectedCategory) ? (
            <ThemedView style={styles.content}>
              <FlatList
                data={displayBooks}
                renderItem={renderBookItem}
                keyExtractor={(book) => `search-${book.id}`}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
                onEndReached={!searchQuery ? loadMore : undefined}
                onEndReachedThreshold={0.5}
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoriesList: {
    gap: Spacing.sm,
  },
  categoryChip: {
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
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: 4,
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