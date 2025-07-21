import config from '../config';

const BACKEND_URL = config.BACKEND_URL;

export function loginWithGoogle() {
  window.location.href = `${BACKEND_URL}/auth/google`;
}

export function logout() {
  localStorage.removeItem('jwt_token');
}

export async function getUser() {
  const token = localStorage.getItem('jwt_token');
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.ok) {
      return res.json();
    }
    return null;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
} 