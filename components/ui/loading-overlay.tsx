import { Colors, Spacing } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    useColorScheme,
    View
} from 'react-native';
import { ThemedText } from '../themed-text';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <BlurView intensity={10} style={StyleSheet.absoluteFillObject} />
        <View style={[
          styles.content,
          { backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface }
        ]}>
          <ActivityIndicator 
            size="large" 
            color={isDark ? Colors.dark.primary : Colors.light.primary} 
          />
          {message && (
            <ThemedText style={styles.message}>{message}</ThemedText>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },
});