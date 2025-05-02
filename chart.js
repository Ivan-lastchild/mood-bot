import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fs from 'fs-extra';

const width = 600;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export async function generateMoodChart(stats, userId) {
  const moods = ['😊 Добре', '😐 Нормально', '😞 Погано'];
  const counts = moods.map(mood => stats[mood] || 0);

  const configuration = {
    type: 'bar',
    data: {
      labels: moods,
      datasets: [{
        label: 'Настрої',
        data: counts,
        backgroundColor: ['#4caf50', '#ffc107', '#f44336']
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  const filePath = `./data/stats-${userId}.png`;
  await fs.ensureDir('./data');
  await fs.writeFile(filePath, imageBuffer);
  return filePath;
}