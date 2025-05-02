import { useParams, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import './userStats.css';
import './styles/Loader.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const moodLabels = ['😊 Добре', '😐 Нормально', '😞 Погано', '😫 Втомлено', '😡 Злий'];

function UserStats({ moods, darkMode }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const filtered = moods.filter(m => m.username === username);
    setUserData(filtered);
    setIsLoading(false);
  }, [moods, username]);

  const moodCounts = moodLabels.map(label =>
    userData.filter(entry => entry.mood === label).length
  );

  const chartData = {
    labels: moodLabels,
    datasets: [
      {
        label: 'Кількість',
        data: moodCounts,
        backgroundColor: '#4caf50',
      },
    ],
  };

  return (
    <div className={`user-stats-container ${darkMode ? 'dark' : ''}`}>
      <h2>Статистика для @{username}</h2>
      {isLoading ? (
        <div className="section-loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <p>Загальна кількість записів: {userData.length}</p>
          <div className="chart-wrapper">
            <Bar data={chartData} />
          </div>
        </>
      )}
      <button className="back-button" onClick={() => navigate('/')}>⬅ Назад</button>
    </div>
  );
}

export default UserStats;