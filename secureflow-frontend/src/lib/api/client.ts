import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['X-Request-ID'] = this.generateRequestId();
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client.request(originalRequest);
          } catch {
            useAuthStore.getState().logout();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      useAuthStore.getState().setTokens(accessToken, newRefreshToken);
      return accessToken;
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  private normalizeError(error: AxiosError) {
    if (error.response) {
      const data = error.response.data as {
        code?: string;
        message?: string;
        details?: Record<string, string[]>;
        requestId?: string;
      };

      return {
        code: data?.code || 'API_ERROR',
        message: data?.message || error.message,
        details: data?.details,
        requestId: data?.requestId || error.response.headers['x-request-id'],
        status: error.response.status,
      };
    }

    if (error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      status: 0,
    };
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.client.get<T>(url, { params });
  }

  post<T>(url: string, data?: unknown) {
    return this.client.post<T>(url, data);
  }

  put<T>(url: string, data?: unknown) {
    return this.client.put<T>(url, data);
  }

  patch<T>(url: string, data?: unknown) {
    return this.client.patch<T>(url, data);
  }

  delete<T>(url: string) {
    return this.client.delete<T>(url);
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient;