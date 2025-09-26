import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Book } from '@/types/book';
import { Image } from 'expo-image';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact' | 'large';
  onPress?: (book: Book) => void;
  style?: ViewStyle;
}

export function BookCard({ book, variant = 'default', onPress, style }: BookCardProps) {
  const scale = useSharedValue(1);
  const backgroundColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const renderProgress = () => {
    if (!book.progress || book.status === 'want_to_read') return null;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${book.progress}%`,
                backgroundColor: Colors.light.primary,
              }
            ]} 
          />
        </View>
        <ThemedText style={styles.progressText}>
          {book.progress}%
        </ThemedText>
      </View>
    );
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <IconSymbol 
        name="star.fill" 
        size={14} 
        color={Colors.light.warning} 
      />
      <ThemedText style={styles.ratingText}>
        {book.rating.toFixed(1)}
      </ThemedText>
    </View>
  );

  const renderStatusBadge = () => {
    const statusConfig = {
      reading: { text: 'Lendo', color: Colors.light.primary },
      completed: { text: 'Concluído', color: Colors.light.success },
      want_to_read: { text: 'Quero ler', color: Colors.light.secondary },
    };

    const config = statusConfig[book.status];

    return (
      <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
        <ThemedText style={styles.statusText}>
          {config.text}
        </ThemedText>
      </View>
    );
  };

  if (variant === 'compact') {
    return (
      <AnimatedPressable
        style={[
          animatedStyle,
          styles.compactCard,
          {
            backgroundColor,
            borderColor,
          },
          style,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress?.(book)}
      >
        <Image
          source={{ uri: book.cover_url }}
          style={styles.compactCover}
          contentFit="cover"
          placeholder="📚"
        />
        <View style={styles.compactInfo}>
          <ThemedText 
            style={[styles.compactTitle, { color: textColor }]}
            numberOfLines={2}
          >
            {book.title}
          </ThemedText>
          <ThemedText 
            style={[styles.compactAuthor, { opacity: 0.7 }]}
            numberOfLines={1}
          >
            {book.author}
          </ThemedText>
          {renderProgress()}
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
        Shadows.sm,
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress?.(book)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.cover_url }}
          style={styles.cover}
          contentFit="cover"
          placeholder="📚"
        />
        {renderStatusBadge()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText 
            style={[styles.title, { color: textColor }]}
            numberOfLines={2}
          >
            {book.title}
          </ThemedText>
          {renderRating()}
        </View>
        
        <ThemedText 
          style={[styles.author, { opacity: 0.7 }]}
          numberOfLines={1}
        >
          {book.author}
        </ThemedText>
        
        <ThemedText 
          style={[styles.description, { opacity: 0.6 }]}
          numberOfLines={2}
        >
          {book.description}
        </ThemedText>
        
        <View style={styles.genreContainer}>
          {book.genre.slice(0, 2).map((genre, index) => (
            <View 
              key={index} 
              style={[
                styles.genreBadge,
                { backgroundColor: `${Colors.light.primary}15` }
              ]}
            >
              <ThemedText 
                style={[
                  styles.genreText, 
                  { color: Colors.light.primary }
                ]}
              >
                {genre}
              </ThemedText>
            </View>
          ))}
        </View>
        
        {renderProgress()}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  compactCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.light.neutral,
  },
  compactCover: {
    width: 60,
    height: 80,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.light.neutral,
    marginRight: Spacing.sm,
  },
  compactInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  compactAuthor: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    flex: 1,
    marginRight: Spacing.sm,
  },
  author: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  genreContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  genreBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  genreText: {
    fontSize: 10,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
});