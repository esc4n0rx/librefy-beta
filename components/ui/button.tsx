import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { ThemedText } from '../themed-text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);
  const colorScheme = useThemeColor({}, 'background');
  
  const colors = {
    primary: {
      background: Colors.light.primary,
      text: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      background: Colors.light.secondary,
      text: '#FFFFFF',
      border: 'transparent',
    },
    outline: {
      background: 'transparent',
      text: Colors.light.primary,
      border: Colors.light.primary,
    },
    ghost: {
      background: 'transparent',
      text: Colors.light.primary,
      border: 'transparent',
    },
  };

  const sizes = {
    sm: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      fontSize: 14,
    },
    md: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: 16,
    },
    lg: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.lg - 4,
      fontSize: 18,
    },
  };

  const buttonColors = colors[variant];
  const buttonSizes = sizes[size];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = (event: any) => {
    scale.value = withSpring(0.95, { damping: 15 });
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    scale.value = withSpring(1, { damping: 15 });
    onPressOut?.(event);
  };

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        animatedStyle,
        styles.button,
        {
          backgroundColor: buttonColors.background,
          borderColor: buttonColors.border,
          borderWidth: variant === 'outline' ? 2 : 0,
          paddingHorizontal: buttonSizes.paddingHorizontal,
          paddingVertical: buttonSizes.paddingVertical,
          width: fullWidth ? '100%' : 'auto',
          opacity: isDisabled ? 0.6 : 1,
        },
        variant === 'primary' && Shadows.sm,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={buttonColors.text}
        />
      ) : (
        <ThemedText
          style={[
            styles.text,
            {
              color: buttonColors.text,
              fontSize: buttonSizes.fontSize,
              fontWeight: '600',
            },
            textStyle,
          ]}
        >
          {title}
        </ThemedText>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    textAlign: 'center',
  },
});