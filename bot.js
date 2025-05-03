import { registerMoodListeners } from './handlers/moodHandler.js';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { handleStart } from './handlers/startHandler.js';
import { handleMood } from './handlers/moodHandler.js';
import { handleHistory } from './handlers/historyHandler.js';
import { handleStats } from './handlers/statsHandler.js';
import { connectDB } from './db.js';


dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
registerMoodListeners(bot);
await connectDB();

bot.start(handleStart);
bot.command('mood', handleMood);
bot.command('history', handleHistory);
bot.command('stats', handleStats);

bot.launch().then(() => console.log('Mood Bot запущено ✅'));