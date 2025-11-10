import axios, { AxiosInstance } from 'axios';
import { DOCTOC_CONFIG } from '@/config/constants';

export abstract class BaseApiClient {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: DOCTOC_CONFIG.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOCTOC_CONFIG.apiToken}`
      },
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  protected async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.client.post(endpoint, data);
    return response.data;
  }
}
