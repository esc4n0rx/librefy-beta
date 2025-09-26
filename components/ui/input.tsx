import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { forwardRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const focusAnimation = useSharedValue(0);
    
    const backgroundColor = useThemeColor({}, 'surface');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');
    const placeholderColor = useThemeColor({}, 'placeholder');
    const primaryColor = Colors.light.primary;
    const errorColor = Colors.light.error;

    const animatedBorderStyle = useAnimatedStyle(() => {
      return {
        borderColor: withTiming(
          error
            ? errorColor
            : focusAnimation.value === 1
            ? primaryColor
            : borderColor,
          { duration: 200 }
        ),
        borderWidth: withTiming(focusAnimation.value === 1 ? 2 : 1, {
          duration: 200,
        }),
      };
    });

    const handleFocus = (e: any) => {
      setIsFocused(true);
      focusAnimation.value = withTiming(1, { duration: 200 });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      focusAnimation.value = withTiming(0, { duration: 200 });
      onBlur?.(e);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <ThemedText style={[styles.label, { color: textColor }]}>
            {label}
          </ThemedText>
        )}
        
        <Animated.View
          style={[
            styles.inputContainer,
            {
              backgroundColor,
            },
            animatedBorderStyle,
          ]}
        >
          {leftIcon && (
            <IconSymbol
              name={leftIcon as any}
              size={20}
              color={isFocused ? primaryColor : placeholderColor}
              style={styles.leftIcon}
            />
          )}
          
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: textColor,
                flex: 1,
              },
              style,
            ]}
            placeholderTextColor={placeholderColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {rightIcon && (
            <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
              <IconSymbol
                name={rightIcon as any}
                size={20}
                color={isFocused ? primaryColor : placeholderColor}
              />
            </Pressable>
          )}
        </Animated.View>

        {(error || helperText) && (
          <ThemedText
            style={[
              styles.helperText,
              {
                color: error ? errorColor : placeholderColor,
              },
            ]}
          >
            {error || helperText}
          </ThemedText>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    minHeight: 52,
    paddingHorizontal: Spacing.md,
  },
  input: {
    fontSize: 16,
    paddingVertical: Spacing.md,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 2,
  },
});