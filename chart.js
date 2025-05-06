import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

const width = 600;
const height = 400;

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  chartCallback: (ChartJS) => {
    ChartJS.defaults.font.family = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ChartJS.defaults.color = '#333';
  }
});

export async function generateMoodChart(stats) {
  const moods = ['😊 Добре', '😐 Нормально', '😞 Погано', '🥱 Втомлено', '😡 Злий'];
  const counts = moods.map(mood => stats[mood] || 0);

  const configuration = {
    type: 'bar',
    data: {
      labels: moods,
      datasets: [{
        label: 'Кількість',
        data: counts,
        backgroundColor: ['#66bb6a', '#ffd54f', '#ef5350', '#ba68c8', '#ff7043'],
        borderRadius: 6,
        barPercentage: 0.6,
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: '📊 Графік настроїв',
          font: { size: 20 },
          padding: { top: 10, bottom: 20 }
        }
      },
      scales: {
        x: {
          ticks: { font: { size: 14 } }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0, stepSize: 1, font: { size: 14 } },
          grid: { color: '#e0e0e0' }
        }
      }
    }
  };

  // 👇 Повертає лише Buffer
  return await chartJSNodeCanvas.renderToBuffer(configuration);
}