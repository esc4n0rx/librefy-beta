/**
 * Librefy Design System - Cores e Tipografia
 * Identidade visual focada em criatividade, leveza e leitura digital
 */

import { Platform } from 'react-native';

// Paleta de cores Librefy
const primaryPurple = '#6C63FF';
const lightBlue = '#4FC3F7';
const lightGray = '#F5F5F5';
const orange = '#FF7043';
const white = '#FFFFFF';

// Cores para modo escuro
const darkBackground = '#151718';
const darkSurface = '#1E1E1E';
const darkText = '#ECEDEE';

const tintColorLight = primaryPurple;
const tintColorDark = lightBlue;

export const Colors = {
  light: {
    text: '#11181C',
    background: white,
    surface: white,
    primary: primaryPurple,
    secondary: lightBlue,
    accent: orange,
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#E1E1E1',
    placeholder: '#9BA1A6',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    neutral: lightGray,
    muted: '#6B7280',
  },
  dark: {
    text: darkText,
    background: darkBackground,
    surface: darkSurface,
    primary: primaryPurple,
    secondary: lightBlue,
    accent: orange,
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#2A2A2A',
    placeholder: '#6B7280',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    neutral: '#374151',
    muted: '#9CA3AF',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Espaçamentos padronizados
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Raios de borda
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Sombras
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};