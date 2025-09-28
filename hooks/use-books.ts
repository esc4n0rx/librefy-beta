// hooks/use-books.ts
import { BooksService } from '@/services/books';
import { APIBook, PublishedBooksParams } from '@/types/books-api';
import { useCallback, useEffect, useState } from 'react';

interface UseBooksOptions {
  autoLoad?: boolean;
  limit?: number;
  orderBy?: PublishedBooksParams['orderBy'];
}

export function useBooks(options: UseBooksOptions = {}) {
  const { autoLoad = true, limit = 20, orderBy = 'published_at' } = options;
  
  const [books, setBooks] = useState<APIBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit,
    offset: 0,
    hasMore: true,
  });

  const loadBooks = useCallback(async (reset = false) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const offset = reset ? 0 : pagination.offset;
      const newBooks = await BooksService.getPublishedBooks({ 
        limit, 
        offset, 
        orderBy 
      });
      
      if (reset) {
        setBooks(newBooks);
      } else {
        setBooks(prev => [...prev, ...newBooks]);
      }

      setPagination({
        limit,
        offset: offset + newBooks.length,
        hasMore: newBooks.length === limit,
      });

    } catch (err: any) {
      console.error('[useBooks] Error loading books:', err);
      setError(err.message || 'Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }, [limit, orderBy, pagination.offset, loading]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPagination(prev => ({ ...prev, offset: 0, hasMore: true }));
    
    try {
      await loadBooks(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadBooks]);

  const loadMore = useCallback(async () => {
    if (pagination.hasMore && !loading) {
      await loadBooks(false);
    }
  }, [pagination.hasMore, loading, loadBooks]);

  const searchBooks = useCallback(async (query: string): Promise<APIBook[]> => {
    if (!query.trim()) {
      return [];
    }

    try {
      setError(null);
      const results = await BooksService.searchBooks({ q: query, limit: 50 });
      return results;
    } catch (err: any) {
      console.error('[useBooks] Error searching books:', err);
      setError(err.message || 'Erro na busca');
      return [];
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      refresh();
    }
  }, [autoLoad, orderBy]);

  return {
    books,
    loading,
    refreshing,
    error,
    pagination,
    refresh,
    loadMore,
    searchBooks,
  };
}