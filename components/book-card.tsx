// components/book-card.tsx (atualização para incluir as novas funcionalidades)
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { APIBook } from '@/types/books-api';
import { Image } from 'expo-image';
import React, { useState } from 'react';
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
import { BookDetailsModal } from './books/book-details-modal';
import { RatingStars } from './books/rating-stars';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BookCardProps {
  book: APIBook;
  variant?: 'default' | 'compact' | 'large';
  onPress?: (book: APIBook) => void;
  style?: ViewStyle;
}

export function BookCard({ book, variant = 'default', onPress, style }: BookCardProps) {
  const scale = useSharedValue(1);
  const backgroundColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const [showModal, setShowModal] = useState(false);
  
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

  const handlePress = () => {
    if (onPress) {
      onPress(book);
    } else {
      setShowModal(true);
    }
  };

  const renderRating = () => {
    if (!book.average_rating) return null;
    
    return (
      <RatingStars
        rating={book.average_rating}
        showNumber
        size={14}
      />
    );
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <IconSymbol name="eye" size={12} color={Colors.light.placeholder} />
        <ThemedText style={styles.statText}>
          {book.reads_count}
        </ThemedText>
      </View>
      <View style={styles.statItem}>
        <IconSymbol name="heart" size={12} color={Colors.light.placeholder} />
        <ThemedText style={styles.statText}>
          {book.likes_count}
        </ThemedText>
      </View>
      // components/book-card.tsx (continuação)
      {book.comments_count !== undefined && (
        <View style={styles.statItem}>
          <IconSymbol name="text.bubble" size={12} color={Colors.light.placeholder} />
          <ThemedText style={styles.statText}>
            {book.comments_count}
          </ThemedText>
        </View>
      )}
    </View>
  );

  if (variant === 'compact') {
    return (
      <>
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
          onPress={handlePress}
        >
          <Image
            source={{ uri: book.cover_url || 'https://via.placeholder.com/60x80' }}
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
              {book.users.name}
            </ThemedText>
            {renderRating()}
            {renderStats()}
          </View>
        </AnimatedPressable>

        <BookDetailsModal
          book={book}
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      </>
    );
  }

  return (
    <>
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
        onPress={handlePress}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: book.cover_url || 'https://via.placeholder.com/200x300' }}
            style={styles.cover}
            contentFit="cover"
            placeholder="📚"
          />
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
            {book.users.name}
          </ThemedText>
          
          <ThemedText 
            style={[styles.description, { opacity: 0.6 }]}
            numberOfLines={2}
          >
            {book.description}
          </ThemedText>
          
          <View style={styles.tagsContainer}>
            {book.tags.slice(0, 2).map((tag, index) => (
              <View 
                key={index} 
                style={[
                  styles.tagBadge,
                  { backgroundColor: `${Colors.light.primary}15` }
                ]}
              >
                <ThemedText 
                  style={[
                    styles.tagText, 
                    { color: Colors.light.primary }
                  ]}
                >
                  {tag}
                </ThemedText>
              </View>
            ))}
          </View>
          
          {renderStats()}
        </View>
      </AnimatedPressable>

      <BookDetailsModal
        book={book}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
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
    gap: Spacing.xs,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  compactAuthor: {
    fontSize: 12,
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
  tagsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tagBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    opacity: 0.6,
    fontWeight: '500',
  },
});