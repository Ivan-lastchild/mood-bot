import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  id: Number,
  username: String,
  mood: String,
  timestamp: String,
});

export const Mood = mongoose.model('Mood', moodSchema);