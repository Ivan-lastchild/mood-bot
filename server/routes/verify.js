import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token === process.env.ADMIN_TOKEN) {
    return res.json({ valid: true });
  }

  return res.status(401).json({ valid: false });
});

export default router;