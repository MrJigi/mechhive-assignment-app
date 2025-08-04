// app/utils/api/client.ts - COMPREHENSIVE FIX
import type { ApiResponse } from "~/types/api";

class ApiClient {
    private baseURL: string;
    private apiKey: string;
    private readonly REQUEST_TIMEOUT = 10000; // 10 seconds

    constructor(baseURL: string = '', apiKey: string = '') {
        this.baseURL = baseURL;
        this.apiKey = apiKey;

        // Debug logging
        console.log('ApiClient initialized:', {
            baseURL: this.baseURL,
            hasApiKey: !!this.apiKey,
            apiKeyLength: this.apiKey?.length || 0,
        });
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        // ✅ CRITICAL: Validate API key before making requests
        if (!this.apiKey) {
            throw new Error('API key is missing - cannot make requests');
        }

        if (!this.baseURL) {
            throw new Error('Base URL is missing - cannot make requests');
        }

        const url = `${this.baseURL}${endpoint}`;

        const requestHeaders = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            ...options.headers,
        };

        console.log('Making API request:', {
            url,
            method: options.method || 'GET',
            headers: { ...requestHeaders, 'x-api-key': '[REDACTED]' }
        });

        // ✅ FIX: Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn(`⏰ Request timeout after ${this.REQUEST_TIMEOUT}ms for: ${url}`);
            controller.abort();
        }, this.REQUEST_TIMEOUT);

        try {
            const response = await fetch(url, {
                headers: requestHeaders,
                signal: controller.signal,
                ...options,
            });

            clearTimeout(timeoutId);

            console.log('API response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // ✅ FIX: Safe JSON parsing to prevent crashes
            let data: ApiResponse<T>;
            try {
                const responseText = await response.text();
                if (!responseText.trim()) {
                    throw new Error('Empty response body');
                }
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('❌ Failed to parse JSON response:', jsonError);
                throw new Error(`Invalid JSON response: ${jsonError instanceof Error ? jsonError.message : 'Unknown parsing error'}`);
            }

            // ✅ FIX: Validate response structure
            if (typeof data !== 'object' || data === null) {
                throw new Error('API response is not a valid object');
            }

            console.log('API response data structure:', {
                hasProducts: !!data.products,
                hasMeta: !!data.meta,
                hasFilters: !!data.filters,
                productsCount: Array.isArray(data.products) ? data.products.length : 0
            });

            return data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.error(`⏰ Request timeout for ${endpoint}`);
                    throw new Error(`Request timeout after ${this.REQUEST_TIMEOUT}ms`);
                }
                console.error(`API request failed for ${endpoint}:`, error.message);
            } else {
                console.error(`API request failed for ${endpoint}:`, error);
            }
            throw error;
        }
    }

    async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
        // ✅ FIX: Better URL construction
        let url = endpoint;

        if (params && Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, value);
                }
            });

            const paramString = searchParams.toString();
            if (paramString) {
                url = endpoint.includes('?') ? `${endpoint}&${paramString}` : `${endpoint}?${paramString}`;
            }
        }

        console.log('Final GET URL:', url);
        return this.request<T>(url);
    }

    async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    isReady(): boolean {
        const ready = !!(this.baseURL && this.apiKey);
        if (!ready) {
            console.warn('ApiClient not ready:', {
                hasBaseURL: !!this.baseURL,
                hasApiKey: !!this.apiKey
            });
        }
        return ready;
    }
}

// ✅ CRITICAL: Use correct base URL (no trailing slash, no path)
export const apiClient = new ApiClient(
    'https://frontend-assignment-api.mechhive.io',
    '&R^xF7zW5RZd3Ln$zbXZL3r#gYxa5Ei9'
);