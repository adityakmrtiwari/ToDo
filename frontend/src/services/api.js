import config from '../config';

const API_URL = config.BACKEND_URL;

export async function fetchWithAuth(url, options = {}) {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
