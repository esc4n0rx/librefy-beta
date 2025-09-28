import {
    BookCreationData,
    BookCreationResponse,
    BookDraft,
    BookUpdateResponse,
    ChapterCreationData,
    ChapterCreationResponse,
    ChapterDraft,
    ChapterUpdateResponse,
    PublishBookResponse,
    PublishChapterResponse
} from '@/types/book-creation';
import { api } from './api';

export class BookCreationService {
  // Criar novo livro
  static async createBook(data: BookCreationData): Promise<BookDraft> {
    console.log('[BookCreation] Creating new book:', data.title);
    try {
      const response = await api.post<BookCreationResponse>('/v1/books/create', data);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Book created successfully');
        return response.data.book;
      }
      
      throw new Error(response.message || 'Erro ao criar livro');
    } catch (error) {
      console.error('[BookCreation] Error creating book:', error);
      throw error;
    }
  }

  // Atualizar livro
  static async updateBook(bookId: string, data: Partial<BookCreationData>): Promise<BookDraft> {
    console.log('[BookCreation] Updating book:', bookId);
    try {
      const response = await api.put<BookUpdateResponse>(`/v1/books/${bookId}`, data);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Book updated successfully');
        return response.data.book;
      }
      
      throw new Error(response.message || 'Erro ao atualizar livro');
    } catch (error) {
      console.error('[BookCreation] Error updating book:', error);
      throw error;
    }
  }

  // Obter livro por ID
  static async getBook(bookId: string): Promise<BookDraft> {
    console.log('[BookCreation] Getting book:', bookId);
    try {
      const response = await api.get<{ success: boolean; data: { book: BookDraft } }>(`/v1/books/${bookId}/edit`);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Book retrieved successfully');
        return response.data.book;
      }
      
      throw new Error(response.message || 'Livro não encontrado');
    } catch (error) {
      console.error('[BookCreation] Error getting book:', error);
      throw error;
    }
  }

  // Listar livros do usuário
  static async getUserBooks(): Promise<BookDraft[]> {
    console.log('[BookCreation] Getting user books');
    try {
      const response = await api.get<{ success: boolean; data: BookDraft[] }>('/v1/books/my-books');
      
      if (response.success && response.data) {
        console.log('[BookCreation] User books retrieved successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao carregar livros');
    } catch (error) {
      console.error('[BookCreation] Error getting user books:', error);
      return [];
    }
  }

  // Publicar livro
  static async publishBook(bookId: string): Promise<{ book: BookDraft; published_at: string }> {
    console.log('[BookCreation] Publishing book:', bookId);
    try {
      const response = await api.post<PublishBookResponse>(`/v1/books/${bookId}/publish`);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Book published successfully');
        return {
          book: response.data.book,
          published_at: response.data.published_at
        };
      }
      
      throw new Error(response.message || 'Erro ao publicar livro');
    } catch (error) {
      console.error('[BookCreation] Error publishing book:', error);
      throw error;
    }
  }

  // Arquivar livro
  static async archiveBook(bookId: string): Promise<BookDraft> {
    console.log('[BookCreation] Archiving book:', bookId);
    try {
      const response = await api.post<BookUpdateResponse>(`/v1/books/${bookId}/archive`);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Book archived successfully');
        return response.data.book;
      }
      
      throw new Error(response.message || 'Erro ao arquivar livro');
    } catch (error) {
      console.error('[BookCreation] Error archiving book:', error);
      throw error;
    }
  }

  // Deletar livro
  static async deleteBook(bookId: string): Promise<void> {
    console.log('[BookCreation] Deleting book:', bookId);
    try {
      const response = await api.delete(`/v1/books/${bookId}`);
      
      if (response.success) {
        console.log('[BookCreation] Book deleted successfully');
        return;
      }
      
      throw new Error(response.message || 'Erro ao deletar livro');
    } catch (error) {
      console.error('[BookCreation] Error deleting book:', error);
      throw error;
    }
  }

  // CAPÍTULOS

  // Criar capítulo
  static async createChapter(bookId: string, data: ChapterCreationData): Promise<ChapterDraft> {
    console.log('[BookCreation] Creating chapter for book:', bookId);
    try {
      const response = await api.post<ChapterCreationResponse>(`/v1/books/${bookId}/chapters`, data);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Chapter created successfully');
        return response.data.chapter;
      }
      
      throw new Error(response.message || 'Erro ao criar capítulo');
    } catch (error) {
      console.error('[BookCreation] Error creating chapter:', error);
      throw error;
    }
  }

  // Atualizar capítulo
  static async updateChapter(bookId: string, chapterId: string, data: Partial<ChapterCreationData>): Promise<ChapterDraft> {
    console.log('[BookCreation] Updating chapter:', chapterId);
    try {
      const response = await api.put<ChapterUpdateResponse>(`/v1/books/${bookId}/chapters/${chapterId}`, data);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Chapter updated successfully');
        return response.data.chapter;
      }
      
      throw new Error(response.message || 'Erro ao atualizar capítulo');
    } catch (error) {
      console.error('[BookCreation] Error updating chapter:', error);
      throw error;
    }
  }

  // Obter capítulo
  static async getChapter(bookId: string, chapterId: string): Promise<ChapterDraft> {
    console.log('[BookCreation] Getting chapter:', chapterId);
    try {
      const response = await api.get<{ success: boolean; data: { chapter: ChapterDraft } }>(`/v1/books/${bookId}/chapters/${chapterId}`);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Chapter retrieved successfully');
        return response.data.chapter;
      }
      
      throw new Error(response.message || 'Capítulo não encontrado');
    } catch (error) {
      console.error('[BookCreation] Error getting chapter:', error);
      throw error;
    }
  }

  // Listar capítulos do livro
  static async getBookChapters(bookId: string): Promise<ChapterDraft[]> {
    console.log('[BookCreation] Getting chapters for book:', bookId);
    try {
      const response = await api.get<{ success: boolean; data: ChapterDraft[] }>(`/v1/books/${bookId}/chapters`);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Chapters retrieved successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao carregar capítulos');
    } catch (error) {
      console.error('[BookCreation] Error getting chapters:', error);
      return [];
    }
  }

  // Publicar capítulo
  static async publishChapter(bookId: string, chapterId: string): Promise<{ chapter: ChapterDraft; published_at: string }> {
    console.log('[BookCreation] Publishing chapter:', chapterId);
    try {
      const response = await api.post<PublishChapterResponse>(`/v1/books/${bookId}/chapters/${chapterId}/publish`);
      
      if (response.success && response.data) {
        console.log('[BookCreation] Chapter published successfully');
        return {
          chapter: response.data.chapter,
          published_at: response.data.published_at
        };
      }
      
      throw new Error(response.message || 'Erro ao publicar capítulo');
    } catch (error) {
      console.error('[BookCreation] Error publishing chapter:', error);
      throw error;
    }
  }

  // Deletar capítulo
  static async deleteChapter(bookId: string, chapterId: string): Promise<void> {
    console.log('[BookCreation] Deleting chapter:', chapterId);
    try {
      const response = await api.delete(`/v1/books/${bookId}/chapters/${chapterId}`);
      
      if (response.success) {
        console.log('[BookCreation] Chapter deleted successfully');
        return;
      }
      
      throw new Error(response.message || 'Erro ao deletar capítulo');
    } catch (error) {
      console.error('[BookCreation] Error deleting chapter:', error);
      throw error;
    }
  }

  // Reordenar capítulos
  static async reorderChapters(bookId: string, chapterOrders: { chapterId: string; newOrder: number }[]): Promise<void> {
    console.log('[BookCreation] Reordering chapters for book:', bookId);
    try {
      const response = await api.post(`/v1/books/${bookId}/chapters/reorder`, { chapterOrders });
      
      if (response.success) {
        console.log('[BookCreation] Chapters reordered successfully');
        return;
      }
      
      throw new Error(response.message || 'Erro ao reordenar capítulos');
    } catch (error) {
      console.error('[BookCreation] Error reordering chapters:', error);
      throw error;
    }
  }

  // Salvar rascunho de capítulo
  static async saveChapterDraft(bookId: string, chapterId: string, content: string): Promise<ChapterDraft> {
    console.log('[BookCreation] Saving chapter draft:', chapterId);
    try {
      const response = await api.post<ChapterUpdateResponse>(`/v1/books/${bookId}/chapters/${chapterId}/draft`, { content });
      
      if (response.success && response.data) {
        console.log('[BookCreation] Chapter draft saved successfully');
        return response.data.chapter;
      }
      
      throw new Error(response.message || 'Erro ao salvar rascunho');
    } catch (error) {
      console.error('[BookCreation] Error saving chapter draft:', error);
      throw error;
    }
  }
}
