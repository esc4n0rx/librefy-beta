import { Colors, Shadows, Spacing } from '@/constants/theme';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  style?: ViewStyle;
}

export function FloatingActionButton({ 
  onPress, 
  icon = 'plus',
  size = 56,
  style 
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Colors.light.primary,
        },
        Shadows.lg,
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <IconSymbol 
        name={icon as any} 
        size={24} 
        color="white" 
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});