// routes/login.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/', (req, res) => {
  const { login, password } = req.body;

  if (login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, token: process.env.ADMIN_TOKEN });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

export default router;