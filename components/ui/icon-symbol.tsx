// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = keyof typeof MAPPING;
type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Existing icons
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  
  // Auth & User icons
  'person': 'person',
  'person.fill': 'person',
  'at': 'alternate-email',
  'envelope': 'email',
  'envelope.fill': 'email',
  'lock': 'lock',
  'lock.fill': 'lock',
  'key': 'vpn-key',
  'key.fill': 'vpn-key',
  'calendar': 'event',
  'eye': 'visibility',
  'eye.fill': 'visibility',
  'eye.slash': 'visibility-off',
  'eye.slash.fill': 'visibility-off',

  // New icons for the app
  'magnifyingglass': 'search',
  'compass': 'explore',
  'compass.fill': 'explore',
  'books.vertical': 'library-books',
  'books.vertical.fill': 'library-books',
  'book': 'menu-book',
  'book.fill': 'menu-book',
  'plus': 'add',
  'plus.circle': 'add-circle',
  'plus.circle.fill': 'add-circle',
  'star': 'star-border',
  'star.fill': 'star',
  'heart': 'favorite-border',
  'heart.fill': 'favorite',
  'bookmark': 'bookmark-border',
  'bookmark.fill': 'bookmark',
  'gearshape': 'settings',
  'gearshape.fill': 'settings',
  'bell': 'notifications-none',
  'bell.fill': 'notifications',
  'list.bullet': 'list',
  'square.grid.2x2': 'grid-view',
  'slider.horizontal.3': 'tune',
  'arrow.up.right': 'launch',
  'info.circle': 'info-outline',
  'info.circle.fill': 'info',
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] as MaterialIconName} style={style} />;
}