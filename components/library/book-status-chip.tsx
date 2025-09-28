import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { IconSymbol } from '../ui/icon-symbol';

interface BookStatusChipProps {
  status: 'reading' | 'completed' | 'want_to_read';
  size?: 'sm' | 'md';
}

export function BookStatusChip({ status, size = 'md' }: BookStatusChipProps) {
  const config = {
    reading: {
      label: 'Lendo',
      color: Colors.light.primary,
      icon: 'book.fill' as const,
    },
    completed: {
      label: 'Concluído',
      color: Colors.light.success,
      icon: 'checkmark.circle.fill' as const,
    },
    want_to_read: {
      label: 'Quero ler',
      color: Colors.light.secondary,
      icon: 'bookmark.fill' as const,
    },
  };

  const { label, color, icon } = config[status];
  const isSmall = size === 'sm';

  return (
    <View style={[
      styles.chip,
      { backgroundColor: `${color}15` },
      isSmall && styles.chipSmall,
    ]}>
      <IconSymbol
        name={icon}
        size={isSmall ? 12 : 14}
        color={color}
      />
      <ThemedText style={[
        styles.label,
        { color },
        isSmall && styles.labelSmall,
      ]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  chipSmall: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 10,
  },
});