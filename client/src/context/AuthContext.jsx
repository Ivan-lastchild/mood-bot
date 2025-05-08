import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin-auth');
    if (!token) {
      setIsLoading(false);
      return;
    }

    axios.get(`${API_URL}/api/moods`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('❌ Auth check failed:', err.response?.data || err.message);
        localStorage.removeItem('admin-auth'); 
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  const login = async (login, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/login`, { login, password });

      if (res.data.success && res.data.token) {
        localStorage.setItem('admin-auth', res.data.token);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Login error:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);