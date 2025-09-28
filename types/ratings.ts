// types/ratings.ts
export interface BookRating {
  id: string;
  rating: number; // 1-5
  created_at: string;
  updated_at: string;
}

export interface RatingStats {
  average_rating: number;
  ratings_count: number;
  distribution: {
    [key: string]: number; // "1": 0, "2": 1, etc.
  };
}

export interface RateBookRequest {
  rating: number;
}

export interface RateBookResponse {
  success: boolean;
  message: string;
  data: {
    rating: BookRating;
    stats: Omit<RatingStats, 'distribution'>;
  };
}

export interface RatingStatsResponse {
  success: boolean;
  message: string;
  data: RatingStats;
}