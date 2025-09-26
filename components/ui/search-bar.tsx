import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    ViewStyle
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: ViewStyle;
}

export function SearchBar({
  placeholder = 'Pesquisar livros...',
  value,
  onChangeText,
  onFocus,
  onBlur,
  style,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useSharedValue(0);
  
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'placeholder');
  const primaryColor = Colors.light.primary;

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        focusAnimation.value === 1 ? primaryColor : borderColor,
        { duration: 200 }
      ),
      borderWidth: withTiming(focusAnimation.value === 1 ? 2 : 1, {
        duration: 200,
      }),
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: 200 });
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnimation.value = withTiming(0, { duration: 200 });
    onBlur?.();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
        },
        animatedBorderStyle,
        style,
      ]}
    >
      <IconSymbol
        name="magnifyingglass"
        size={20}
        color={isFocused ? primaryColor : placeholderColor}
        style={styles.icon}
      />
      
      <TextInput
        style={[
          styles.input,
          { color: textColor },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
});