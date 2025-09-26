import { Book, BookCategory } from '@/types/book';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    description: 'Uma história poética sobre amizade, amor e a natureza humana.',
    rating: 4.8,
    genre: ['Ficção', 'Clássico', 'Filosofia'],
    status: 'reading',
    progress: 65,
    total_pages: 120,
    current_page: 78,
    published_date: '1943-04-06',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T15:45:00Z',
  },
  {
    id: '2',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    description: 'Um clássico da literatura brasileira sobre ciúme e obsessão.',
    rating: 4.5,
    genre: ['Literatura Brasileira', 'Clássico', 'Romance'],
    status: 'completed',
    progress: 100,
    total_pages: 200,
    current_page: 200,
    published_date: '1899-01-01',
    created_at: '2024-01-10T08:20:00Z',
    updated_at: '2024-01-18T20:30:00Z',
  },
  {
    id: '3',
    title: 'A Guerra dos Tronos',
    author: 'George R.R. Martin',
    cover_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    description: 'Primeiro livro da saga As Crônicas de Gelo e Fogo.',
    rating: 4.7,
    genre: ['Fantasia', 'Épico', 'Aventura'],
    status: 'want_to_read',
    progress: 0,
    total_pages: 720,
    current_page: 0,
    published_date: '1996-08-01',
    created_at: '2024-01-22T12:00:00Z',
    updated_at: '2024-01-22T12:00:00Z',
  },
  {
    id: '4',
    title: 'O Alquimista',
    author: 'Paulo Coelho',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    description: 'A história de Santiago em busca do seu tesouro pessoal.',
    rating: 4.3,
    genre: ['Ficção', 'Autoajuda', 'Filosofia'],
    status: 'completed',
    progress: 100,
    total_pages: 163,
    current_page: 163,
    published_date: '1988-01-01',
    created_at: '2024-01-05T14:20:00Z',
    updated_at: '2024-01-12T19:45:00Z',
  },
  {
    id: '5',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    description: 'Uma breve história da humanidade e nossa evolução.',
    rating: 4.6,
    genre: ['História', 'Ciência', 'Antropologia'],
    status: 'reading',
    progress: 30,
    total_pages: 443,
    current_page: 133,
    published_date: '2011-01-01',
    created_at: '2024-01-25T09:15:00Z',
    updated_at: '2024-01-28T16:20:00Z',
  },
];

export const mockCategories: BookCategory[] = [
  {
    id: 'trending',
    name: 'Em Alta',
    description: 'Os livros mais lidos da semana',
    books: mockBooks.slice(2, 5),
  },
  {
    id: 'recent',
    name: 'Lançamentos',
    description: 'Novos livros adicionados recentemente',
    books: mockBooks.slice(0, 3),
  },
  {
    id: 'classics',
    name: 'Clássicos',
    description: 'Grandes obras da literatura',
    books: mockBooks.filter(book => book.genre.includes('Clássico')),
  },
];

export const mockRecentlyRead = mockBooks.filter(book => 
  book.status === 'reading' || book.status === 'completed'
).slice(0, 3);

export const mockLibraryBooks = mockBooks.filter(book => 
  book.status === 'reading' || book.status === 'completed'
);

export const mockNews = [
  {
    id: '1',
    title: 'Nova obra de Clarice Lispector descoberta',
    description: 'Manuscrito inédito da autora será publicado em março',
    date: '2025-01-20',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Feira do Livro de São Paulo anuncia datas',
    description: 'Evento acontece de 15 a 25 de maio no Anhembi',
    date: '2025-01-18',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
  },
];