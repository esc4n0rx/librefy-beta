// types/comments.ts
export interface BookComment {
  id: string;
  user_id: string;
  book_id: string;
  parent_comment_id?: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_username: string;
  user_avatar?: string;
  reply_count?: number; // Para comentários principais
}

export interface CreateCommentRequest {
  content: string;
  parent_comment_id?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  data: BookComment[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: BookComment;
}