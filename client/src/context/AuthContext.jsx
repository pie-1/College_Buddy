import { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session on app load
  useEffect(() => {
    const hydrate = async () => {
      try {
        // 1. Try to get a new access token using the refresh cookie
        const refreshRes = await api.post('/auth/refresh');
        setAccessToken(refreshRes.data.accessToken);

        // 2. Fetch user profile using the new access token
        const meRes = await api.get('/auth/me');
        setUser(meRes.data.user);
      } catch (error) {
        // No valid session (or cookie expired) -> stay logged out
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const register = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};