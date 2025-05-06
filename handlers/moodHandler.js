import { Markup } from 'telegraf';
import { Mood } from '../server/models/Mood.js';

export function handleMood(ctx) {
  return ctx.reply('Як ти себе почуваєш сьогодні?', Markup.inlineKeyboard([
    [Markup.button.callback('😊 Добре', 'mood_good')],
    [Markup.button.callback('😐 Нормально', 'mood_neutral')],
    [Markup.button.callback('😞 Погано', 'mood_bad')],
    [Markup.button.callback('😫 Втомлено', 'mood_tired')],
    [Markup.button.callback('😡 Злий', 'mood_angry')]
  ]));
}

export function registerMoodListeners(bot) {
  const moodMap = {
    mood_good: '😊 Добре',
    mood_neutral: '😐 Нормально',
    mood_bad: '😞 Погано',
    mood_tired: '😫 Втомлено',
    mood_angry: '😡 Злий'
  };

  Object.entries(moodMap).forEach(([action, mood]) => {
    bot.action(action, async (ctx) => {
      function getRandomFollowUpQuestion() {
        const questions = [
          '🙂 Ще раз поділишся своїм станом?',
          '🫶 Можливо, настрій змінився?'
        ];
        return questions[Math.floor(Math.random() * questions.length)];
      }

      async function askIfMore(ctx) {
        const question = getRandomFollowUpQuestion();
        await ctx.reply(question, Markup.inlineKeyboard([
          [Markup.button.callback('✅ Так', 'yes_more')],
          [Markup.button.callback('❌ Ні', 'no_more')]
        ]));
      }

      await ctx.editMessageReplyMarkup();

      const username = ctx.from.username || `id_${ctx.from.id}`;

      await Mood.create({
        id: ctx.from.id,
        username,
        mood,
        timestamp: new Date().toISOString()
      });

      await ctx.answerCbQuery();
      await ctx.reply(`✅ Твій настрій "${mood}" збережено!`);
      await askIfMore(ctx);
    });

    bot.action('yes_more', async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup();
      return handleMood(ctx);
    });

    bot.action('no_more', async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup();
      return ctx.reply('Дякую за щирість! 🙏 Гарного дня ☀️');
    });
  });
}