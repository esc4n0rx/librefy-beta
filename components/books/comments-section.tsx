// components/books/comments-section.tsx
import { Colors, Spacing } from '@/constants/theme';
import { BookComment } from '@/types/comments';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CommentItem } from './comment-item';

interface CommentsSectionProps {
  comments: BookComment[];
  onAddComment?: (content: string) => Promise<void>;
  onReplyToComment?: (commentId: string, content: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  currentUserId?: string;
  loading?: boolean;
}

export function CommentsSection({
  comments,
  onAddComment,
  onReplyToComment,
  onEditComment,
  onDeleteComment,
  currentUserId,
  loading = false,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim() || !onAddComment) return;

    try {
      setSubmitting(true);
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderCommentItem = ({ item }: { item: BookComment }) => (
    <CommentItem
      comment={item}
      onReply={onReplyToComment}
      onEdit={onEditComment}
      onDelete={onDeleteComment}
      currentUserId={currentUserId}
      level={0}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <ThemedText style={styles.title}>
        Comentários ({comments.length})
      </ThemedText>
      
      {onAddComment && currentUserId && (
        <View style={styles.addCommentContainer}>
          <Input
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Escreva um comentário..."
            multiline
            style={styles.commentInput}
          />
          <Button
            title="Comentar"
            variant="primary"
            size="md"
            onPress={handleAddComment}
            loading={submitting}
            disabled={!newComment.trim()}
            style={styles.submitButton}
          />
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>
        Ainda não há comentários neste livro.
      </ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Seja o primeiro a comentar!
      </ThemedText>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderCommentItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Desabilitar scroll se estiver dentro de outro scroll
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: Spacing.md,
  },
  addCommentContainer: {
    gap: Spacing.sm,
  },
  commentInput: {
    minHeight: 80,
  },
  submitButton: {
    alignSelf: 'flex-end',
    minWidth: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
});