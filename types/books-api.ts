// types/books-api.ts
export interface APIBook {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  description: string;
  cover_url?: string;
  status: 'published' | 'draft' | 'archived';
  visibility: 'public' | 'unlisted' | 'private';
  tags: string[];
  words_count: number;
  chapters_count: number;
  likes_count: number;
  reads_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  users: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
  };
  chapters?: APIChapter[];
  // Campos de agregação que podem vir da API
  average_rating?: number;
  ratings_count?: number;
  comments_count?: number;
}

export interface APIChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  content_md: string;
  words_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BookSearchParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface PublishedBooksParams {
  limit?: number;
  offset?: number;
  orderBy?: 'published_at' | 'reads_count' | 'likes_count' | 'title' | 'average_rating' | 'ratings_count';
}

export interface BooksResponse {
  success: boolean;
  message: string;
  data: APIBook[];
}

export interface BookResponse {
  success: boolean;
  message: string;
  data: APIBook;
}