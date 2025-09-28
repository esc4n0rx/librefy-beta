import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { Button } from '../ui/button';
import { IconSymbol } from '../ui/icon-symbol';

interface OfflineManagerProps {
  isOffline: boolean;
  expiresAt?: string;
  onDownload: () => void;
  onRemove: () => void;
  onRenew: () => void;
  loading?: boolean;
}

export function OfflineManager({
  isOffline,
  expiresAt,
  onDownload,
  onRemove,
  onRenew,
  loading = false,
}: OfflineManagerProps) {
  const isExpiringSoon = React.useMemo(() => {
    if (!expiresAt) return false;
    const expirationDate = new Date(expiresAt);
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    return expirationDate < threeDaysFromNow;
  }, [expiresAt]);

  const isExpired = React.useMemo(() => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }, [expiresAt]);

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleRemoveOffline = () => {
    Alert.alert(
      'Remover Download',
      'Tem certeza que deseja remover este livro dos downloads offline?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: onRemove },
      ]
    );
  };

  if (!isOffline) {
    return (
      <Button
        title="Baixar Offline"
        variant="outline"
        size="sm"
        onPress={onDownload}
        loading={loading}
        style={styles.downloadButton}
      >
        <IconSymbol
          name="arrow.down.circle"
          size={16}
          color={Colors.light.primary}
        />
      </Button>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.statusContainer,
        isExpired && styles.expiredContainer,
        isExpiringSoon && !isExpired && styles.warnContainer,
      ]}>
        <IconSymbol
          name={isExpired ? 'exclamationmark.triangle.fill' : 'checkmark.circle.fill'}
          size={16}
          color={isExpired ? Colors.light.error : isExpiringSoon ? Colors.light.warning : Colors.light.success}
        />
        <View style={styles.statusTexts}>
          <ThemedText style={[
            styles.statusLabel,
            isExpired && { color: Colors.light.error },
            isExpiringSoon && !isExpired && { color: Colors.light.warning },
          ]}>
           {isExpired ? 'Expirado' : 'Disponível Offline'}
          </ThemedText>
          {expiresAt && (
            <ThemedText style={[
              styles.expirationText,
              isExpired && { color: Colors.light.error },
              isExpiringSoon && !isExpired && { color: Colors.light.warning },
            ]}>
              {isExpired ? 'Expirou em ' : 'Expira em '}{formatExpirationDate(expiresAt)}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {(isExpired || isExpiringSoon) && (
          <Button
            title="Renovar"
            variant="primary"
            size="sm"
            onPress={onRenew}
            loading={loading}
            style={styles.renewButton}
          />
        )}
        <Button
          title="Remover"
          variant="ghost"
          size="sm"
          onPress={handleRemoveOffline}
          loading={loading}
          textStyle={{ color: Colors.light.error }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: `${Colors.light.success}10`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${Colors.light.success}20`,
  },
  expiredContainer: {
    backgroundColor: `${Colors.light.error}10`,
    borderColor: `${Colors.light.error}20`,
  },
  warnContainer: {
    backgroundColor: `${Colors.light.warning}10`,
    borderColor: `${Colors.light.warning}20`,
  },
  statusTexts: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.success,
  },
  expirationText: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  renewButton: {
    flex: 1,
  },
});