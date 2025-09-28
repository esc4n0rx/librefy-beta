// services/books.ts
import { APIBook, BookResponse, BookSearchParams, BooksResponse, PublishedBooksParams } from '@/types/books-api';
import { api } from './api';

export class BooksService {
  static async getPublishedBooks(params: PublishedBooksParams = {}): Promise<APIBook[]> {
    console.log('[Books] Getting published books with params:', params);
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);
      
      const endpoint = `/v1/books/published${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<BooksResponse>(endpoint);
      
      if (response.success) {
        console.log(`[Books] Retrieved ${response.data?.length || 0} published books`);
        return response.data || [];
      }
      
      throw new Error(response.message || 'Erro ao carregar livros');
    } catch (error) {
      console.error('[Books] Error getting published books:', error);
      return []; // Retornar array vazio em caso de erro
    }
  }

  static async searchBooks(params: BookSearchParams): Promise<APIBook[]> {
    if (!params.q?.trim()) {
      return [];
    }

    console.log('[Books] Searching books with query:', params.q);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', params.q);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      
      const response = await api.get<BooksResponse>(`/v1/books/search?${queryParams.toString()}`);
      
      if (response.success) {
        console.log(`[Books] Found ${response.data?.length || 0} books`);
        return response.data || [];
      }
      
      throw new Error(response.message || 'Erro na busca');
    } catch (error) {
      console.error('[Books] Error searching books:', error);
      return [];
    }
  }

  static async getBookDetails(bookId: string): Promise<APIBook | null> {
    console.log('[Books] Getting book details for:', bookId);
    try {
      const response = await api.get<BookResponse>(`/v1/books/${bookId}`);
      
      if (response.success && response.data) {
        console.log('[Books] Book details retrieved successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Livro não encontrado');
    } catch (error) {
      console.error('[Books] Error getting book details:', error);
      return null;
    }
  }

  static async likeBook(bookId: string): Promise<{ liked: boolean }> {
    console.log('[Books] Toggling like for book:', bookId);
    try {
      const response = await api.post<{ liked: boolean }>(`/v1/books/${bookId}/like`);
      
      if (response.success && response.data) {
        console.log('[Books] Like toggled successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao curtir livro');
    } catch (error) {
      console.error('[Books] Error liking book:', error);
      throw error;
    }
  }

  static async readChapter(bookId: string, chapterNumber: number): Promise<any> {
    console.log('[Books] Reading chapter:', chapterNumber, 'of book:', bookId);
    try {
      const response = await api.get<any>(`/v1/books/${bookId}/chapter/${chapterNumber}`);
      
      if (response.success && response.data) {
        console.log('[Books] Chapter retrieved successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Capítulo não encontrado');
    } catch (error) {
      console.error('[Books] Error reading chapter:', error);
      throw error;
    }
  }
}