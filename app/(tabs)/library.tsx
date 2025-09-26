import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/components/book-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { mockLibraryBooks } from '@/data/mock-books';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Book } from '@/types/book';

type LibraryFilter = 'all' | 'reading' | 'completed' | 'want_to_read';
type SortOption = 'recent' | 'title' | 'author' | 'progress';

export default function LibraryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<LibraryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const backgroundColor = useThemeColor({}, 'background');

  const filters = [
    { key: 'all', label: 'Todos', icon: 'book' },
    { key: 'reading', label: 'Lendo', icon: 'book.fill' },
    { key: 'completed', label: 'Lidos', icon: 'checkmark.circle' },
    { key: 'want_to_read', label: 'Quero ler', icon: 'bookmark' },
  ];

  const sortOptions = [
    { key: 'recent', label: 'Recente' },
    { key: 'title', label: 'Título' },
    { key: 'author', label: 'Autor' },
    { key: 'progress', label: 'Progresso' },
  ];

  const filteredBooks = mockLibraryBooks
    .filter(book => selectedFilter === 'all' || book.status === selectedFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'recent':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleBookPress = (book: Book) => {
    Alert.alert(
      book.title,
      `Status: ${getStatusLabel(book.status)}\nProgresso: ${book.progress || 0}%`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar Lendo', onPress: () => console.log('Continuar:', book.title) },
        { text: 'Detalhes', onPress: () => console.log('Detalhes:', book.title) },
      ]
    );
  };

  const handleCreateBook = () => {
    Alert.alert(
      'Criar Novo Livro',
      'Escolha uma opção para adicionar um livro à sua biblioteca',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Escrever Livro', onPress: () => console.log('Escrever novo livro') },
        { text: 'Buscar Livro', onPress: () => console.log('Buscar livro existente') },
      ]
    );
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      reading: 'Lendo',
      completed: 'Concluído',
      want_to_read: 'Quero ler',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const renderFilterChip = (filter: any, index: number) => (
    <Animated.View
      key={filter.key}
      entering={FadeInUp.delay((index + 2) * 50).duration(400).springify()}
    >
      <Button
        title={filter.label}
        variant={selectedFilter === filter.key ? 'primary' : 'outline'}
        size="sm"
        onPress={() => setSelectedFilter(filter.key as LibraryFilter)}
        style={styles.filterChip}
      />
    </Animated.View>
  );

  const renderBookItem = ({ item, index }: { item: Book; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 4) * 100).duration(600).springify()}
      style={viewMode === 'grid' ? styles.gridItem : undefined}
    >
      <BookCard 
        book={item} 
        variant={viewMode === 'grid' ? 'compact' : 'default'}
        onPress={handleBookPress}
      />
    </Animated.View>
  );

  const getStatsForStatus = (status: LibraryFilter) => {
    if (status === 'all') return mockLibraryBooks.length;
    return mockLibraryBooks.filter(book => book.status === status).length;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => `library-${item.id}`}
        renderItem={renderBookItem}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <ThemedView style={styles.header}>
            {/* Título da tela */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(600).springify()}
              style={styles.titleContainer}
            >
              <View style={styles.titleRow}>
                <View>
                  <ThemedText style={styles.title}>Minha Biblioteca</ThemedText>
                  <ThemedText style={styles.subtitle}>
                    {filteredBooks.length} livro(s) em sua biblioteca
                  </ThemedText>
                </View>
                <Button
                  title={viewMode === 'list' ? 'Grade' : 'Lista'}
                  variant="ghost"
                  size="sm"
                  onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  style={styles.viewModeButton}
                />
              </View>
            </Animated.View>

            {/* Estatísticas rápidas */}
            <Animated.View
              entering={FadeInUp.delay(150).duration(600).springify()}
              style={styles.statsContainer}
            >
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {getStatsForStatus('reading')}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Lendo</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {getStatsForStatus('completed')}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Lidos</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {getStatsForStatus('want_to_read')}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Quero ler</ThemedText>
              </View>
            </Animated.View>

            {/* Filtros */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
              style={styles.filtersContainer}
            >
              <View style={styles.filtersHeader}>
                <ThemedText style={styles.filtersTitle}>Filtros</ThemedText>
                <Button
                  title={`Ordenar por: ${sortOptions.find(opt => opt.key === sortBy)?.label}`}
                  variant="ghost"
                  size="sm"
                  onPress={() => {
                    Alert.alert(
                      'Ordenar por',
                      'Escolha uma opção de ordenação',
                      sortOptions.map(option => ({
                        text: option.label,
                        onPress: () => setSortBy(option.key as SortOption),
                      }))
                    );
                  }}
                  style={styles.sortButton}
                />
              </View>
              <FlatList
                data={filters}
                renderItem={({ item, index }) => renderFilterChip(item, index)}
                keyExtractor={(filter) => filter.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersList}
              />
            </Animated.View>

            {/* Contador de resultados */}
            <Animated.View
              entering={FadeInUp.delay(250).duration(600).springify()}
              style={styles.resultsContainer}
            >
              <ThemedText style={styles.resultsText}>
                {filteredBooks.length} livro(s) {selectedFilter !== 'all' ? `(${getStatusLabel(selectedFilter)})` : ''}
              </ThemedText>
            </Animated.View>
          </ThemedView>
        }
        ListEmptyComponent={
          <Animated.View
            entering={FadeInUp.delay(300).duration(600).springify()}
            style={styles.emptyContainer}
          >
            <IconSymbol 
              name="books.vertical" 
              size={64} 
              color={Colors.light.placeholder} 
            />
            <ThemedText style={styles.emptyTitle}>
              Biblioteca vazia
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Comece adicionando alguns livros à sua biblioteca
            </ThemedText>
            <Button
              title="Descobrir Livros"
              variant="primary"
              size="md"
              onPress={() => console.log('Ir para descobrir')}
              style={styles.emptyButton}
            />
          </Animated.View>
        }
        ListFooterComponent={<View style={styles.bottomSpacer} />}
      />

      {/* Botão Flutuante */}
      <FloatingActionButton
        icon="plus"
        onPress={handleCreateBook}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  titleContainer: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  viewModeButton: {
    marginLeft: Spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.neutral,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersList: {
    gap: Spacing.sm,
  },
  filterChip: {
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
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  gridItem: {
    flex: 0.48,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    flex: 1,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
  bottomSpacer: {
    height: 100, // Extra space for FAB
  },
});