export interface LibraryBook {
  id: string;
  user_id: string;
  book_id: string;
  saved_at: string;
  title: string;
  description: string;
  cover_url?: string;
  status: 'published' | 'draft' | 'archived';
  words_count: number;
  chapters_count: number;
  likes_count: number;
  reads_count: number;
  published_at: string;
  author_name: string;
  author_username: string;
  author_avatar?: string;
  // Estados locais
  reading_status?: 'reading' | 'completed' | 'want_to_read';
  progress?: number;
  is_offline?: boolean;
  download_progress?: number;
  offline_expires_at?: string;
}

export interface OfflineLicense {
  license_id: string;
  book: {
    id: string;
    title: string;
    cover_url?: string;
    status: string;
    words_count: number;
    chapters_count: number;
  };
  device_id: string;
  expires_at: string;
  created_at: string;
}

export interface LibraryPagination {
  limit: number;
  offset: number;
  total: number;
}

export interface LibraryResponse {
  data: LibraryBook[];
  pagination: LibraryPagination;
}

export interface OfflineManifest {
  version: number;
  manifest_url: string;
  package_url: string;
  package_size: number;
  checksum: string;
}

export interface OfflineLicenseResponse {
  license: {
    id: string;
    book_id: string;
    user_id: string;
    device_id: string;
    status: 'active' | 'expired' | 'revoked';
    content_key_wrapped: string;
    license_expires_at: string;
  };
  manifest: OfflineManifest;
}