import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/components/book-card';
import { BookStatusChip } from '@/components/library/book-status-chip';
import { DownloadProgress } from '@/components/library/download-progress';
import { OfflineManager } from '@/components/library/offline-manager';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useLibrary } from '@/hooks/use-library';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LibraryBook } from '@/types/library';

type LibraryFilter = 'all' | 'reading' | 'completed' | 'want_to_read' | 'offline';
type SortOption = 'recent' | 'title' | 'author' | 'progress';

export default function LibraryScreen() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const backgroundColor = useThemeColor({}, 'background');

  const {
    books,
    stats,
    loading,
    refreshing,
    error,
    pagination,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    refresh,
    loadMore,
    removeFromLibrary,
    downloadOffline,
    removeOffline,
    renewOffline,
  } = useLibrary();

  const filters = [
    { key: 'all', label: 'Todos', icon: 'book', count: stats.total },
    { key: 'reading', label: 'Lendo', icon: 'book.fill', count: stats.reading },
    { key: 'completed', label: 'Lidos', icon: 'checkmark.circle', count: stats.completed },
    { key: 'want_to_read', label: 'Quero ler', icon: 'bookmark', count: stats.want_to_read },
    { key: 'offline', label: 'Offline', icon: 'arrow.down.circle.fill', count: stats.offline },
  ];

  const sortOptions = [
    { key: 'recent', label: 'Mais Recentes' },
    { key: 'title', label: 'Título A-Z' },
    { key: 'author', label: 'Autor A-Z' },
    { key: 'progress', label: 'Progresso' },
  ];

  const handleBookPress = (book: LibraryBook) => {
    Alert.alert(
      book.title,
      `Por ${book.author_name}\n\n${book.description}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Continuar Lendo', 
          onPress: () => console.log('Continuar:', book.title) 
        },
        { 
          text: 'Detalhes', 
          onPress: () => console.log('Detalhes:', book.title) 
        },
      ]
    );
  };

  const handleBookLongPress = (book: LibraryBook) => {
    Alert.alert(
      'Opções do Livro',
      book.title,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Marcar como Lendo', 
          onPress: () => console.log('Marcar como lendo:', book.book_id)
        },
        { 
          text: 'Marcar como Lido', 
          onPress: () => console.log('Marcar como lido:', book.book_id)
        },
        { 
          text: 'Remover da Biblioteca', 
          style: 'destructive',
          onPress: () => handleRemoveBook(book.book_id)
        },
      ]
    );
  };

  const handleRemoveBook = async (bookId: string) => {
    Alert.alert(
      'Remover Livro',
      'Tem certeza que deseja remover este livro da sua biblioteca?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const success = await removeFromLibrary(bookId);
            if (!success && error) {
              Alert.alert('Erro', error);
            }
          },
        },
      ]
    );
  };

  const handleAddBook = () => {
    Alert.alert(
      'Adicionar Livro',
      'Como você gostaria de adicionar um livro à sua biblioteca?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Procurar Livros', onPress: () => console.log('Buscar livros') },
        { text: 'Escrever Livro', onPress: () => router.push('/create-book') },
      ]
    );
  };

  const handleSortPress = () => {
    Alert.alert(
      'Ordenar por',
      'Escolha uma opção de ordenação',
      sortOptions.map(option => ({
        text: option.label,
        onPress: () => setSortBy(option.key as SortOption),
      }))
    );
  };

  const renderFilterChip = (filterItem: any, index: number) => (
    <Animated.View
      key={filterItem.key}
      entering={FadeInUp.delay((index + 2) * 50).duration(400).springify()}
    >
      <Button
        title={`${filterItem.label} (${filterItem.count})`}
        variant={filter === filterItem.key ? 'primary' : 'outline'}
        size="sm"
        onPress={() => setFilter(filterItem.key as LibraryFilter)}
        style={styles.filterChip}
      />
    </Animated.View>
  );

  const renderBookItem = ({ item, index }: { item: LibraryBook; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay((index + 5) * 80).duration(600).springify()}
      style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
    >
      <Pressable style={styles.bookContainer} onLongPress={() => handleBookLongPress(item)}>
        <BookCard 
          book={{
            id: item.book_id,
            author_id: '', // Nota: API da library não retorna author_id
            title: item.title,
            slug: item.title.toLowerCase().replace(/\s+/g, '-'),
            description: item.description,
            cover_url: item.cover_url,
            status: 'published', // Livros na library são sempre publicados
            visibility: 'public',
            tags: [], // Nota: API não retorna tags
            words_count: item.words_count,
            chapters_count: item.chapters_count,
            likes_count: item.likes_count,
            reads_count: item.reads_count,
            created_at: item.saved_at,
            updated_at: item.saved_at,
            published_at: item.published_at,
            users: {
              id: '', // Nota: API não retorna user_id
              name: item.author_name,
              username: item.author_username,
              avatar_url: item.author_avatar,
            },
            average_rating: 0, // Nota: API não retorna rating
            ratings_count: 0,
            comments_count: 0,
          }}
          variant={viewMode === 'grid' ? 'compact' : 'default'}
          onPress={() => handleBookPress(item)}
        />
        
        {/* Overlays de Status */}
        <View style={styles.overlays}>
          {/* Status de Leitura */}
          {item.reading_status && (
            <Animated.View entering={FadeInLeft.delay(100).duration(300)}>
              <BookStatusChip 
                status={item.reading_status} 
                size={viewMode === 'grid' ? 'sm' : 'md'} 
              />
            </Animated.View>
          )}
          
          {/* Progresso de Download */}
          {item.download_progress !== undefined && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <DownloadProgress 
                progress={item.download_progress} 
                size={viewMode === 'grid' ? 'sm' : 'md'}
              />
            </Animated.View>
          )}
          
          {/* Gerenciador Offline */}
          {item.download_progress === undefined && (
            <Animated.View entering={FadeInUp.delay(300).duration(400)}>
              <OfflineManager
                isOffline={item.is_offline || false}
                expiresAt={item.offline_expires_at}
                onDownload={() => downloadOffline(item.book_id)}
                onRemove={() => removeOffline(item.book_id)}
                onRenew={() => renewOffline(item.book_id)}
              />
            </Animated.View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeInUp.delay(300).duration(600).springify()}
      style={styles.emptyContainer}
    >
      <IconSymbol 
        name="books.vertical" 
        size={80} 
        color={Colors.light.placeholder} 
      />
      <ThemedText style={styles.emptyTitle}>
        {filter === 'all' ? 'Biblioteca vazia' : `Nenhum livro ${getFilterLabel()}`}
      </ThemedText>
      <ThemedText style={styles.emptyText}>
        {filter === 'all' 
          ? 'Comece adicionando alguns livros à sua biblioteca'
          : `Adicione livros e marque-os como "${getFilterLabel()}" para vê-los aqui`
        }
      </ThemedText>
      {filter === 'all' && (
        <Button
          title="Descobrir Livros"
          variant="primary"
          size="md"
          onPress={() => console.log('Ir para descobrir')}
          style={styles.emptyButton}
        />
      )}
    </Animated.View>
  );

  const getFilterLabel = () => {
    const filterMap = {
      reading: 'lendo',
      completed: 'lidos',
      want_to_read: 'quero ler',
      offline: 'offline',
      all: 'todos',
    };
    return filterMap[filter] || 'todos';
  };

  const renderHeader = () => (
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
              {stats.total} livro(s) em sua biblioteca
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
          <IconSymbol name="book.fill" size={20} color={Colors.light.primary} />
          <ThemedText style={styles.statNumber}>{stats.reading}</ThemedText>
          <ThemedText style={styles.statLabel}>Lendo</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <IconSymbol name="checkmark.circle.fill" size={20} color={Colors.light.success} />
          <ThemedText style={styles.statNumber}>{stats.completed}</ThemedText>
          <ThemedText style={styles.statLabel}>Lidos</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <IconSymbol name="bookmark.fill" size={20} color={Colors.light.secondary} />
          <ThemedText style={styles.statNumber}>{stats.want_to_read}</ThemedText>
          <ThemedText style={styles.statLabel}>Quero ler</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <IconSymbol name="arrow.down.circle.fill" size={20} color={Colors.light.warning} />
          <ThemedText style={styles.statNumber}>{stats.offline}</ThemedText>
          <ThemedText style={styles.statLabel}>Offline</ThemedText>
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
            title={`${sortOptions.find(opt => opt.key === sortBy)?.label}`}
            variant="ghost"
            size="sm"
            onPress={handleSortPress}
            style={styles.sortButton}
          />
        </View>
        <FlatList
          data={filters}
          renderItem={({ item, index }) => renderFilterChip(item, index)}
          keyExtractor={(filterItem) => filterItem.key}
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
          {books.length} livro(s) {filter !== 'all' ? `(${getFilterLabel()})` : ''}
        </ThemedText>
        {error && (
          <ThemedText style={styles.errorText}>
            {error}
          </ThemedText>
        )}
      </Animated.View>
    </ThemedView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <FlatList
        data={books}
        keyExtractor={(item) => `library-${item.book_id}`}
        renderItem={renderBookItem}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        ListFooterComponent={
          <View style={styles.bottomSpacer}>
            {pagination.hasMore && !loading && books.length > 0 && (
              <Animated.View entering={FadeInUp.duration(400)}>
                <Button
                  title="Carregar Mais"
                  variant="outline"
                  size="md"
                  onPress={loadMore}
                  style={styles.loadMoreButton}
                />
              </Animated.View>
            )}
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Botão Flutuante */}
      <FloatingActionButton
        icon="plus"
        onPress={handleAddBook}
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
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
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
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: 4,
  },
  listItem: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  gridItem: {
    flex: 0.48,
  },
  bookContainer: {
    position: 'relative',
  },
  overlays: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    gap: Spacing.xs,
    alignItems: 'flex-end',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl * 2,
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
    paddingHorizontal: Spacing.md,
  },
  emptyButton: {
    minWidth: 200,
  },
  bottomSpacer: {
    height: 120, // Extra space for FAB
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  loadMoreButton: {
    marginBottom: Spacing.lg,
  },
});