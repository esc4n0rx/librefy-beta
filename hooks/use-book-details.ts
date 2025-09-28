// hooks/use-book-details.ts
import { BooksService } from '@/services/books';
import { CommentsService } from '@/services/comments';
import { LibraryService } from '@/services/library';
import { RatingsService } from '@/services/ratings';
import { APIBook } from '@/types/books-api';
import { BookComment } from '@/types/comments';
import { RatingStats } from '@/types/ratings';
import { useCallback, useEffect, useState } from 'react';

interface UseBookDetailsOptions {
  bookId: string;
  autoLoad?: boolean;
}

export function useBookDetails({ bookId, autoLoad = true }: UseBookDetailsOptions) {
  const [book, setBook] = useState<APIBook | null>(null);
  const [comments, setComments] = useState<BookComment[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookDetails = useCallback(async () => {
    if (!bookId || loading) return;

    try {
      setLoading(true);
      setError(null);

      // Carregar dados em paralelo
      const [bookData, commentsData, ratingsData] = await Promise.all([
        BooksService.getBookDetails(bookId),
        CommentsService.getBookComments(bookId, 20),
        RatingsService.getBookRatingStats(bookId),
      ]);

      setBook(bookData);
      setComments(commentsData.comments);
      setRatingStats(ratingsData);

    } catch (err: any) {
      console.error('[useBookDetails] Error loading book details:', err);
      setError(err.message || 'Erro ao carregar detalhes do livro');
    } finally {
      setLoading(false);
    }
  }, [bookId, loading]);

  const rateBook = useCallback(async (rating: number) => {
    if (!bookId) return;

    try {
      const result = await RatingsService.rateBook(bookId, rating);
      
      // Atualizar stats localmente
      setRatingStats(prev => prev ? {
        ...prev,
        average_rating: result.stats.average_rating,
        ratings_count: result.stats.ratings_count,
      } : null);

      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao avaliar livro');
      return false;
    }
  }, [bookId]);

  const addToLibrary = useCallback(async () => {
    if (!bookId) return;

    try {
      await LibraryService.addToLibrary(bookId);
      setIsInLibrary(true);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar à biblioteca');
      return false;
    }
  }, [bookId]);

  const removeFromLibrary = useCallback(async () => {
    if (!bookId) return;

    try {
      await LibraryService.removeFromLibrary(bookId);
      setIsInLibrary(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao remover da biblioteca');
      return false;
    }
  }, [bookId]);

  const likeBook = useCallback(async () => {
    if (!bookId || !book) return;

    try {
      const result = await BooksService.likeBook(bookId);
      
      // Atualizar contagem de likes localmente
      setBook(prev => prev ? {
        ...prev,
        likes_count: result.liked ? prev.likes_count + 1 : prev.likes_count - 1
      } : null);

      return result.liked;
    } catch (err: any) {
      setError(err.message || 'Erro ao curtir livro');
      return false;
    }
  }, [bookId, book]);

  const addComment = useCallback(async (content: string, parentCommentId?: string) => {
    if (!bookId) return;

    try {
      const newComment = await CommentsService.createComment(bookId, {
        content,
        parent_comment_id: parentCommentId,
      });

      if (parentCommentId) {
        // É uma resposta - pode precisar recarregar as respostas
        // Por simplicidade, vamos recarregar todos os comentários
        const commentsData = await CommentsService.getBookComments(bookId, 50);
        setComments(commentsData.comments);
      } else {
        // É um comentário principal - adicionar ao início
        setComments(prev => [newComment, ...prev]);
      }

      return newComment;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar comentário');
      return null;
    }
  }, [bookId]);

  useEffect(() => {
    if (autoLoad && bookId) {
      loadBookDetails();
    }
  }, [autoLoad, bookId, loadBookDetails]);

  return {
    book,
    comments,
    ratingStats,
    isInLibrary,
    loading,
    error,
    refresh: loadBookDetails,
    rateBook,
    addToLibrary,
    removeFromLibrary,
    likeBook,
    addComment,
  };
}