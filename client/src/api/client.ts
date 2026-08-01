import { auth } from "@firebase_setup/firebase";

const API_BASE_URL = "/api";

interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken();
      } catch {
        return null;
      }
    }
    return null;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = await this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message || `HTTP error ${response.status}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          url.searchParams.append(key, value);
        }
      });
    }
    const headers = await this.getHeaders();
    const response = await fetch(url, { headers });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
