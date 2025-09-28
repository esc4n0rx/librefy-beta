import { LibraryResponse, OfflineLicense, OfflineLicenseResponse } from '@/types/library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { api } from './api';

export class LibraryService {
  private static readonly DEVICE_ID_KEY = '@librefy_device_id';
  private static readonly LIBRARY_CACHE_KEY = '@librefy_library_cache';
  private static readonly OFFLINE_CACHE_KEY = '@librefy_offline_cache';

  static async getDeviceId(): Promise<string> {
    let deviceId = await AsyncStorage.getItem(this.DEVICE_ID_KEY);
    
    if (!deviceId) {
      // Gerar device ID único baseado no dispositivo
      const brand = Device.brand || 'unknown';
      const model = Device.modelName || 'unknown';
      const os = Device.osName || 'unknown';
      const timestamp = Date.now();
      
      deviceId = `${os}-${brand}-${model}-${timestamp}`.toLowerCase().replace(/\s+/g, '-');
      await AsyncStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  }

  static async getLibrary(params?: { limit?: number; offset?: number }): Promise<LibraryResponse> {
    console.log('[Library] Getting user library');
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      
      const endpoint = `/v1/library${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<LibraryResponse>(endpoint);
      
      if (response.success) {
        // Garantir que temos uma estrutura válida mesmo se data for undefined
        const libraryData: LibraryResponse = {
          data: response.data?.data || [],
          pagination: response.data?.pagination || {
            limit: params?.limit || 20,
            offset: params?.offset || 0,
            total: 0,
          }
        };

        // Cache local para performance
        await this.cacheLibrary(libraryData);
        console.log(`[Library] Retrieved ${libraryData.data.length} books`);
        return libraryData;
      }
      
      throw new Error(response.message || 'Erro ao carregar biblioteca');
    } catch (error) {
      console.error('[Library] Error getting library:', error);
      // Tentar retornar cache em caso de erro
      const cached = await this.getCachedLibrary();
      if (cached) {
        console.log('[Library] Returning cached library');
        return cached;
      }
      
      // Retornar estrutura vazia em caso de erro total
      return {
        data: [],
        pagination: {
          limit: params?.limit || 20,
          offset: params?.offset || 0,
          total: 0,
        }
      };
    }
  }

  static async addToLibrary(bookId: string): Promise<void> {
    console.log('[Library] Adding book to library:', bookId);
    try {
      const response = await api.post('/v1/library', { bookId });
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao adicionar à biblioteca');
      }
      
      // Invalidar cache para forçar reload
      await this.clearLibraryCache();
      console.log('[Library] Book added successfully');
    } catch (error) {
      console.error('[Library] Error adding to library:', error);
      throw error;
    }
  }

  static async removeFromLibrary(bookId: string): Promise<void> {
    console.log('[Library] Removing book from library:', bookId);
    try {
      const response = await api.delete(`/v1/library/${bookId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao remover da biblioteca');
      }
      
      // Invalidar cache
      await this.clearLibraryCache();
      console.log('[Library] Book removed successfully');
    } catch (error) {
      console.error('[Library] Error removing from library:', error);
      throw error;
    }
  }

  static async createOfflineLicense(bookId: string): Promise<OfflineLicenseResponse> {
    console.log('[Library] Creating offline license for book:', bookId);
    try {
      const deviceId = await this.getDeviceId();
      const response = await api.post<OfflineLicenseResponse>(`/v1/library/${bookId}/offline`, {
        deviceId,
      });
      
      if (response.success && response.data) {
        console.log('[Library] Offline license created successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao criar licença offline');
    } catch (error) {
      console.error('[Library] Error creating offline license:', error);
      throw error;
    }
  }

  static async revokeOfflineLicense(bookId: string): Promise<void> {
    console.log('[Library] Revoking offline license for book:', bookId);
    try {
      const deviceId = await this.getDeviceId();
      const response = await api.delete(`/v1/library/${bookId}/offline?deviceId=${deviceId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao revogar licença offline');
      }
      
      console.log('[Library] Offline license revoked successfully');
    } catch (error) {
      console.error('[Library] Error revoking offline license:', error);
      throw error;
    }
  }

  static async getOfflineLicenses(): Promise<OfflineLicense[]> {
    console.log('[Library] Getting offline licenses');
    try {
      const deviceId = await this.getDeviceId();
      const response = await api.get<{ data: OfflineLicense[]; total: number }>(`/v1/library/offline?deviceId=${deviceId}`);
      
      if (response.success) {
        // Garantir que temos um array válido
        const licenses = response.data?.data || [];
        
        // Cache offline licenses
        await this.cacheOfflineLicenses(licenses);
        console.log(`[Library] Retrieved ${licenses.length} offline licenses`);
        return licenses;
      }
      
      return [];
    } catch (error) {
      console.error('[Library] Error getting offline licenses:', error);
      // Retornar cache em caso de erro
      const cached = await this.getCachedOfflineLicenses();
      return cached || [];
    }
  }

  static async renewOfflineLicense(bookId: string): Promise<{ license_id: string; expires_at: string }> {
    console.log('[Library] Renewing offline license for book:', bookId);
    try {
      const deviceId = await this.getDeviceId();
      const response = await api.post<{ license_id: string; expires_at: string }>(`/v1/library/${bookId}/offline/renew`, {
        deviceId,
      });
      
      if (response.success && response.data) {
        console.log('[Library] Offline license renewed successfully');
        return response.data;
      }
      
      throw new Error(response.message || 'Erro ao renovar licença offline');
    } catch (error) {
      console.error('[Library] Error renewing offline license:', error);
      throw error;
    }
  }

  // Métodos de cache privados
  private static async cacheLibrary(library: LibraryResponse): Promise<void> {
    try {
      await AsyncStorage.setItem(this.LIBRARY_CACHE_KEY, JSON.stringify({
        ...library,
        cached_at: Date.now(),
      }));
    } catch (error) {
      console.warn('[Library] Error caching library:', error);
    }
  }

  private static async getCachedLibrary(): Promise<LibraryResponse | null> {
    try {
      const cached = await AsyncStorage.getItem(this.LIBRARY_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache válido por 5 minutos
        if (Date.now() - parsed.cached_at < 5 * 60 * 1000) {
          // Garantir estrutura válida do cache
          return {
            data: parsed.data || [],
            pagination: parsed.pagination || { limit: 20, offset: 0, total: 0 }
          };
        }
      }
    } catch (error) {
      console.warn('[Library] Error getting cached library:', error);
    }
    return null;
  }

  private static async clearLibraryCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.LIBRARY_CACHE_KEY);
    } catch (error) {
      console.warn('[Library] Error clearing library cache:', error);
    }
  }

  private static async cacheOfflineLicenses(licenses: OfflineLicense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.OFFLINE_CACHE_KEY, JSON.stringify({
        licenses: licenses || [],
        cached_at: Date.now(),
      }));
    } catch (error) {
      console.warn('[Library] Error caching offline licenses:', error);
    }
  }

  private static async getCachedOfflineLicenses(): Promise<OfflineLicense[] | null> {
    try {
      const cached = await AsyncStorage.getItem(this.OFFLINE_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache válido por 10 minutos
        if (Date.now() - parsed.cached_at < 10 * 60 * 1000) {
          return parsed.licenses || [];
        }
      }
    } catch (error) {
      console.warn('[Library] Error getting cached offline licenses:', error);
    }
    return null;
  }
}