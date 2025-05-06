import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Mood } from '../server/models/Mood.js';

const width = 600;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: 'white',
  chartCallback: (ChartJS) => {
    ChartJS.defaults.font.family = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ChartJS.defaults.color = '#222';
  }
});

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
            '#66bb6a',
            '#ffd54f',
            '#ef5350',
            '#ba68c8',
            '#ff7043'
          ],
          borderRadius: 10,
          barPercentage: 0.6
        }
      ]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '📊 Графік настроїв',
          font: {
            size: 20
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            stepSize: 1,
            font: {
              size: 14
            }
          },
          grid: {
            color: '#eee'
          }
        },
        x: {
          ticks: {
            font: {
              size: 14
            },
            maxRotation: 0,
            minRotation: 0
          },
          grid: {
            color: '#eee'
          }
        }
      }
    }
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

  await ctx.reply(`📊 Ваша особиста статистика:\n\n${textStats}`);
  await ctx.replyWithPhoto({ source: imageBuffer }, { caption: '📈 Графік настроїв' });
}