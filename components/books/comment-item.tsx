// components/books/comment-item.tsx
import { Colors, Spacing } from '@/constants/theme';
import { BookComment } from '@/types/comments';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { Button } from '../ui/button';
import { IconSymbol } from '../ui/icon-symbol';
import { Input } from '../ui/input';

interface CommentItemProps {
  comment: BookComment;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
  level?: number;
}

export function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  level = 0,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = currentUserId === comment.user_id;
  const maxLevel = 2; // Máximo de níveis de aninhamento
  const canReply = level < maxLevel && !comment.is_deleted;

  const handleReply = async () => {
    if (!replyText.trim() || !onReply) return;

    try {
      setSubmitting(true);
      await onReply(comment.id, replyText.trim());
      setReplyText('');
      setShowReplyInput(false);
    } catch (error) {
      console.error('Error replying to comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim() || !onEdit) return;

    try {
      setSubmitting(true);
      await onEdit(comment.id, editText.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;

    Alert.alert(
      'Deletar Comentário',
      'Tem certeza que deseja deletar este comentário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => onDelete(comment.id),
        },
      ]
    );
  };

  // components/books/comment-item.tsx (continuação)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'agora há pouco';
    } else if (diffInHours < 24) {
      return `há ${diffInHours}h`;
    } else if (diffInHours < 168) { // 7 dias
      const days = Math.floor(diffInHours / 24);
      return `há ${days}d`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  if (comment.is_deleted) {
    return (
      <View style={[styles.container, { marginLeft: level * 20 }]}>
        <View style={styles.deletedComment}>
          <ThemedText style={styles.deletedText}>
            Comentário removido
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { marginLeft: level * 20 }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: comment.user_avatar || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.userInfo}>
          <ThemedText style={styles.userName}>
            {comment.user_name}
          </ThemedText>
          <ThemedText style={styles.userHandle}>
            @{comment.user_username}
          </ThemedText>
        </View>
        <ThemedText style={styles.date}>
          {formatDate(comment.created_at)}
        </ThemedText>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <Input
              value={editText}
              onChangeText={setEditText}
              placeholder="Editar comentário..."
              multiline
              style={styles.editInput}
            />
            <View style={styles.editActions}>
              <Button
                title="Cancelar"
                variant="ghost"
                size="sm"
                onPress={() => {
                  setIsEditing(false);
                  setEditText(comment.content);
                }}
              />
              <Button
                title="Salvar"
                variant="primary"
                size="sm"
                onPress={handleEdit}
                loading={submitting}
              />
            </View>
          </View>
        ) : (
          <ThemedText style={styles.commentText}>
            {comment.content}
          </ThemedText>
        )}
      </View>

      <View style={styles.actions}>
        {canReply && (
          <Button
            title="Responder"
            variant="ghost"
            size="sm"
            onPress={() => setShowReplyInput(!showReplyInput)}
          />
        )}
        
        {comment.reply_count && comment.reply_count > 0 && (
          <ThemedText style={styles.replyCount}>
            {comment.reply_count} resposta{comment.reply_count > 1 ? 's' : ''}
          </ThemedText>
        )}

        {isOwner && !isEditing && (
          <View style={styles.ownerActions}>
            <Pressable onPress={() => setIsEditing(true)} style={styles.actionButton}>
              <IconSymbol name="pencil" size={16} color={Colors.light.placeholder} />
            </Pressable>
            <Pressable onPress={handleDelete} style={styles.actionButton}>
              <IconSymbol name="trash" size={16} color={Colors.light.error} />
            </Pressable>
          </View>
        )}
      </View>

      {showReplyInput && (
        <View style={styles.replyContainer}>
          <Input
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Escreva uma resposta..."
            multiline
            style={styles.replyInput}
          />
          <View style={styles.replyActions}>
            <Button
              title="Cancelar"
              variant="ghost"
              size="sm"
              onPress={() => {
                setShowReplyInput(false);
                setReplyText('');
              }}
            />
            <Button
              title="Responder"
              variant="primary"
              size="sm"
              onPress={handleReply}
              loading={submitting}
              disabled={!replyText.trim()}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  userHandle: {
    fontSize: 12,
    opacity: 0.6,
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
  content: {
    marginBottom: Spacing.sm,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  replyCount: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '500',
  },
  ownerActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: Spacing.xs,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  replyContainer: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.lg,
    borderLeftWidth: 2,
    borderLeftColor: Colors.light.border,
  },
  replyInput: {
    marginBottom: Spacing.sm,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  editContainer: {
    gap: Spacing.sm,
  },
  editInput: {
    minHeight: 80,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  deletedComment: {
    padding: Spacing.sm,
    backgroundColor: Colors.light.neutral,
    borderRadius: 8,
  },
  deletedText: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.6,
  },
});