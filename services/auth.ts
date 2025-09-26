import {
  AuthResponse,
  ChangeEmailData,
  ChangePasswordData,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  UpdateProfileData,
  User
} from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export class AuthService {
  private static readonly TOKEN_KEY = '@librefy_token';
  private static readonly USER_KEY = '@librefy_user';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('[Auth] Attempting login for:', credentials.username);
    try {
      const response = await api.post<AuthResponse>('/v1/auth/login', credentials);
      
      if (response.success && response.data) {
        console.log('[Auth] Login successful, saving auth data.');
        await this.saveAuthData(response.data.token, response.data.user);
        return response.data;
      }
      
      console.error('[Auth] Login failed:', response.message);
      throw new Error(response.message || 'Erro ao fazer login');
    } catch (error) {
      console.error('[Auth] Error during login:', error);
      throw error;
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    console.log('[Auth] Attempting to register user:', data.email);
    try {
      const response = await api.post<AuthResponse>('/v1/auth/register', data);
      
      if (response.success && response.data) {
        console.log('[Auth] Registration successful, saving auth data.');
        await this.saveAuthData(response.data.token, response.data.user);
        return response.data;
      }
      
      console.error('[Auth] Registration failed:', response.message);
      throw new Error(response.message || 'Erro ao criar conta');
    } catch (error) {
      console.error('[Auth] Error during registration:', error);
      throw error;
    }
  }

  static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    console.log('[Auth] Requesting password reset for:', data.email);
    try {
      const response = await api.post('/v1/auth/forgot-password', data);
      
      if (!response.success) {
        console.error('[Auth] Forgot password failed:', response.message);
        throw new Error(response.message || 'Erro ao solicitar recuperação');
      }
      console.log('[Auth] Forgot password request successful.');
    } catch (error) {
      console.error('[Auth] Error during forgot password request:', error);
      throw error;
    }
  }

  static async resetPassword(data: ResetPasswordData): Promise<void> {
    console.log('[Auth] Attempting to reset password.');
    try {
      const response = await api.post('/v1/auth/reset-password', data);
      
      if (!response.success) {
        console.error('[Auth] Reset password failed:', response.message);
        throw new Error(response.message || 'Erro ao redefinir senha');
      }
      console.log('[Auth] Reset password successful.');
    } catch (error) {
      console.error('[Auth] Error during password reset:', error);
      throw error;
    }
  }

  static async getProfile(): Promise<User> {
    console.log('[Auth] Getting user profile.');
    try {
      const response = await api.get<User>('/v1/auth/profile');
      
      if (response.success && response.data) {
        console.log('[Auth] Get profile successful.');
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        return response.data;
      }
      
      console.error('[Auth] Get profile failed:', response.message);
      throw new Error(response.message || 'Erro ao carregar perfil');
    } catch (error) {
      console.error('[Auth] Error getting profile:', error);
      throw error;
    }
  }

  static async updateProfile(data: UpdateProfileData): Promise<User> {
    console.log('[Auth] Updating user profile.');
    try {
      const response = await api.put<User>('/v1/auth/profile', data);
      
      if (response.success && response.data) {
        console.log('[Auth] Update profile successful.');
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        return response.data;
      }
      
      console.error('[Auth] Update profile failed:', response.message);
      throw new Error(response.message || 'Erro ao atualizar perfil');
    } catch (error) {
      console.error('[Auth] Error updating profile:', error);
      throw error;
    }
  }

  static async changePassword(data: ChangePasswordData): Promise<void> {
    console.log('[Auth] Changing password.');
    try {
      const response = await api.put('/v1/auth/change-password', data);
      
      if (!response.success) {
        console.error('[Auth] Change password failed:', response.message);
        throw new Error(response.message || 'Erro ao alterar senha');
      }
      console.log('[Auth] Change password successful.');
    } catch (error) {
      console.error('[Auth] Error changing password:', error);
      throw error;
    }
  }

  static async changeEmail(data: ChangeEmailData): Promise<User> {
    console.log('[Auth] Changing email.');
    try {
      const response = await api.put<User>('/v1/auth/change-email', data);
      
      if (response.success && response.data) {
        console.log('[Auth] Change email successful.');
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        return response.data;
      }
      
      console.error('[Auth] Change email failed:', response.message);
      throw new Error(response.message || 'Erro ao alterar email');
    } catch (error) {
      console.error('[Auth] Error changing email:', error);
      throw error;
    }
  }

  static async verifyToken(): Promise<User> {
    console.log('[Auth] Verifying token.');
    try {
      const response = await api.get<{ user: User }>('/v1/auth/verify-token');
      
      if (response.success && response.data) {
        console.log('[Auth] Token verification successful.');
        return response.data.user;
      }
      
      console.error('[Auth] Token verification failed:', response.message);
      throw new Error(response.message || 'Token inválido');
    } catch (error) {
      console.error('[Auth] Error verifying token:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    console.log('[Auth] Logging out.');
    try {
      await api.post('/v1/auth/logout');
      console.log('[Auth] Server logout successful.');
    } catch (error) {
      console.warn('[Auth] Error on server logout:', error);
    } finally {
      console.log('[Auth] Clearing local auth data.');
      await this.clearAuthData();
    }
  }

  static async getStoredToken(): Promise<string | null> {
    console.log('[Auth] Getting stored token.');
    return AsyncStorage.getItem(this.TOKEN_KEY);
  }

  static async getStoredUser(): Promise<User | null> {
    console.log('[Auth] Getting stored user.');
    const userJson = await AsyncStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private static async saveAuthData(token: string, user: User): Promise<void> {
    console.log('[Auth] Saving token and user to AsyncStorage.');
    await Promise.all([
      AsyncStorage.setItem(this.TOKEN_KEY, token),
      AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user)),
    ]);
  }

  private static async clearAuthData(): Promise<void> {
    console.log('[Auth] Clearing token and user from AsyncStorage.');
    await Promise.all([
      AsyncStorage.removeItem(this.TOKEN_KEY),
      AsyncStorage.removeItem(this.USER_KEY),
    ]);
  }
}