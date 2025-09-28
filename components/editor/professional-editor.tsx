import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { EditorFormatting } from '@/types/book-creation';

interface ProfessionalEditorProps {
  initialContent?: string;
  onContentChange?: (content: string, wordCount: number) => void;
  onSave?: (content: string) => Promise<void>;
  onPublish?: (content: string) => Promise<void>;
  placeholder?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
  maxLength?: number;
  showWordCount?: boolean;
  showFormattingToolbar?: boolean;
  readOnly?: boolean;
}

const FONT_FAMILIES = [
  { name: 'System', value: 'System' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];

const TEXT_COLORS = [
  '#000000', '#333333', '#666666', '#999999',
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080',
];

const BACKGROUND_COLORS = [
  'transparent', '#FFFFFF', '#F5F5F5', '#E8E8E8',
  '#FFFACD', '#F0F8FF', '#F5FFFA', '#FFF0F5',
];

export function ProfessionalEditor({
  initialContent = '',
  onContentChange,
  onSave,
  onPublish,
  placeholder = 'Comece a escrever...',
  autoSave = true,
  autoSaveInterval = 30000, // 30 segundos
  maxLength = 100000,
  showWordCount = true,
  showFormattingToolbar = true,
  readOnly = false,
}: ProfessionalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [formatting, setFormatting] = useState<EditorFormatting>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontSize: 16,
    fontFamily: 'System',
    textAlign: 'left',
    lineHeight: 1.5,
    textColor: '#000000',
    backgroundColor: 'transparent',
  });
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFormattingOptions, setShowFormattingOptions] = useState(false);

  const textInputRef = useRef<TextInput>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Calcular contagem de palavras e caracteres
  const updateCounts = useCallback((text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(text.length);
  }, []);

  // Auto-save
  const performAutoSave = useCallback(async () => {
    if (!autoSave || !onSave || !hasUnsavedChanges || isSaving) return;

    try {
      setIsSaving(true);
      await onSave(content);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [autoSave, onSave, hasUnsavedChanges, isSaving, content]);

  // Configurar auto-save
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(performAutoSave, autoSaveInterval);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [autoSave, hasUnsavedChanges, performAutoSave, autoSaveInterval]);

  // Atualizar contagens quando conteúdo muda
  useEffect(() => {
    updateCounts(content);
  }, [content, updateCounts]);

  // Notificar mudanças
  useEffect(() => {
    if (onContentChange) {
      onContentChange(content, wordCount);
    }
    setHasUnsavedChanges(true);
  }, [content, wordCount, onContentChange]);

  const handleContentChange = (text: string) => {
    if (maxLength && text.length > maxLength) {
      Alert.alert('Limite de caracteres', `O texto não pode exceder ${maxLength} caracteres.`);
      return;
    }
    setContent(text);
  };

  const handleSelectionChange = (event: any) => {
    setSelection({
      start: event.nativeEvent.selection.start,
      end: event.nativeEvent.selection.end,
    });
  };

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setIsSaving(true);
      await onSave(content);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      Alert.alert('Sucesso', 'Rascunho salvo com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar rascunho');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!onPublish) return;

    try {
      setIsSaving(true);
      await onPublish(content);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      Alert.alert('Sucesso', 'Capítulo publicado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao publicar capítulo');
    } finally {
      setIsSaving(false);
    }
  };

  const applyFormatting = (format: Partial<EditorFormatting>) => {
    setFormatting(prev => ({ ...prev, ...format }));
  };

  const renderFormattingToolbar = () => {
    if (!showFormattingToolbar || readOnly) return null;

    return (
      <Animated.View entering={FadeInDown.duration(300)} style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolbarScroll}>
          {/* Formatação básica */}
          <View style={styles.toolbarGroup}>
            <TouchableOpacity
              style={[styles.toolbarButton, formatting.bold && styles.toolbarButtonActive]}
              onPress={() => applyFormatting({ bold: !formatting.bold })}
            >
              <ThemedText style={[styles.toolbarButtonText, formatting.bold && styles.boldText]}>B</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.toolbarButton, formatting.italic && styles.toolbarButtonActive]}
              onPress={() => applyFormatting({ italic: !formatting.italic })}
            >
              <ThemedText style={[styles.toolbarButtonText, formatting.italic && styles.italicText]}>I</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.toolbarButton, formatting.underline && styles.toolbarButtonActive]}
              onPress={() => applyFormatting({ underline: !formatting.underline })}
            >
              <ThemedText style={[styles.toolbarButtonText, formatting.underline && styles.underlineText]}>S</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Alinhamento */}
          <View style={styles.toolbarGroup}>
            <TouchableOpacity
              style={[styles.toolbarButton, formatting.textAlign === 'left' && styles.toolbarButtonActive]}
              onPress={() => applyFormatting({ textAlign: 'left' })}
            >
              <IconSymbol name="text.alignleft" size={16} color={Colors.light.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.toolbarButton, formatting.textAlign === 'center' && styles.toolbarButtonActive]}
              onPress={() => applyFormatting({ textAlign: 'center' })}
            >
              <IconSymbol name="text.aligncenter" size={16} color={Colors.light.text} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.toolbarButton, formatting.textAlign === 'right' && styles.toolbarButtonActive]}
              onPress={() => applyFormatting({ textAlign: 'right' })}
            >
              <IconSymbol name="text.alignright" size={16} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          {/* Mais opções */}
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => setShowFormattingOptions(!showFormattingOptions)}
          >
            <IconSymbol name="textformat" size={16} color={Colors.light.text} />
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  };

  const renderFormattingOptions = () => {
    if (!showFormattingOptions) return null;

    return (
      <Animated.View entering={FadeInUp.duration(300)} style={styles.formattingOptions}>
        {/* Tamanho da fonte */}
        <View style={styles.formattingSection}>
          <ThemedText style={styles.formattingLabel}>Tamanho da fonte:</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontSizeScroll}>
            {FONT_SIZES.map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.fontSizeButton, formatting.fontSize === size && styles.fontSizeButtonActive]}
                onPress={() => applyFormatting({ fontSize: size })}
              >
                <ThemedText style={styles.fontSizeText}>{size}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Família da fonte */}
        <View style={styles.formattingSection}>
          <ThemedText style={styles.formattingLabel}>Fonte:</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fontFamilyScroll}>
            {FONT_FAMILIES.map(font => (
              <TouchableOpacity
                key={font.value}
                style={[styles.fontFamilyButton, formatting.fontFamily === font.value && styles.fontFamilyButtonActive]}
                onPress={() => applyFormatting({ fontFamily: font.value })}
              >
                <ThemedText style={styles.fontFamilyText}>{font.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Cores do texto */}
        <View style={styles.formattingSection}>
          <ThemedText style={styles.formattingLabel}>Cor do texto:</ThemedText>
          <View style={styles.colorGrid}>
            {TEXT_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  formatting.textColor === color && styles.colorButtonActive
                ]}
                onPress={() => applyFormatting({ textColor: color })}
              />
            ))}
          </View>
        </View>

        {/* Cores de fundo */}
        <View style={styles.formattingSection}>
          <ThemedText style={styles.formattingLabel}>Fundo:</ThemedText>
          <View style={styles.colorGrid}>
            {BACKGROUND_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color === 'transparent' ? '#E0E0E0' : color },
                  formatting.backgroundColor === color && styles.colorButtonActive
                ]}
                onPress={() => applyFormatting({ backgroundColor: color })}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderStatusBar = () => {
    if (!showWordCount && !hasUnsavedChanges && !isSaving) return null;

    return (
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          {showWordCount && (
            <ThemedText style={styles.statusText}>
              {wordCount} palavras • {characterCount} caracteres
            </ThemedText>
          )}
        </View>
        
        <View style={styles.statusRight}>
          {isSaving && (
            <ThemedText style={styles.statusText}>Salvando...</ThemedText>
          )}
          {hasUnsavedChanges && !isSaving && (
            <ThemedText style={styles.unsavedText}>Não salvo</ThemedText>
          )}
          {lastSaved && !hasUnsavedChanges && (
            <ThemedText style={styles.savedText}>
              Salvo às {lastSaved.toLocaleTimeString()}
            </ThemedText>
          )}
        </View>
      </View>
    );
  };

  const renderActionButtons = () => {
    if (readOnly) return null;

    return (
      <View style={styles.actionButtons}>
        {onSave && (
          <Button
            title="Salvar Rascunho"
            variant="outline"
            size="md"
            onPress={handleSave}
            loading={isSaving}
            style={styles.actionButton}
          />
        )}
        
        {onPublish && (
          <Button
            title="Publicar"
            variant="primary"
            size="md"
            onPress={handlePublish}
            loading={isSaving}
            style={styles.actionButton}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderFormattingToolbar()}
        {renderFormattingOptions()}
        
        <View style={styles.editorContainer}>
          <TextInput
            ref={textInputRef}
            style={[
              styles.textInput,
              {
                fontSize: formatting.fontSize,
                fontFamily: formatting.fontFamily,
                textAlign: formatting.textAlign,
                lineHeight: formatting.fontSize * formatting.lineHeight,
                color: formatting.textColor,
                backgroundColor: formatting.backgroundColor,
                fontWeight: formatting.bold ? 'bold' : 'normal',
                fontStyle: formatting.italic ? 'italic' : 'normal',
                textDecorationLine: formatting.underline ? 'underline' : 'none',
              }
            ]}
            value={content}
            onChangeText={handleContentChange}
            onSelectionChange={handleSelectionChange}
            placeholder={placeholder}
            placeholderTextColor={Colors.light.placeholder}
            multiline
            textAlignVertical="top"
            editable={!readOnly}
            maxLength={maxLength}
          />
        </View>
        
        {renderStatusBar()}
        {renderActionButtons()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: Spacing.sm,
  },
  toolbarScroll: {
    flexGrow: 0,
  },
  toolbarGroup: {
    flexDirection: 'row',
    marginRight: Spacing.md,
  },
  toolbarButton: {
    padding: Spacing.sm,
    marginHorizontal: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'transparent',
  },
  toolbarButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  toolbarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  formattingOptions: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    padding: Spacing.md,
  },
  formattingSection: {
    marginBottom: Spacing.md,
  },
  formattingLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: Colors.light.text,
  },
  fontSizeScroll: {
    flexGrow: 0,
  },
  fontSizeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.neutral,
  },
  fontSizeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  fontSizeText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  fontFamilyScroll: {
    flexGrow: 0,
  },
  fontFamilyButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.neutral,
  },
  fontFamilyButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  fontFamilyText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  colorButtonActive: {
    borderColor: Colors.light.primary,
    borderWidth: 3,
  },
  editorContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  statusLeft: {
    flex: 1,
  },
  statusRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  unsavedText: {
    fontSize: 12,
    color: Colors.light.warning,
    fontWeight: '600',
  },
  savedText: {
    fontSize: 12,
    color: Colors.light.success,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  actionButton: {
    flex: 1,
  },
});
