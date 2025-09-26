export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  }
  
  export interface ApiError {
    success: false;
    message: string;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  }