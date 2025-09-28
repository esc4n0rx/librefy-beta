// components/books/rating-stars.tsx
import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { IconSymbol } from '../ui/icon-symbol';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  showNumber?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  showNumber = true,
  onRatingChange,
}: RatingStarsProps) {
  const handleStarPress = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStar = (index: number) => {
    const starRating = index + 1;
    const isFilled = starRating <= rating;
    const isHalfFilled = starRating - 0.5 <= rating && starRating > rating;

    const StarComponent = interactive ? Pressable : View;

    return (
      <StarComponent
        key={index}
        style={[styles.star, interactive && styles.interactiveStar]}
        onPress={interactive ? () => handleStarPress(starRating) : undefined}
      >
        <IconSymbol
          name={isFilled ? 'star.fill' : 'star'}
          size={size}
          color={isFilled || isHalfFilled ? Colors.light.warning : Colors.light.border}
        />
      </StarComponent>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      </View>
      {showNumber && (
        <ThemedText style={[styles.ratingText, { fontSize: size * 0.7 }]}>
          {rating.toFixed(1)}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    padding: 2,
  },
  interactiveStar: {
    borderRadius: 4,
  },
  ratingText: {
    fontWeight: '600',
    marginLeft: 4,
  },
});