import { BookCreationService } from '@/services/book-creation';
import { BookCreationData, BookDraft, ChapterCreationData, ChapterDraft } from '@/types/book-creation';
import { useCallback, useState } from 'react';

interface UseBookCreationOptions {
  autoLoad?: boolean;
}

export function useBookCreation(options: UseBookCreationOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<BookDraft[]>([]);
  const [currentBook, setCurrentBook] = useState<BookDraft | null>(null);
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Criar novo livro
  const createBook = useCallback(async (data: BookCreationData): Promise<BookDraft | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const book = await BookCreationService.createBook(data);
      setBooks(prev => [book, ...prev]);
      setCurrentBook(book);
      
      return book;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar livro');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar livro
  const updateBook = useCallback(async (bookId: string, data: Partial<BookCreationData>): Promise<BookDraft | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const book = await BookCreationService.updateBook(bookId, data);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
      
      return book;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar livro');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentBook]);

  // Carregar livro
  const loadBook = useCallback(async (bookId: string): Promise<BookDraft | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const book = await BookCreationService.getBook(bookId);
      setCurrentBook(book);
      
      // Carregar capítulos do livro
      const bookChapters = await BookCreationService.getBookChapters(bookId);
      setChapters(bookChapters);
      
      return book;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar livro');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar livros do usuário
  const loadUserBooks = useCallback(async (): Promise<BookDraft[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const userBooks = await BookCreationService.getUserBooks();
      setBooks(userBooks);
      
      return userBooks;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar livros');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Publicar livro
  const publishBook = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await BookCreationService.publishBook(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? result.book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(result.book);
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao publicar livro');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentBook]);

  // Arquivar livro
  const archiveBook = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const book = await BookCreationService.archiveBook(bookId);
      setBooks(prev => prev.map(b => b.id === bookId ? book : b));
      if (currentBook?.id === bookId) {
        setCurrentBook(book);
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao arquivar livro');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentBook]);

  // Deletar livro
  const deleteBook = useCallback(async (bookId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await BookCreationService.deleteBook(bookId);
      setBooks(prev => prev.filter(b => b.id !== bookId));
      if (currentBook?.id === bookId) {
        setCurrentBook(null);
        setChapters([]);
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar livro');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentBook]);

  // CAPÍTULOS

  // Criar capítulo
  const createChapter = useCallback(async (bookId: string, data: ChapterCreationData): Promise<ChapterDraft | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const chapter = await BookCreationService.createChapter(bookId, data);
      setChapters(prev => [...prev, chapter].sort((a, b) => a.chapter_number - b.chapter_number));
      
      return chapter;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar capítulo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar capítulo
  const updateChapter = useCallback(async (bookId: string, chapterId: string, data: Partial<ChapterCreationData>): Promise<ChapterDraft | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const chapter = await BookCreationService.updateChapter(bookId, chapterId, data);
      setChapters(prev => prev.map(c => c.id === chapterId ? chapter : c));
      
      return chapter;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar capítulo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar capítulo
  const loadChapter = useCallback(async (bookId: string, chapterId: string): Promise<ChapterDraft | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const chapter = await BookCreationService.getChapter(bookId, chapterId);
      
      return chapter;
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar capítulo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Publicar capítulo
  const publishChapter = useCallback(async (bookId: string, chapterId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await BookCreationService.publishChapter(bookId, chapterId);
      setChapters(prev => prev.map(c => c.id === chapterId ? result.chapter : c));
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao publicar capítulo');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar capítulo
  const deleteChapter = useCallback(async (bookId: string, chapterId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await BookCreationService.deleteChapter(bookId, chapterId);
      setChapters(prev => prev.filter(c => c.id !== chapterId));
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar capítulo');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar rascunho de capítulo
  const saveChapterDraft = useCallback(async (bookId: string, chapterId: string, content: string): Promise<ChapterDraft | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const chapter = await BookCreationService.saveChapterDraft(bookId, chapterId, content);
      setChapters(prev => prev.map(c => c.id === chapterId ? chapter : c));
      
      return chapter;
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar rascunho');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reordenar capítulos
  const reorderChapters = useCallback(async (bookId: string, chapterOrders: { chapterId: string; newOrder: number }[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await BookCreationService.reorderChapters(bookId, chapterOrders);
      
      // Atualizar ordem local
      setChapters(prev => {
        const updated = [...prev];
        chapterOrders.forEach(({ chapterId, newOrder }) => {
          const chapterIndex = updated.findIndex(c => c.id === chapterId);
          if (chapterIndex !== -1) {
            updated[chapterIndex] = { ...updated[chapterIndex], chapter_number: newOrder };
          }
        });
        return updated.sort((a, b) => a.chapter_number - b.chapter_number);
      });
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao reordenar capítulos');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado
    loading,
    error,
    books,
    currentBook,
    chapters,
    
    // Ações de livro
    createBook,
    updateBook,
    loadBook,
    loadUserBooks,
    publishBook,
    archiveBook,
    deleteBook,
    
    // Ações de capítulo
    createChapter,
    updateChapter,
    loadChapter,
    publishChapter,
    deleteChapter,
    saveChapterDraft,
    reorderChapters,
    
    // Utilitários
    clearError,
  };
}
