const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Enhanced fetch wrapper with automatic JWT token attachment,
 * JSON serialization, and error normalization.
 */
export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('ai_ticket_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        // Dispatch custom event for token expiration or unauthorized
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      const errorMessage =
        (data && (data.error || data.message || data.details)) ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

