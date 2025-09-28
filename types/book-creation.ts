export interface BookCreationData {
  title: string;
  description: string;
  cover_url?: string;
  tags: string[];
  genre: string;
  language: string;
  is_public: boolean;
  allow_comments: boolean;
  allow_ratings: boolean;
}

export interface ChapterCreationData {
  title: string;
  content: string;
  chapter_number: number;
  is_published: boolean;
}

export interface ChapterDraft {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  content: string;
  words_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BookDraft {
  id: string;
  title: string;
  description: string;
  cover_url?: string;
  tags: string[];
  genre: string;
  language: string;
  is_public: boolean;
  allow_comments: boolean;
  allow_ratings: boolean;
  status: 'draft' | 'published' | 'archived';
  words_count: number;
  chapters_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  chapters: ChapterDraft[];
}

export interface EditorFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  textColor: string;
  backgroundColor: string;
}

export interface EditorState {
  content: string;
  selection: {
    start: number;
    end: number;
  };
  formatting: EditorFormatting;
  wordCount: number;
  characterCount: number;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export interface BookCreationResponse {
  success: boolean;
  message: string;
  data: {
    book: BookDraft;
  };
}

export interface ChapterCreationResponse {
  success: boolean;
  message: string;
  data: {
    chapter: ChapterDraft;
  };
}

export interface BookUpdateResponse {
  success: boolean;
  message: string;
  data: {
    book: BookDraft;
  };
}

export interface ChapterUpdateResponse {
  success: boolean;
  message: string;
  data: {
    chapter: ChapterDraft;
  };
}

export interface PublishBookResponse {
  success: boolean;
  message: string;
  data: {
    book: BookDraft;
    published_at: string;
  };
}

export interface PublishChapterResponse {
  success: boolean;
  message: string;
  data: {
    chapter: ChapterDraft;
    published_at: string;
  };
}
