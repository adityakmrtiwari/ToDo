import config from '../config';

const BACKEND_URL = config.BACKEND_URL;

export function loginWithGoogle() {
  window.location.href = `${BACKEND_URL}/auth/google`;
}

export async function logout() {
  await fetch(`${BACKEND_URL}/logout`, {
    method: 'GET',
    credentials: 'include',
  });
}

export async function getUser() {
  const res = await fetch(`${BACKEND_URL}/auth/user`, {
    credentials: 'include',
  });
  if (res.ok) {
    return res.json();
  }
  return null;
} 