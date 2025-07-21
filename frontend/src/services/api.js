import config from '../config';

const API_URL = config.BACKEND_URL;

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
