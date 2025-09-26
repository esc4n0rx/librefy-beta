import { Fonts, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  style?: ViewStyle;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export function Logo({ size = 'md', showText = true, style }: LogoProps) {
  const logoSize = sizeMap[size];
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={[
          styles.logo,
          {
            width: logoSize,
            height: logoSize,
          },
        ]}
        contentFit="contain"
      />
      {showText && (
        <ThemedText
          style={[
            styles.text,
            {
              fontSize: size === 'sm' ? 18 : size === 'lg' ? 28 : size === 'xl' ? 32 : 24,
              color: textColor,
              fontFamily: Fonts.rounded,
            },
          ]}
        >
          Librefy
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  logo: {
    borderRadius: 8,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});