import React, { useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { mockLibraryBooks } from '@/data/mock-books';
import { useAuth } from '@/hooks/use-auth';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ProfileOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
  type?: 'normal' | 'danger';
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const profileOptions: ProfileOption[] = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      subtitle: 'Altere seus dados pessoais',
      icon: 'person',
      action: () => console.log('Editar perfil'),
    },
    {
      id: 'reading-stats',
      title: 'Estatísticas de Leitura',
      subtitle: 'Veja seu progresso e metas',
      icon: 'list.bullet',
      action: () => console.log('Estatísticas'),
    },
    {
      id: 'notifications',
      title: 'Notificações',
      subtitle: 'Configure alertas e lembretes',
      icon: 'bell',
      action: () => console.log('Notificações'),
    },
    {
      id: 'privacy',
      title: 'Privacidade',
      subtitle: 'Gerencie suas configurações de privacidade',
      icon: 'lock',
      action: () => console.log('Privacidade'),
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      subtitle: 'FAQ, contato e tutoriais',
      icon: 'info.circle',
      action: () => console.log('Ajuda'),
    },
    {
      id: 'about',
      title: 'Sobre o Librefy',
      subtitle: 'Versão, termos e políticas',
      icon: 'info.circle',
      action: () => console.log('Sobre'),
    },
    {
      id: 'logout',
      title: 'Sair da Conta',
      subtitle: 'Desconectar desta conta',
      icon: 'arrow.up.right',
      action: handleLogout,
      type: 'danger',
    },
  ];

  const getReadingStats = () => {
    const totalBooks = mockLibraryBooks.length;
    const readingBooks = mockLibraryBooks.filter(book => book.status === 'reading').length;
    const completedBooks = mockLibraryBooks.filter(book => book.status === 'completed').length;
    const averageProgress = mockLibraryBooks.reduce((acc, book) => acc + (book.progress || 0), 0) / totalBooks || 0;

    return {
      totalBooks,
      readingBooks,
      completedBooks,
      averageProgress: Math.round(averageProgress),
    };
  };

  const stats = getReadingStats();

  const renderProfileOption = (option: ProfileOption, index: number) => (
    <Animated.View
      key={option.id}
      entering={FadeInUp.delay((index + 4) * 50).duration(600).springify()}
    >
      <Button
        title=""
        variant="ghost"
        onPress={option.action}
        style={option.type === 'danger' 
          ? StyleSheet.flatten([styles.optionButton, styles.dangerOption])
          : styles.optionButton
        }
      >
        <View style={styles.optionContent}>
          <View style={styles.optionLeft}>
            <View style={[
              styles.optionIcon,
              { backgroundColor: option.type === 'danger' ? `${Colors.light.error}15` : `${Colors.light.primary}15` }
            ]}>
              <IconSymbol
                name={option.icon as any}
                size={20}
                color={option.type === 'danger' ? Colors.light.error : Colors.light.primary}
              />
            </View>
            <View style={styles.optionTexts}>
              <ThemedText style={[
                styles.optionTitle,
                option.type === 'danger' && { color: Colors.light.error }
              ]}>
                {option.title}
              </ThemedText>
              {option.subtitle && (
                <ThemedText style={styles.optionSubtitle}>
                  {option.subtitle}
                </ThemedText>
              )}
            </View>
          </View>
          <IconSymbol
            name="chevron.right"
            size={16}
            color={Colors.light.placeholder}
          />
        </View>
      </Button>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>
          {/* Header do Perfil */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(600).springify()}
            style={styles.profileHeader}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Logo size="md" showText={false} />
              </View>
            </View>
            
            <ThemedText style={styles.userName}>
              {user?.name}
            </ThemedText>
            
            <ThemedText style={styles.userHandle}>
              @{user?.username}
            </ThemedText>
            
            <ThemedText style={styles.userEmail}>
              {user?.email}
            </ThemedText>

            <Button
              title="Editar Perfil"
              variant="outline"
              size="sm"
              onPress={() => console.log('Editar perfil')}
              style={styles.editButton}
            />
          </Animated.View>

          {/* Estatísticas de Leitura */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            style={styles.statsSection}
          >
            <ThemedText style={styles.sectionTitle}>
              Estatísticas de Leitura
            </ThemedText>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <ThemedText style={styles.statNumber}>
                  {stats.totalBooks}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  Total de Livros
                </ThemedText>
              </View>
              
              <View style={styles.statCard}>
                <ThemedText style={styles.statNumber}>
                  {stats.readingBooks}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  Lendo Agora
                </ThemedText>
              </View>
              
              <View style={styles.statCard}>
                <ThemedText style={styles.statNumber}>
                  {stats.completedBooks}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  Concluídos
                </ThemedText>
              </View>
              
              <View style={styles.statCard}>
                <ThemedText style={styles.statNumber}>
                  {stats.averageProgress}%
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  Progresso Médio
                </ThemedText>
              </View>
            </View>
          </Animated.View>

          {/* Badge de Membro */}
          <Animated.View
            entering={FadeInUp.delay(250).duration(600).springify()}
            style={styles.membershipBadge}
          >
            <View style={styles.badgeContent}>
              <IconSymbol
                name="star.fill"
                size={24}
                color={Colors.light.warning}
              />
              <View style={styles.badgeTexts}>
                <ThemedText style={styles.badgeTitle}>
                  Membro desde {new Date(user?.created_at || '').getFullYear()}
                </ThemedText>
                <ThemedText style={styles.badgeSubtitle}>
                  Obrigado por fazer parte da comunidade Librefy!
                </ThemedText>
              </View>
            </View>
          </Animated.View>

          {/* Configurações */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600).springify()}
            style={styles.optionsSection}
          >
            <ThemedText style={styles.sectionTitle}>
              Configurações
            </ThemedText>
            
            <View style={styles.optionsList}>
              {profileOptions.map((option, index) => renderProfileOption(option, index))}
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600).springify()}
            style={styles.footer}
          >
            <Logo size="sm" />
            <ThemedText style={styles.footerText}>
              Versão 1.0.0 Beta
            </ThemedText>
            <ThemedText style={styles.footerText}>
              Feito com ❤️ para leitores
            </ThemedText>
          </Animated.View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.neutral,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: Spacing.md,
  },
  editButton: {
    minWidth: 120,
  },
  statsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 0.48,
    backgroundColor: Colors.light.neutral,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  membershipBadge: {
    backgroundColor: `${Colors.light.warning}15`,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badgeTexts: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.warning,
    marginBottom: 4,
  },
  badgeSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  optionsSection: {
    marginBottom: Spacing.xl,
  },
  optionsList: {
    gap: 4,
  },
  optionButton: {
    paddingHorizontal: 0,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    justifyContent: 'flex-start',
  },
  dangerOption: {
    backgroundColor: `${Colors.light.error}05`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  optionTexts: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
});