import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useBookCreation } from '@/hooks/use-book-creation';
import { ChapterDraft } from '@/types/book-creation';

export default function BookEditorScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { 
    loadBook, 
    createChapter, 
    updateBook, 
    publishBook, 
    deleteBook,
    deleteChapter,
    reorderChapters,
    loading, 
    error, 
    currentBook, 
    chapters 
  } = useBookCreation();

  const [activeTab, setActiveTab] = useState<'chapters' | 'settings'>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<ChapterDraft | null>(null);

  useEffect(() => {
    if (bookId) {
      loadBook(bookId);
    }
  }, [bookId, loadBook]);

  const handleCreateChapter = () => {
    if (!currentBook) return;

    const newChapterNumber = chapters.length + 1;
    
    Alert.prompt(
      'Novo Capítulo',
      'Digite o título do capítulo:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Criar',
          onPress: async (title) => {
            if (!title?.trim()) {
              Alert.alert('Erro', 'Título do capítulo é obrigatório');
              return;
            }

            try {
              const chapter = await createChapter(currentBook.id, {
                title: title.trim(),
                content: '',
                chapter_number: newChapterNumber,
                is_published: false,
              });

              if (chapter) {
                router.push(`/chapter-editor/${currentBook.id}/${chapter.id}`);
              }
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao criar capítulo');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const handleEditChapter = (chapter: ChapterDraft) => {
    router.push(`/chapter-editor/${currentBook?.id}/${chapter.id}`);
  };

  const handleDeleteChapter = (chapter: ChapterDraft) => {
    if (!currentBook) return;

    Alert.alert(
      'Deletar Capítulo',
      `Tem certeza que deseja deletar o capítulo "${chapter.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteChapter(currentBook.id, chapter.id);
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao deletar capítulo');
            }
          }
        }
      ]
    );
  };

  const handlePublishBook = () => {
    if (!currentBook) return;

    Alert.alert(
      'Publicar Livro',
      'Tem certeza que deseja publicar este livro? Ele ficará disponível para outros usuários.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Publicar',
          onPress: async () => {
            try {
              await publishBook(currentBook.id);
              Alert.alert('Sucesso', 'Livro publicado com sucesso!');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao publicar livro');
            }
          }
        }
      ]
    );
  };

  const handleDeleteBook = () => {
    if (!currentBook) return;

    Alert.alert(
      'Deletar Livro',
      'Tem certeza que deseja deletar este livro? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBook(currentBook.id);
              router.back();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao deletar livro');
            }
          }
        }
      ]
    );
  };

  const renderChapterItem = ({ item: chapter }: { item: ChapterDraft }) => (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.chapterItem}>
      <View style={styles.chapterHeader}>
        <View style={styles.chapterInfo}>
          <ThemedText style={styles.chapterNumber}>Capítulo {chapter.chapter_number}</ThemedText>
          <ThemedText style={styles.chapterTitle}>{chapter.title}</ThemedText>
          <ThemedText style={styles.chapterStats}>
            {chapter.words_count} palavras • {chapter.is_published ? 'Publicado' : 'Rascunho'}
          </ThemedText>
        </View>
        
        <View style={styles.chapterStatus}>
          {chapter.is_published ? (
            <View style={[styles.statusBadge, styles.publishedBadge]}>
              <ThemedText style={styles.statusText}>Publicado</ThemedText>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.draftBadge]}>
              <ThemedText style={styles.statusText}>Rascunho</ThemedText>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.chapterActions}>
        <Button
          title="Editar"
          variant="outline"
          size="sm"
          onPress={() => handleEditChapter(chapter)}
          style={styles.actionButton}
        />
        <Button
          title="Deletar"
          variant="ghost"
          size="sm"
          onPress={() => handleDeleteChapter(chapter)}
          textStyle={styles.deleteButtonText}
          style={styles.actionButton}
        />
      </View>
    </Animated.View>
  );

  const renderChaptersTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.chaptersHeader}>
        <ThemedText style={styles.sectionTitle}>
          Capítulos ({chapters.length})
        </ThemedText>
        <Button
          title="Novo Capítulo"
          variant="primary"
          size="sm"
          onPress={handleCreateChapter}
          style={styles.newChapterButton}
        />
      </View>
      
      {chapters.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="book" size={48} color={Colors.light.muted} />
          <ThemedText style={styles.emptyTitle}>Nenhum capítulo criado</ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Comece criando o primeiro capítulo do seu livro
          </ThemedText>
          <Button
            title="Criar Primeiro Capítulo"
            variant="primary"
            size="md"
            onPress={handleCreateChapter}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id}
          renderItem={renderChapterItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chaptersList}
        />
      )}
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <ThemedText style={styles.sectionTitle}>Configurações do Livro</ThemedText>
      
      <View style={styles.bookInfo}>
        <View style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Título:</ThemedText>
          <ThemedText style={styles.infoValue}>{currentBook?.title}</ThemedText>
        </View>
        
        <View style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Status:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {currentBook?.status === 'published' ? 'Publicado' : 
             currentBook?.status === 'draft' ? 'Rascunho' : 'Arquivado'}
          </ThemedText>
        </View>
        
        <View style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Total de palavras:</ThemedText>
          <ThemedText style={styles.infoValue}>{currentBook?.words_count.toLocaleString()}</ThemedText>
        </View>
        
        <View style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Capítulos:</ThemedText>
          <ThemedText style={styles.infoValue}>{currentBook?.chapters_count}</ThemedText>
        </View>
        
        <View style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Criado em:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {currentBook?.created_at ? new Date(currentBook.created_at).toLocaleDateString('pt-BR') : '-'}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.settingsActions}>
        {currentBook?.status === 'draft' && (
          <Button
            title="Publicar Livro"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handlePublishBook}
            style={styles.publishButton}
          />
        )}
        
        <Button
          title="Deletar Livro"
          variant="ghost"
          size="md"
          fullWidth
          onPress={handleDeleteBook}
          textStyle={styles.deleteBookText}
          style={styles.deleteBookButton}
        />
      </View>
    </View>
  );

  if (!currentBook) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Carregando livro...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerContent}>
          <Button
            title="← Voltar"
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            style={styles.backButton}
          />
          
          <View style={styles.headerInfo}>
            <ThemedText style={styles.bookTitle} numberOfLines={1}>
              {currentBook.title}
            </ThemedText>
            <ThemedText style={styles.bookSubtitle}>
              {currentBook.chapters_count} capítulos • {currentBook.words_count.toLocaleString()} palavras
            </ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Button
          title="Capítulos"
          variant={activeTab === 'chapters' ? 'primary' : 'ghost'}
          size="md"
          onPress={() => setActiveTab('chapters')}
          style={styles.tabButton}
        />
        <Button
          title="Configurações"
          variant={activeTab === 'settings' ? 'primary' : 'ghost'}
          size="md"
          onPress={() => setActiveTab('settings')}
          style={styles.tabButton}
        />
      </View>

      {/* Content */}
      {activeTab === 'chapters' ? renderChaptersTab() : renderSettingsTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.muted,
  },
  header: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  bookSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingHorizontal: Spacing.lg,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  tabContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  chaptersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  newChapterButton: {
    alignSelf: 'flex-end',
  },
  chaptersList: {
    paddingBottom: Spacing.xl,
  },
  chapterItem: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterNumber: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  chapterStats: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  chapterStatus: {
    marginLeft: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  publishedBadge: {
    backgroundColor: Colors.light.success,
  },
  draftBadge: {
    backgroundColor: Colors.light.warning,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  chapterActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  deleteButtonText: {
    color: Colors.light.error,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: Spacing.lg,
  },
  bookInfo: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.muted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
  },
  settingsActions: {
    gap: Spacing.md,
  },
  publishButton: {
    marginBottom: Spacing.sm,
  },
  deleteBookButton: {
    marginTop: Spacing.sm,
  },
  deleteBookText: {
    color: Colors.light.error,
  },
});
