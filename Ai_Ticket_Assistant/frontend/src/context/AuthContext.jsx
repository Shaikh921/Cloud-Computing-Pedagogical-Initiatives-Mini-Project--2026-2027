import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ai_ticket_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ai_ticket_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Sync token and user in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('ai_ticket_token', token);
    } else {
      localStorage.removeItem('ai_ticket_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai_ticket_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai_ticket_user');
    }
  }, [user]);

  // Handle unauthorized event across tabs/windows
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const data = await authApi.signup(payload);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout().catch(() => {});
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('ai_ticket_token');
      localStorage.removeItem('ai_ticket_user');
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      isModerator: user?.role === 'moderator',
      isStaff: user?.role === 'admin' || user?.role === 'moderator',
      login,
      signup,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

