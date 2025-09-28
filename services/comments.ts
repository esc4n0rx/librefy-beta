// services/comments.ts
import { BookComment, CommentResponse, CommentsResponse, CreateCommentRequest, UpdateCommentRequest } from '@/types/comments';
import { api } from './api';

export class CommentsService {
  static async getBookComments(bookId: string, limit: number = 50, offset: number = 0): Promise<{ comments: BookComment[]; total: number }> {
    console.log('[Comments] Getting comments for book:', bookId);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());
      
      const response = await api.get<CommentsResponse>(`/v1/comments/book/${bookId}?${queryParams.toString()}`);
      
      if (response.success) {
        console.log(`[Comments] Retrieved ${response.data?.length || 0} comments`);
        return {
          comments: response.data || [],
          total: response.pagination?.total || 0
        };
      }
      
      throw new Error(response.message || 'Erro ao carregar comentários');
    } catch (error) {
      console.error('[Comments] Error getting comments:', error);
      return { comments: [], total: 0 };
    }
  }

  static async getCommentReplies(commentId: string, limit: number = 20, offset: number = 0): Promise<{ replies: BookComment[]; total: number }> {
    console.log('[Comments] Getting replies for comment:', commentId);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());
      
      const response = await api.get<CommentsResponse>(`/v1/comments/${commentId}/replies?${queryParams.toString()}`);
      
      if (response.success) {
        console.log(`[Comments] Retrieved ${response.data?.length || 0} replies`);
        return {
          replies: response.data || [],
          total: response.pagination?.total || 0
        };
      }
      
      throw new Error(response.message || 'Erro ao carregar respostas');
    } catch (error) {
      console.error('[Comments] Error getting replies:', error);
      return { replies: [], total: 0 };
    }
  }

  static async createComment(bookId: string, data: CreateCommentRequest): Promise<BookComment> {
    console.log('[Comments] Creating comment for book:', bookId);
    try {
      const response = await api.post<CommentResponse>(`/v1/comments/book/${bookId}`, data);
      
      if (response.success && response.data) {
        console.log('[Comments] Comment created successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao criar comentário');
    } catch (error) {
      console.error('[Comments] Error creating comment:', error);
      throw error;
    }
  }

  static async updateComment(commentId: string, data: UpdateCommentRequest): Promise<BookComment> {
    console.log('[Comments] Updating comment:', commentId);
    try {
      const response = await api.put<CommentResponse>(`/v1/comments/${commentId}`, data);
      
      if (response.success && response.data) {
        console.log('[Comments] Comment updated successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao atualizar comentário');
    } catch (error) {
      console.error('[Comments] Error updating comment:', error);
      throw error;
    }
  }

  static async deleteComment(commentId: string): Promise<void> {
    console.log('[Comments] Deleting comment:', commentId);
    try {
      const response = await api.delete(`/v1/comments/${commentId}`);
      
      if (response.success) {
        console.log('[Comments] Comment deleted successfully');
        return;
      }
      
      throw new Error(response.message || 'Erro ao deletar comentário');
    } catch (error) {
      console.error('[Comments] Error deleting comment:', error);
      throw error;
    }
  }
}