// components/ui/icon-symbol.tsx
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

  // NEW ICONS - Adicionados para as novas funcionalidades

  // Comments and messaging
  'text.bubble': 'chat-bubble-outline',
  'text.bubble.fill': 'chat-bubble',
  'message': 'message',
  'message.fill': 'message',
  'quote.bubble': 'format-quote',
  'quote.bubble.fill': 'format-quote',

  // Rating and feedback
  'hand.thumbsup': 'thumb-up',
  'hand.thumbsup.fill': 'thumb-up',
  'hand.thumbsdown': 'thumb-down',
  'hand.thumbsdown.fill': 'thumb-down',
  'flag': 'flag',
  'flag.fill': 'flag',

  // Reading and book specific
  'text.book.closed': 'book',
  'text.book.closed.fill': 'book',
  'newspaper': 'newspaper',
  'newspaper.fill': 'newspaper',
  'character.book.closed': 'auto-stories',
  'character.book.closed.fill': 'auto-stories',
  'bookmark.circle': 'bookmark-added',
  'bookmark.circle.fill': 'bookmark-added',

  // User interaction
  'person.crop.circle': 'account-circle',
  'person.crop.circle.fill': 'account-circle',
  'person.2': 'people',
  'person.2.fill': 'people',
  'person.3': 'groups',
  'person.3.fill': 'groups',

  // Time and dates
  'calendar.circle': 'event-available',
  'calendar.circle.fill': 'event-available',
  'clock.circle': 'schedule',
  'clock.circle.fill': 'schedule',

  // Content creation
  'square.and.pencil': 'create',
  'rectangle.and.pencil.and.ellipsis': 'rate-review',
  'text.badge.plus': 'add-comment',
  'text.badge.minus': 'remove-comment',

  // Social features
  'bubble.left': 'comment',
  'bubble.left.fill': 'comment',
  'bubble.right': 'comment',
  'bubble.right.fill': 'comment',
  'quote.closing': 'format-quote',
  'quote.opening': 'format-quote',

  // Categories and tags
  'tag': 'local-offer',
  'tag.fill': 'local-offer',
  'tags': 'local-offer',
  'tags.fill': 'local-offer',
  'folder': 'folder',
  'folder.fill': 'folder',
  'folder.badge.plus': 'create-new-folder',

  // Statistics and analytics
  'chart.bar': 'bar-chart',
  'chart.bar.fill': 'bar-chart',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'chart.pie': 'pie-chart',
  'chart.pie.fill': 'pie-chart',

  // Library management
  'tray': 'inbox',
  'tray.fill': 'inbox',
  'tray.and.arrow.down': 'move-to-inbox',
  'tray.and.arrow.up': 'outbox',
  'archivebox': 'archive',
  'archivebox.fill': 'archive',

  // Search and discovery
  'scope': 'search',
  'safari': 'explore',
  'safari.fill': 'explore',
  'binoculars': 'search',
  'binoculars.fill': 'search',

  // Settings and preferences
  'slider.horizontal.below.rectangle': 'tune',
  'slider.horizontal.2.rectangle': 'equalizer',
  'switch.2': 'compare',
  'rectangles.on.rectangle': 'dashboard',

  // Notifications
  'bell.badge': 'notifications-active',
  'bell.badge.fill': 'notifications-active',
  'bell.slash': 'notifications-off',
  'bell.slash.fill': 'notifications-off',

  // Device and system
  'iphone': 'phone-android',
  'ipad': 'tablet-android',
  'desktopcomputer': 'desktop-mac',
  'laptopcomputer': 'laptop-mac',

  // Network and connectivity
  'network': 'network-check',
  'antenna.radiowaves.left.and.right': 'wifi',
  'personalhotspot': 'wifi-tethering',

  // Security and privacy
  'lock.shield': 'security',
  'lock.shield.fill': 'security',
  'key.horizontal': 'vpn-key',
  'key.horizontal.fill': 'vpn-key',

  // Download and sync
  'icloud.and.arrow.down': 'cloud-download',
  'icloud.and.arrow.up': 'cloud-upload',
  'arrow.triangle.2.circlepath': 'sync',
  'arrow.clockwise': 'refresh',
  'arrow.counterclockwise': 'refresh',

  // Quality and verification
  'rosette': 'verified',
  'checkmark.seal': 'verified',
  'checkmark.seal.fill': 'verified',
  'star.leadinghalf.filled': 'star-half',

  // Content type indicators
  'textformat.abc': 'text-fields',
  'textformat.123': 'title',
  'textformat.alt': 'format-color-text',
  'bold': 'format-bold',
  'italic': 'format-italic',
  'underline': 'format-underlined',

  // File and document types
  'doc.plaintext': 'description',
  'doc.plaintext.fill': 'description',
  'doc.richtext': 'article',
  'doc.richtext.fill': 'article',
  'note.text': 'note',
  'note.text.badge.plus': 'note-add',

  // Organization
  'rectangle.stack': 'layers',
  'rectangle.stack.fill': 'layers',
  'square.stack': 'stack',
  'square.stack.fill': 'stack',
  'list.dash': 'format-list-bulleted',
  'list.number': 'format-list-numbered',

  // Special states
  'exclamationmark.2': 'priority-high',
  'questionmark': 'help-outline',
  'questionmark.circle': 'help-outline',
  'questionmark.circle.fill': 'help',
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