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

  // Navigation and Discovery icons
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

  // Library and Reading Status icons
  'checkmark.circle': 'check-circle-outline',
  'checkmark.circle.fill': 'check-circle',
  'checkmark': 'check',
  'checkmark.fill': 'check',
  
  // Download and Offline icons
  'arrow.down': 'arrow-downward',
  'arrow.down.circle': 'get-app',
  'arrow.down.circle.fill': 'get-app',
  'arrow.up': 'arrow-upward',
  'arrow.up.circle': 'publish',
  'arrow.up.circle.fill': 'publish',
  'cloud.fill': 'cloud',
  'cloud': 'cloud-queue',
  'wifi.slash': 'wifi-off',
  'wifi': 'wifi',
  
  // Status and Alert icons
  'exclamationmark.triangle': 'warning',
  'exclamationmark.triangle.fill': 'warning',
  'exclamationmark.circle': 'error-outline',
  'exclamationmark.circle.fill': 'error',
  'clock': 'schedule',
  'clock.fill': 'schedule',
  
  // Progress and Loading icons
  'progress.indicator': 'hourglass-empty',
  'hourglass': 'hourglass-empty',
  'hourglass.fill': 'hourglass-full',
  
  // Actions icons
  'trash': 'delete-outline',
  'trash.fill': 'delete',
  'pencil': 'edit',
  'pencil.circle': 'edit',
  'pencil.circle.fill': 'edit',
  'share': 'share',
  'share.fill': 'share',
  'refresh': 'refresh',
  'refresh.circle': 'refresh',
  'refresh.circle.fill': 'refresh',
  
  // Media and Content icons
  'play': 'play-arrow',
  'play.fill': 'play-arrow',
  'play.circle': 'play-circle-outline',
  'play.circle.fill': 'play-circle',
  'pause': 'pause',
  'pause.fill': 'pause',
  'pause.circle': 'pause-circle-outline',
  'pause.circle.fill': 'pause-circle',
  'stop': 'stop',
  'stop.fill': 'stop',
  'stop.circle': 'stop-circle',
  'stop.circle.fill': 'stop-circle',
  
  // Filter and Sort icons
  'line.3.horizontal.decrease': 'sort',
  'arrow.up.arrow.down': 'import-export',
  'funnel': 'filter-list',
  'funnel.fill': 'filter-list',
  
  // Miscellaneous icons
  'ellipsis': 'more-horiz',
  'ellipsis.circle': 'more-horiz',
  'ellipsis.circle.fill': 'more-horiz',
  'plus.circle.dashed': 'add-circle-outline',
  'minus': 'remove',
  'minus.circle': 'remove-circle-outline',
  'minus.circle.fill': 'remove-circle',
  'xmark': 'close',
  'xmark.circle': 'cancel',
  'xmark.circle.fill': 'cancel',
  
  // Text and Document icons
  'text.alignleft': 'format-align-left',
  'text.aligncenter': 'format-align-center',
  'text.alignright': 'format-align-right',
  'textformat': 'format-color-text',
  'textformat.size': 'format-size',
  'doc': 'description',
  'doc.fill': 'description',
  'doc.text': 'article',
  'doc.text.fill': 'article',
  
  // Navigation arrows
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow-upward': 'arrow-upward',
  'arrow-downward': 'arrow-downward',
  'chevron.up': 'keyboard-arrow-up',
  'chevron.down': 'keyboard-arrow-down',
  'chevron.left': 'keyboard-arrow-left',
  'chevron-right': 'keyboard-arrow-right',
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