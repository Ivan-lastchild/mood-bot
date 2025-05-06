import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import '../styles/Loader.css';
import {formatDateToLocal} from '../utils/formatDate';

function MainPage({ moods, darkMode, setDarkMode, handleDelete, isLoading }) {
  const [filterMood, setFilterMood] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const navigate = useNavigate();

  const getStats = () => {
    const counts = {
      '😊 Добре': 0,
      '😐 Нормально': 0,
      '😞 Погано': 0,
      '😫 Втомлено': 0,
      '😡 Злий': 0
    };
    moods.forEach(m => {
      if (counts[m.mood] !== undefined) {
        counts[m.mood]++;
      }
    });
    return counts;
  };

  const stats = getStats();

  const pieData = {
    labels: Object.keys(stats),
    datasets: [
      {
        label: 'Кількість',
        data: Object.values(stats),
        backgroundColor: [
          '#4caf50', '#ffeb3b', '#f44336', '#9c27b0', '#ff5722'
        ],
        borderWidth: 1,
      },
    ],
  };

  const filteredMoods = moods.filter(entry => {
    const matchesMood = filterMood === '' || entry.mood === filterMood;
    const matchesUser = entry.username?.toLowerCase().includes(searchUsername.toLowerCase());
    return matchesMood && matchesUser;
  });

  return (
    <div className="App">
      <div style={{ position: 'relative' }}>
        <h1 style={{ textAlign: 'center', margin: 0 }}>MoodBot Admin Panel</h1>
        <button
          onClick={() => setDarkMode(prev => !prev)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '22px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-color)',
            padding: '6px'
          }}
          title={darkMode ? 'Світла тема' : 'Темна тема'}
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>

      {isLoading ? (
        <div className="section-loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginBottom: '40px' }}>
          <div className="statistics-container">
              <div style={{ flex: 1 }}>
                <h2>📊 Статистика настроїв</h2>
                <ul>
                  {Object.entries(stats).map(([mood, count]) => (
                    <li key={mood}>{mood} — {count}</li>
                  ))}
                </ul>
              </div>

              <div style={{ flex: 1 }}>
                <h2>🧁 Діаграма</h2>
                <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                  <Pie data={pieData} />
                </div>
              </div>
            </div>
          </div>

          <div className="filters" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label>Настрій:</label><br />
              <select value={filterMood} onChange={e => setFilterMood(e.target.value)}>
                <option value="">Усі</option>
                <option value="😊 Добре">😊 Добре</option>
                <option value="😐 Нормально">😐 Нормально</option>
                <option value="😞 Погано">😞 Погано</option>
                <option value="😫 Втомлено">😫 Втомлено</option>
                <option value="😡 Злий">😡 Злий</option>
              </select>
            </div>
            <div>
              <label>Пошук користувача:</label><br />
              <input
                type="text"
                value={searchUsername}
                onChange={e => setSearchUsername(e.target.value)}
                placeholder="user name"
              />
            </div>
          </div>
          <div className="table-wrapper">
          <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Mood</th>
                  <th>Date</th>
                  <th>Дія</th>
                </tr>
              </thead>
              <tbody>
                {filteredMoods.map((mood, index) => (
                  <tr key={index}>
                    <td>{mood.id}</td>
                    <td
                      style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                      onClick={() => navigate(`/user/${mood.username}`)}
                    >
                      {mood.username}
                    </td>
                    <td>{mood.mood}</td>
                    <td>{mood.timestamp
                      ? formatDateToLocal(mood.timestamp || mood.date)
                      : new Date(mood.date).toLocaleDateString('uk-UA')}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(mood._id)}
                        title="Видалити запис"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default MainPage;