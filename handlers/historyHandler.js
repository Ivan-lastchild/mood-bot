import { Mood } from '../server/models/Mood.js';
import { formatDateToLocal } from '../utils/formatDate.js';

export async function handleHistory(ctx) {
  const history = await Mood.find({ id: ctx.from.id })
    .sort({ timestamp: -1 })
    .limit(5);

  if (history.length === 0) {
    return ctx.reply('Твоя історія пуста 😕');
  }

  const text = history.map((item, i) => {
    const date = item.timestamp
      ? formatDateToLocal(item.timestamp || item.date)
      : item.date || '❓';
    return `${i + 1}. ${date} — ${item.mood}`;
  }).join('\n');

  ctx.reply(`🕓 Останні настрої:\n${text}`);
}