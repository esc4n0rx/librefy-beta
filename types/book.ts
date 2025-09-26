export interface Book {
    id: string;
    title: string;
    author: string;
    cover_url?: string;
    description: string;
    rating: number;
    genre: string[];
    status: 'reading' | 'completed' | 'want_to_read';
    progress?: number; // 0-100 percentage
    total_pages?: number;
    current_page?: number;
    published_date: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ReadingSession {
    id: string;
    book_id: string;
    user_id: string;
    start_page: number;
    end_page: number;
    duration_minutes: number;
    created_at: string;
  }
  
  export interface BookCategory {
    id: string;
    name: string;
    description?: string;
    books: Book[];
  }