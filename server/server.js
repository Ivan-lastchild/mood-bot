import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Mood } from '../models/Mood.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3939;

app.use(cors());
app.use(express.json());

// ✅ Логін: перевіряє login+password, повертає токен
app.post('/api/login', (req, res) => {
  const { login, password } = req.body;

  if (login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, token: process.env.ADMIN_TOKEN });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// ✅ Middleware для перевірки Bearer-токена
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token === process.env.ADMIN_TOKEN) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized' });
};

// ✅ Захищені маршрути
app.use('/api', authMiddleware);

app.get('/api/moods', async (req, res) => {
  const moods = await Mood.find().sort({ date: -1 }).limit(100);
  res.json(moods);
});

app.delete('/api/moods/:id', async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Не вдалося видалити запис' });
  }
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Express API запущено на http://localhost:${PORT}`);
  });
});