import { LibraryService } from '@/services/library';
import { LibraryBook, OfflineLicense } from '@/types/library';
import { useCallback, useEffect, useState } from 'react';

type LibraryFilter = 'all' | 'reading' | 'completed' | 'want_to_read' | 'offline';
type SortOption = 'recent' | 'title' | 'author' | 'progress';

interface UseLibraryOptions {
  autoLoad?: boolean;
  limit?: number;
}

export function useLibrary(options: UseLibraryOptions = {}) {
  const { autoLoad = true, limit = 20 } = options;
  
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [offlineLicenses, setOfflineLicenses] = useState<OfflineLicense[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    limit,
    offset: 0,
    total: 0,
    hasMore: true,
  });

  // Estados de filtro e ordenação
  const [filter, setFilter] = useState<LibraryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const loadLibrary = useCallback(async (reset = false) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const offset = reset ? 0 : pagination.offset;
      const response = await LibraryService.getLibrary({ limit, offset });
      
      // Garantir que response e response.data existem
      const newBooks = response?.data || [];
      const newPagination = response?.pagination || { limit, offset: 0, total: 0 };
      
      if (reset) {
        setBooks(newBooks);
      } else {
        setBooks(prev => [...(prev || []), ...newBooks]);
      }

      setPagination({
        limit: newPagination.limit,
        offset: newPagination.offset + newBooks.length,
        total: newPagination.total,
        hasMore: newPagination.offset + newBooks.length < newPagination.total,
      });

    } catch (err: any) {
      console.error('[useLibrary] Error loading library:', err);
      setError(err.message || 'Erro ao carregar biblioteca');
    } finally {
      setLoading(false);
    }
  }, [limit, pagination.offset, loading]);

  const loadOfflineLicenses = useCallback(async () => {
    try {
      const licenses = await LibraryService.getOfflineLicenses();
      setOfflineLicenses(licenses || []);
    } catch (err: any) {
      console.error('[useLibrary] Error loading offline licenses:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPagination(prev => ({ ...prev, offset: 0, hasMore: true }));
    
    try {
      await Promise.all([
        loadLibrary(true),
        loadOfflineLicenses(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [loadLibrary, loadOfflineLicenses]);

  const loadMore = useCallback(async () => {
    if (pagination.hasMore && !loading) {
      await loadLibrary(false);
    }
  }, [pagination.hasMore, loading, loadLibrary]);

  const addToLibrary = useCallback(async (bookId: string) => {
    try {
      await LibraryService.addToLibrary(bookId);
      await refresh();
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar à biblioteca');
      return false;
    }
  }, [refresh]);

  const removeFromLibrary = useCallback(async (bookId: string) => {
    try {
      await LibraryService.removeFromLibrary(bookId);
      setBooks(prev => (prev || []).filter(book => book.book_id !== bookId));
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao remover da biblioteca');
      return false;
    }
  }, []);

  const downloadOffline = useCallback(async (bookId: string) => {
    try {
      setBooks(prev => (prev || []).map(book => 
        book.book_id === bookId 
          ? { ...book, download_progress: 0 }
          : book
      ));

      const licenseResponse = await LibraryService.createOfflineLicense(bookId);
      
      // Simular progresso de download
      for (let progress = 0; progress <= 100; progress += 10) {
        setBooks(prev => (prev || []).map(book => 
          book.book_id === bookId 
            ? { ...book, download_progress: progress }
            : book
        ));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Marcar como offline
      setBooks(prev => (prev || []).map(book => 
        book.book_id === bookId 
          ? { 
              ...book, 
              is_offline: true,
              download_progress: undefined,
              offline_expires_at: licenseResponse.license.license_expires_at,
            }
          : book
      ));

      await loadOfflineLicenses();
      return true;
    } catch (err: any) {
      setBooks(prev => (prev || []).map(book => 
        book.book_id === bookId 
          ? { ...book, download_progress: undefined }
          : book
      ));
      setError(err.message || 'Erro ao baixar para offline');
      return false;
    }
  }, [loadOfflineLicenses]);

  const removeOffline = useCallback(async (bookId: string) => {
    try {
      await LibraryService.revokeOfflineLicense(bookId);
      setBooks(prev => (prev || []).map(book => 
        book.book_id === bookId 
          ? { ...book, is_offline: false, offline_expires_at: undefined }
          : book
      ));
      await loadOfflineLicenses();
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao remover offline');
      return false;
    }
  }, [loadOfflineLicenses]);

  const renewOffline = useCallback(async (bookId: string) => {
    try {
      const renewed = await LibraryService.renewOfflineLicense(bookId);
      setBooks(prev => (prev || []).map(book => 
        book.book_id === bookId 
          ? { ...book, offline_expires_at: renewed.expires_at }
          : book
      ));
      await loadOfflineLicenses();
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao renovar licença');
      return false;
    }
  }, [loadOfflineLicenses]);

  // Filtrar e ordenar livros - garantir que books é sempre um array
  const filteredBooks = (books || [])
    .filter(book => {
      if (!book) return false;
      
      switch (filter) {
        case 'reading':
          return book.reading_status === 'reading';
        case 'completed':
          return book.reading_status === 'completed';
        case 'want_to_read':
          return book.reading_status === 'want_to_read';
        case 'offline':
          return book.is_offline;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'author':
          return (a.author_name || '').localeCompare(b.author_name || '');
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        case 'recent':
        default:
          return new Date(b.saved_at || 0).getTime() - new Date(a.saved_at || 0).getTime();
      }
    });

  // Estatísticas - garantir que books é sempre um array
  const stats = {
    total: (books || []).length,
    reading: (books || []).filter(book => book?.reading_status === 'reading').length,
    completed: (books || []).filter(book => book?.reading_status === 'completed').length,
    want_to_read: (books || []).filter(book => book?.reading_status === 'want_to_read').length,
    offline: (books || []).filter(book => book?.is_offline).length,
  };

  useEffect(() => {
    if (autoLoad) {
      refresh();
    }
  }, [autoLoad]);

  return {
    // Dados
    books: filteredBooks,
    allBooks: books || [],
    offlineLicenses: offlineLicenses || [],
    stats,
    
    // Estados
    loading,
    refreshing,
    error,
    pagination,
    
    // Filtros
    filter,
    setFilter,
    sortBy,
    setSortBy,
    
    // Ações
    refresh,
    loadMore,
    addToLibrary,
    removeFromLibrary,
    downloadOffline,
    removeOffline,
    renewOffline,
  };
}