import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('admin-auth');
    if (!token) {
      setIsLoading(false);
      return;
    }

    axios.get('http://localhost:3939/api/moods', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch(() => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  const login = async (login, password) => {
    try {
      const res = await axios.post('http://localhost:3939/api/login', { login, password });

      if (res.data.success && res.data.token) {
        sessionStorage.setItem('admin-auth', res.data.token);
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
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);