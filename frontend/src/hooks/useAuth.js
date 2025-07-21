import { useState, useEffect, useCallback } from 'react';
import { loginWithGoogle, logout as logoutService, getUser as getUserService } from '../services/auth';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const res = await getUserService();
    setUser(res && res.user);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = loginWithGoogle;
  const logout = () => {
    logoutService();
    setUser(null);
  };

  return { user, loading, login, logout, refreshUser };
} 