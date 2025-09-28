import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfessionalEditor } from '@/components/editor/professional-editor';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { useBookCreation } from '@/hooks/use-book-creation';
import { ChapterDraft } from '@/types/book-creation';

export default function ChapterEditorScreen() {
  const { bookId, chapterId } = useLocalSearchParams<{ bookId: string; chapterId: string }>();
  const { 
    loadChapter, 
    updateChapter, 
    publishChapter,
    saveChapterDraft,
    loading, 
    error 
  } = useBookCreation();

  const [chapter, setChapter] = useState<ChapterDraft | null>(null);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (bookId && chapterId) {
      loadChapterData();
    }
  }, [bookId, chapterId]);

  const loadChapterData = async () => {
    if (!bookId || !chapterId) return;

    try {
      const chapterData = await loadChapter(bookId, chapterId);
      if (chapterData) {
        setChapter(chapterData);
        setContent(chapterData.content);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar capítulo');
    }
  };

  const handleContentChange = (newContent: string, newWordCount: number) => {
    setContent(newContent);
    setWordCount(newWordCount);
    setHasUnsavedChanges(true);
  };

  const handleSave = async (contentToSave: string) => {
    if (!bookId || !chapterId) return;

    try {
      const updatedChapter = await saveChapterDraft(bookId, chapterId, contentToSave);
      if (updatedChapter) {
        setChapter(updatedChapter);
        setHasUnsavedChanges(false);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao salvar rascunho');
    }
  };

  const handlePublish = async (contentToPublish: string) => {
    if (!bookId || !chapterId) return;

    try {
      // Primeiro salva o conteúdo
      await handleSave(contentToPublish);
      
      // Depois publica
      const result = await publishChapter(bookId, chapterId);
      if (result) {
        setChapter(result.chapter);
        setHasUnsavedChanges(false);
        Alert.alert(
          'Sucesso!',
          'Capítulo publicado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao publicar capítulo');
    }
  };

  const handleUpdateTitle = () => {
    if (!chapter) return;

    Alert.prompt(
      'Editar Título',
      'Digite o novo título do capítulo:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: async (newTitle) => {
            if (!newTitle?.trim()) {
              Alert.alert('Erro', 'Título do capítulo é obrigatório');
              return;
            }

            try {
              const updatedChapter = await updateChapter(bookId!, chapterId!, {
                title: newTitle.trim()
              });
              
              if (updatedChapter) {
                setChapter(updatedChapter);
              }
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao atualizar título');
            }
          }
        }
      ],
      'plain-text',
      chapter.title
    );
  };

  if (loading && !chapter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Carregando capítulo...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!chapter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={Colors.light.error} />
          <ThemedText style={styles.errorTitle}>Capítulo não encontrado</ThemedText>
          <ThemedText style={styles.errorDescription}>
            O capítulo que você está tentando editar não foi encontrado.
          </ThemedText>
          <Button
            title="Voltar"
            variant="primary"
            size="md"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
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
            <ThemedText style={styles.chapterTitle} numberOfLines={1}>
              {chapter.title}
            </ThemedText>
            <ThemedText style={styles.chapterSubtitle}>
              Capítulo {chapter.chapter_number} • {wordCount} palavras
            </ThemedText>
          </View>
          
          <Button
            title="Editar Título"
            variant="ghost"
            size="sm"
            onPress={handleUpdateTitle}
            style={styles.editTitleButton}
          />
        </View>
        
        <View style={styles.statusBar}>
          <View style={styles.statusLeft}>
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
          
          <View style={styles.statusRight}>
            {hasUnsavedChanges && (
              <ThemedText style={styles.unsavedText}>Não salvo</ThemedText>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Editor */}
      <ProfessionalEditor
        initialContent={content}
        onContentChange={handleContentChange}
        onSave={handleSave}
        onPublish={chapter.is_published ? undefined : handlePublish}
        placeholder="Comece a escrever seu capítulo..."
        autoSave={true}
        autoSaveInterval={30000}
        maxLength={50000}
        showWordCount={true}
        showFormattingToolbar={true}
        readOnly={false}
      />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  errorDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  errorButton: {
    marginTop: Spacing.lg,
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
    marginBottom: Spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  chapterSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  editTitleButton: {
    alignSelf: 'flex-start',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flex: 1,
  },
  statusRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
  unsavedText: {
    fontSize: 12,
    color: Colors.light.warning,
    fontWeight: '600',
  },
});
