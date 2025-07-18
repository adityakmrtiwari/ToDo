import config from '../config';

const BACKEND_URL = config.BACKEND_URL;

export function loginWithGoogle() {
  try {
    window.location.href = `${BACKEND_URL}/auth/google`;
  } catch (err) {
    alert('Login failed: ' + err.message);
    console.error('Login error:', err);
  }
}

export async function logout() {
  try {
    const res = await fetch(`${BACKEND_URL}/logout`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
  } catch (err) {
    alert('Logout failed: ' + err.message);
    console.error('Logout error:', err);
  }
}

export async function getUser() {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/user`, {
      credentials: 'include',
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