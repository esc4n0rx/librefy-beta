import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { ThemedText } from '../themed-text';
import { IconSymbol } from '../ui/icon-symbol';

interface DownloadProgressProps {
  progress: number; // 0-100
  size?: 'sm' | 'md';
}

export function DownloadProgress({ progress, size = 'md' }: DownloadProgressProps) {
  const progressWidth = useSharedValue(0);
  const isSmall = size === 'sm';

  React.useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 300 });
  }, [progress]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <View style={styles.header}>
        <IconSymbol
          name="arrow.down.circle"
          size={isSmall ? 14 : 16}
          color={Colors.light.primary}
        />
        <ThemedText style={[styles.label, isSmall && styles.labelSmall]}>
          Baixando... {Math.round(progress)}%
        </ThemedText>
      </View>
      
      <View style={[styles.progressBar, isSmall && styles.progressBarSmall]}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: Colors.light.primary },
            animatedProgressStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  containerSmall: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.primary,
  },
  labelSmall: {
    fontSize: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressBarSmall: {
    height: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
});