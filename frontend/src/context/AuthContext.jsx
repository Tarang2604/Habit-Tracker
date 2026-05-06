import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE}/auth/register`, {
        name,
        email,
        password
      });
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      });
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }, []);

  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
