import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserStats from './UserStats';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = sessionStorage.getItem('admin-auth');
    if (!token) return;

    setIsLoading(true);
    axios.get('http://localhost:3939/api/moods', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setMoods(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ API Error:', err);
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Видалити цей запис?');
    if (!confirmed) return;

    const token = sessionStorage.getItem('admin-auth');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:3939/api/moods/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMoods(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert('❌ Помилка при видаленні');
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage
              moods={moods}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              handleDelete={handleDelete}
              isLoading={isLoading}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:username"
        element={
          <ProtectedRoute>
            <UserStats moods={moods} darkMode={darkMode} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;