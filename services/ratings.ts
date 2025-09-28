// services/ratings.ts
import { RateBookResponse, RatingStats, RatingStatsResponse } from '@/types/ratings';
import { api } from './api';

export class RatingsService {
  static async rateBook(bookId: string, rating: number): Promise<{ stats: { average_rating: number; ratings_count: number } }> {
    console.log('[Ratings] Rating book:', bookId, 'with rating:', rating);
    try {
      const response = await api.post<RateBookResponse>(`/v1/ratings/book/${bookId}`, { rating });
      
      if (response.success && response.data) {
        console.log('[Ratings] Book rated successfully');
        return { stats: response.data.stats };
      }
      
      throw new Error(response.message || 'Erro ao avaliar livro');
    } catch (error) {
      console.error('[Ratings] Error rating book:', error);
      throw error;
    }
  }

  static async removeRating(bookId: string): Promise<{ stats: { average_rating: number; ratings_count: number } }> {
    console.log('[Ratings] Removing rating for book:', bookId);
    try {
      const response = await api.delete<{ stats: { average_rating: number; ratings_count: number } }>(`/v1/ratings/book/${bookId}`);
      
      if (response.success && response.data) {
        console.log('[Ratings] Rating removed successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao remover avaliação');
    } catch (error) {
      console.error('[Ratings] Error removing rating:', error);
      throw error;
    }
  }

  static async getBookRatingStats(bookId: string): Promise<RatingStats | null> {
    console.log('[Ratings] Getting rating stats for book:', bookId);
    try {
      const response = await api.get<RatingStatsResponse>(`/v1/ratings/book/${bookId}/stats`);
      
      if (response.success && response.data) {
        console.log('[Ratings] Rating stats retrieved successfully');
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('[Ratings] Error getting rating stats:', error);
      return null;
    }
  }
}