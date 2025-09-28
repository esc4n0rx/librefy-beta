import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Colors, Spacing } from '@/constants/theme';
import { useBookCreation } from '@/hooks/use-book-creation';
import { BookCreationData } from '@/types/book-creation';

const GENRES = [
  'Ficção', 'Romance', 'Mistério', 'Suspense', 'Terror', 'Fantasia',
  'Ficção Científica', 'Aventura', 'Drama', 'Comédia', 'Biografia',
  'História', 'Autoajuda', 'Poesia', 'Infantil', 'Jovem Adulto'
];

const LANGUAGES = [
  'Português', 'Inglês', 'Espanhol', 'Francês', 'Italiano', 'Alemão'
];

export default function CreateBookScreen() {
  const { createBook, loading, error, clearError } = useBookCreation();
  
  const [formData, setFormData] = useState<BookCreationData>({
    title: '',
    description: '',
    cover_url: '',
    tags: [],
    genre: '',
    language: 'Português',
    is_public: true,
    allow_comments: true,
    allow_ratings: true,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<BookCreationData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BookCreationData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Título não pode exceder 100 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Descrição não pode exceder 1000 caracteres';
    }

    if (!formData.genre) {
      newErrors.genre = 'Gênero é obrigatório';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Pelo menos uma tag é obrigatória';
    } else if (formData.tags.length > 5) {
      newErrors.tags = 'Máximo de 5 tags permitidas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBook = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      const book = await createBook(formData);
      
      if (book) {
        Alert.alert(
          'Sucesso!',
          'Livro criado com sucesso! Agora você pode começar a escrever os capítulos.',
          [
            {
              text: 'OK',
              onPress: () => router.push(`/book-editor/${book.id}`)
            }
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar livro');
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: undefined }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderGenreSelector = () => (
    <Animated.View entering={FadeInUp.delay(300).duration(600).springify()}>
      <ThemedText style={styles.label}>Gênero *</ThemedText>
      <View style={styles.genreGrid}>
        {GENRES.map(genre => (
          <Pressable
            key={genre}
            style={[
              styles.genreItem,
              formData.genre === genre && styles.genreItemSelected
            ]}
            onPress={() => {
              setFormData(prev => ({ ...prev, genre }));
              if (errors.genre) {
                setErrors(prev => ({ ...prev, genre: undefined }));
              }
            }}
          >
            <ThemedText style={[
              styles.genreText,
              formData.genre === genre && styles.genreTextSelected
            ]}>
              {genre}
            </ThemedText>
          </Pressable>
        ))}
      </View>
      {errors.genre && (
        <ThemedText style={styles.errorText}>{errors.genre}</ThemedText>
      )}
    </Animated.View>
  );

  const renderLanguageSelector = () => (
    <Animated.View entering={FadeInUp.delay(400).duration(600).springify()}>
      <ThemedText style={styles.label}>Idioma</ThemedText>
      <View style={styles.languageGrid}>
        {LANGUAGES.map(language => (
          <Pressable
            key={language}
            style={[
              styles.languageItem,
              formData.language === language && styles.languageItemSelected
            ]}
            onPress={() => setFormData(prev => ({ ...prev, language }))}
          >
            <ThemedText style={[
              styles.languageText,
              formData.language === language && styles.languageTextSelected
            ]}>
              {language}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );

  const renderTagsInput = () => (
    <Animated.View entering={FadeInUp.delay(500).duration(600).springify()}>
      <ThemedText style={styles.label}>Tags *</ThemedText>
      
      {/* Input para adicionar tags */}
      <View style={styles.tagInputContainer}>
        <Input
          placeholder="Digite uma tag..."
          value={tagInput}
          onChangeText={setTagInput}
          onSubmitEditing={addTag}
          style={styles.tagInput}
          returnKeyType="done"
        />
        <Pressable
          style={[
            styles.addTagButton,
            (!tagInput.trim() || formData.tags.length >= 5) && styles.addTagButtonDisabled
          ]}
          onPress={addTag}
          disabled={!tagInput.trim() || formData.tags.length >= 5}
        >
          <ThemedText style={[
            styles.addTagButtonText,
            (!tagInput.trim() || formData.tags.length >= 5) && styles.addTagButtonTextDisabled
          ]}>
            +
          </ThemedText>
        </Pressable>
      </View>
      
      {/* Tags adicionadas */}
      {formData.tags.length > 0 && (
        <View style={styles.tagsList}>
          {formData.tags.map(tag => (
            <View key={tag} style={styles.tagItem}>
              <ThemedText style={styles.tagText}>#{tag}</ThemedText>
              <Pressable
                style={styles.removeTagButton}
                onPress={() => removeTag(tag)}
              >
                <ThemedText style={styles.removeTagText}>×</ThemedText>
              </Pressable>
            </View>
          ))}
        </View>
      )}
      
      {errors.tags && (
        <ThemedText style={styles.errorText}>{errors.tags}</ThemedText>
      )}
      
      <ThemedText style={styles.helperText}>
        {formData.tags.length}/5 tags • Use tags para categorizar seu livro
      </ThemedText>
    </Animated.View>
  );

  const renderSettings = () => (
    <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
      <ThemedText style={styles.sectionTitle}>Configurações</ThemedText>
      
      <View style={styles.settingItem}>
        <View style={styles.settingHeader}>
          <ThemedText style={styles.settingLabel}>Livro público</ThemedText>
          <Pressable
            style={[
              styles.toggleSwitch,
              formData.is_public && styles.toggleSwitchActive
            ]}
            onPress={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
          >
            <View style={[
              styles.toggleThumb,
              formData.is_public && styles.toggleThumbActive
            ]} />
          </Pressable>
        </View>
        <ThemedText style={styles.settingDescription}>
          Outros usuários poderão encontrar e ler seu livro
        </ThemedText>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingHeader}>
          <ThemedText style={styles.settingLabel}>Permitir comentários</ThemedText>
          <Pressable
            style={[
              styles.toggleSwitch,
              formData.allow_comments && styles.toggleSwitchActive
            ]}
            onPress={() => setFormData(prev => ({ ...prev, allow_comments: !prev.allow_comments }))}
          >
            <View style={[
              styles.toggleThumb,
              formData.allow_comments && styles.toggleThumbActive
            ]} />
          </Pressable>
        </View>
        <ThemedText style={styles.settingDescription}>
          Leitores poderão comentar nos capítulos
        </ThemedText>
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingHeader}>
          <ThemedText style={styles.settingLabel}>Permitir avaliações</ThemedText>
          <Pressable
            style={[
              styles.toggleSwitch,
              formData.allow_ratings && styles.toggleSwitchActive
            ]}
            onPress={() => setFormData(prev => ({ ...prev, allow_ratings: !prev.allow_ratings }))}
          >
            <View style={[
              styles.toggleThumb,
              formData.allow_ratings && styles.toggleThumbActive
            ]} />
          </Pressable>
        </View>
        <ThemedText style={styles.settingDescription}>
          Leitores poderão avaliar seu livro
        </ThemedText>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LoadingOverlay visible={loading} message="Criando livro..." />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.content}>
            {/* Header */}
            <Animated.View
              entering={FadeInUp.delay(100).duration(600).springify()}
              style={styles.header}
            >
              <ThemedText style={styles.title}>Criar Novo Livro</ThemedText>
              <ThemedText style={styles.subtitle}>
                Configure as informações básicas do seu livro
              </ThemedText>
            </Animated.View>

            {/* Formulário */}
            <Animated.View
              entering={FadeInUp.delay(200).duration(600).springify()}
              style={styles.formContainer}
            >
              <Input
                label="Título do Livro *"
                placeholder="Digite o título do seu livro"
                value={formData.title}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, title: text }));
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: undefined }));
                  }
                }}
                error={errors.title}
                maxLength={100}
                style={styles.input}
              />

              <Input
                label="Descrição *"
                placeholder="Descreva brevemente o enredo do seu livro"
                value={formData.description}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, description: text }));
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: undefined }));
                  }
                }}
                error={errors.description}
                multiline
                numberOfLines={4}
                maxLength={1000}
                style={styles.input}
              />

              <Input
                label="URL da Capa (opcional)"
                placeholder="https://exemplo.com/capa.jpg"
                value={formData.cover_url}
                onChangeText={(text) => setFormData(prev => ({ ...prev, cover_url: text }))}
                keyboardType="url"
                autoCapitalize="none"
                style={styles.input}
              />
            </Animated.View>

            {/* Gênero */}
            {renderGenreSelector()}

            {/* Idioma */}
            {renderLanguageSelector()}

            {/* Tags */}
            {renderTagsInput()}

            {/* Configurações */}
            {renderSettings()}

            {/* Botões */}
            <Animated.View
              entering={FadeInDown.delay(700).duration(600).springify()}
              style={styles.buttonContainer}
            >
              <Button
                title="Criar Livro"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleCreateBook}
                style={styles.createButton}
              />
              
              <Button
                title="Cancelar"
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => router.back()}
                style={styles.cancelButton}
              />
            </Animated.View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  input: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  // Gênero - Grid layout
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  genreItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  genreItemSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  genreText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  genreTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  
  // Idioma - Grid layout
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  languageItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
  },
  languageItemSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  languageText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  languageTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  
  // Tags - Input melhorado
  tagInputContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tagInput: {
    flex: 1,
  },
  addTagButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagButtonDisabled: {
    backgroundColor: Colors.light.neutral,
  },
  addTagButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  addTagButtonTextDisabled: {
    color: Colors.light.muted,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    gap: Spacing.xs,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  removeTagButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  settingItem: {
    marginBottom: Spacing.lg,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 20,
  },
  
  // Toggle Switch
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.neutral,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  createButton: {
    marginBottom: Spacing.sm,
  },
  cancelButton: {
    marginTop: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
});
