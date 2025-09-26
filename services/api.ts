import { ApiError, ApiResponse } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.85:3000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    console.log('[API] Getting headers...');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = await AsyncStorage.getItem('@librefy_token');
    if (token) {
      console.log('[API] Token found.');
      headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('[API] No token found.');
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    console.log(`[API] Response status: ${response.status}`);
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('[API] Response JSON data:', data);
      
      if (!response.ok) {
        console.error('[API] Response not OK, throwing error.', data);
        throw data as ApiError;
      }
      
      return data as ApiResponse<T>;
    }
    
    if (!response.ok) {
      console.error('[API] Response not OK, throwing network error.');
      throw {
        success: false,
        message: 'Erro de rede. Tente novamente.',
      } as ApiError;
    }

    console.log('[API] Response OK, but not JSON.');
    return {
      success: true,
      message: 'Sucesso',
    } as ApiResponse<T>;
  }

  private async doRequest<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`[API] Making ${options.method} request to ${url}`);
    
    try {
      const response = await fetch(url, options);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('[API] Fetch failed:', error);
      // This is the key part for "Network request failed"
      if (error instanceof TypeError && error.message === 'Network request failed') {
         console.error(
          '[API] Network request failed. This is often a CORS issue or the server is not reachable.',
          `URL: ${url}`
        );
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return this.doRequest<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return this.doRequest<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return this.doRequest<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return this.doRequest<T>(endpoint, { method: 'DELETE', headers });
  }

  async healthCheck(): Promise<ApiResponse> {
    console.log('[API] Performing health check...');
    return this.get('/health');
  }
}

export const api = new ApiClient(BASE_URL);