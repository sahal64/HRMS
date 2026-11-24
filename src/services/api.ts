// Centralized API Client for Pure PHP + MySQL Backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/hrms-api/api';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const token = localStorage.getItem('hrms_auth_token');
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
