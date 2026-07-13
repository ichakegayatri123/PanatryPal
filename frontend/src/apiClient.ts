/**
 * API client to simplify making fetch requests to the Express backend.
 * Automatically injects the Authorization bearer token if available.
 */

// Retrieve authorization token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem('pantrypal_token');
}

// Set authorization token in localStorage
export function setAuthToken(token: string) {
  localStorage.setItem('pantrypal_token', token);
}

// Clear authorization token
export function removeAuthToken() {
  localStorage.removeItem('pantrypal_token');
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any; // Automatically stringified if object
}

// Leave this unset in local development: Vite proxies /api to the local
// Express server. Set it to the deployed backend origin in Vercel instead.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Perform a fetch request to /api with automatic authentication headers
 */
export async function apiRequest<T = any>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers || {});
  
  // Set defaults
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'object') {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  if (options.body) {
    fetchOptions.body = typeof options.body === 'object' ? JSON.stringify(options.body) : options.body;
  }

  const apiPath = path.startsWith('http') || path.startsWith('/') ? path : `/api/${path}`;
  const url = apiPath.startsWith('http') ? apiPath : `${API_BASE_URL}${apiPath}`;

  try {
    const response = await fetch(url, fetchOptions);
    
    // Auto-logout if token is expired or unauthorized
    if (response.status === 401 || response.status === 403) {
      removeAuthToken();
      localStorage.removeItem('pantrypal_current_user');
      // Trigger a window event so App.tsx can react to token expiration
      window.dispatchEvent(new Event('auth_session_expired'));
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    // Read response body
    const text = await response.text();
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch (error: any) {
    console.error(`API Request Error on ${path}:`, error);
    throw error;
  }
}
