// components/books/book-details-modal.tsx
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useBookDetails } from '@/hooks/use-book-details';
import { APIBook } from '@/types/books-api';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { Button } from '../ui/button';
import { IconSymbol } from '../ui/icon-symbol';
import { CommentsSection } from './comments-section';
import { RatingStars } from './rating-stars';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface BookDetailsModalProps {
  book: APIBook;
  visible: boolean;
  onClose: () => void;
}

export function BookDetailsModal({ book, visible, onClose }: BookDetailsModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  const {
    book: detailedBook,
    comments,
    ratingStats,
    isInLibrary,
    loading,
    error,
    rateBook,
    addToLibrary,
    removeFromLibrary,
    likeBook,
    addComment,
  } = useBookDetails({
    bookId: book.id,
    autoLoad: visible,
  });

  const [userRating, setUserRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleRating = async (rating: number) => {
    const success = await rateBook(rating);
    if (success) {
      setUserRating(rating);
    }
  };

  const handleLibraryToggle = async () => {
    if (isInLibrary) {
      const success = await removeFromLibrary();
      if (success) {
        Alert.alert('Sucesso', 'Livro removido da biblioteca');
      }
    } else {
      const success = await addToLibrary();
      if (success) {
        Alert.alert('Sucesso', 'Livro adicionado à biblioteca');
      }
    }
  };

  const handleLike = async () => {
    const liked = await likeBook();
    setIsLiked(liked);
  };

  const handleReadBook = () => {
    Alert.alert(
      'Ler Livro',
      'Deseja começar a ler este livro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ler', onPress: () => console.log('Ler livro:', book.id) },
      ]
    );
  };

  const renderBookInfo = () => (
    <View style={styles.bookInfo}>
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: book.cover_url || 'https://via.placeholder.com/200x300' }}
          style={styles.cover}
          contentFit="cover"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <ThemedText style={styles.title}>{book.title}</ThemedText>
        <ThemedText style={styles.author}>por {book.users.name}</ThemedText>
        
        <View style={styles.statsRow}>
          {ratingStats && (
            <RatingStars
              rating={ratingStats.average_rating}
              showNumber
              size={16}
            />
          )}
          <ThemedText style={styles.statsText}>
            {book.reads_count} leitura{book.reads_count !== 1 ? 's' : ''}
          </ThemedText>
          <ThemedText style={styles.statsText}>
            {book.likes_count} curtida{book.likes_count !== 1 ? 's' : ''}
          </ThemedText>
        </View>

        <View style={styles.tagsContainer}>
          {book.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </View>
          ))}
        </View>

        <ThemedText style={styles.description}>
          {book.description}
        </ThemedText>

        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <IconSymbol name="book" size={16} color={Colors.light.placeholder} />
            <ThemedText style={styles.metaText}>
              {book.chapters_count} capítulo{book.chapters_count !== 1 ? 's' : ''}
            </ThemedText>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol name="text.alignleft" size={16} color={Colors.light.placeholder} />
            <ThemedText style={styles.metaText}>
              {book.words_count.toLocaleString()} palavras
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderUserActions = () => (
    <View style={styles.userActions}>
      {user && (
        <View style={styles.ratingSection}>
          <ThemedText style={styles.ratingLabel}>Sua avaliação:</ThemedText>
          <RatingStars
            rating={userRating}
            interactive
            onRatingChange={handleRating}
            size={24}
            showNumber={false}
          />
        </View>
      )}

      <View style={styles.actionButtons}>
        <Button
          title="Ler Livro"
          variant="primary"
          size="lg"
          onPress={handleReadBook}
          style={styles.primaryButton}
        />
        
        <View style={styles.secondaryButtons}>
          {user && (
            <>
              <Button
                title={isInLibrary ? "Na Biblioteca" : "Salvar"}
                variant={isInLibrary ? "primary" : "outline"}
                size="md"
                onPress={handleLibraryToggle}
                style={styles.actionButton}
              >
                <IconSymbol
                  name={isInLibrary ? "checkmark" : "bookmark"}
                  size={16}
                  color={isInLibrary ? "white" : Colors.light.primary}
                />
              </Button>
              
              <Button
                title={isLiked ? "Curtido" : "Curtir"}
                variant="outline"
                size="md"
                onPress={handleLike}
                style={styles.actionButton}
              >
                <IconSymbol
                  name={isLiked ? "heart.fill" : "heart"}
                  size={16}
                  color={isLiked ? Colors.light.error : Colors.light.primary}
                />
              </Button>
            </>
          )}
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <Button
        title="Detalhes"
        variant={activeTab === 'details' ? 'primary' : 'ghost'}
        size="md"
        onPress={() => setActiveTab('details')}
        style={styles.tabButton}
      />
      <Button
        title={`Comentários (${comments.length})`}
        variant={activeTab === 'comments' ? 'primary' : 'ghost'}
        size="md"
        onPress={() => setActiveTab('comments')}
        style={styles.tabButton}
      />
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'details') {
      return (
        <View style={styles.tabContent}>
          <ThemedText style={styles.sectionTitle}>Sobre o Livro</ThemedText>
          <ThemedText style={styles.fullDescription}>
            {book.description}
          </ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Informações</ThemedText>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Autor:</ThemedText>
              <ThemedText style={styles.infoValue}>{book.users.name}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Publicado em:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {new Date(book.published_at).toLocaleDateString('pt-BR')}
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Capítulos:</ThemedText>
              <ThemedText style={styles.infoValue}>{book.chapters_count}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Palavras:</ThemedText>
              <ThemedText style={styles.infoValue}>{book.words_count.toLocaleString()}</ThemedText>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <CommentsSection
          comments={comments}
          onAddComment={user ? addComment : undefined}
          currentUserId={user?.id}
          loading={loading}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container} edges={['top']}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Button
              title="Fechar"
              variant="ghost"
              size="sm"
              onPress={onClose}
            >
              <IconSymbol name="xmark" size={20} color={Colors.light.primary} />
            </Button>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderBookInfo()}
            {renderUserActions()}
            {renderTabs()}
            {renderTabContent()}
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  scrollView: {
    flex: 1,
  },
  bookInfo: {
    flexDirection: 'row',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  coverContainer: {
    width: 120,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    lineHeight: 28,
  },
  author: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statsText: {
    fontSize: 12,
    opacity: 0.6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.light.neutral,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  metaInfo: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.6,
  },
  userActions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  ratingSection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    gap: Spacing.md,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingHorizontal: Spacing.xl,
  },
  tabButton: {
    flex: 1,
    borderRadius: 0,
  },
  tabContent: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: Spacing.md,
  },
  fullDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  infoList: {
    gap: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    opacity: 0.8,
  },
});