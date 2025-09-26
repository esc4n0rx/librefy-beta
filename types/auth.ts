export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    birth_date: string;
    avatar_url?: string;
    bio?: string;
    status: 'active' | 'banned';
    created_at: string;
    updated_at: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    username: string;
    email: string;
    password: string;
    birth_date: string;
  }
  
  export interface ForgotPasswordData {
    email: string;
  }
  
  export interface ResetPasswordData {
    email: string;
    code: string;
    new_password: string;
  }
  
  export interface UpdateProfileData {
    name?: string;
    avatar_url?: string;
    bio?: string;
  }
  
  export interface ChangePasswordData {
    current_password: string;
    new_password: string;
  }
  
  export interface ChangeEmailData {
    new_email: string;
    password: string;
  }