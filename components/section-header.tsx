import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { Button } from './ui/button';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  actionTitle, 
  onActionPress 
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      
      {actionTitle && onActionPress && (
        <Button
          title={actionTitle}
          variant="ghost"
          size="sm"
          onPress={onActionPress}
          textStyle={styles.actionText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});