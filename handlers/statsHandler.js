import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Mood } from '../server/models/Mood.js';

const width = 600;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export async function handleStats(ctx) {
  const userId = ctx.from.id;

  const moods = await Mood.find({ id: userId });

  if (moods.length === 0) {
    return ctx.reply('Немає даних для статистики.');
  }

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

  const textStats = Object.entries(counts)
    .map(([mood, count]) => `${mood} — ${count}`)
    .join('\n');

  const configuration = {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Кількість',
          data: Object.values(counts),
          backgroundColor: [
            '#4caf50',
            '#ffeb3b',
            '#f44336',
            '#9c27b0',
            '#ff5722'
          ],
          borderRadius: 8
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#000'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
            color: '#000'
          },
          grid: {
            color: '#ccc'
          }
        },
        x: {
          ticks: {
            color: '#000',
            maxRotation: 0,
            minRotation: 0
          },
          grid: {
            color: '#ccc'
          }
        }
      }
    }
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

  await ctx.reply(`📊 Ваша особиста статистика:

${textStats}`);
  await ctx.replyWithPhoto({ source: imageBuffer }, { caption: '📈 Графік настроїв' });
}