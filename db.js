import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Підключено до DB');
  } catch (error) {
    console.error('Помилка підключення до DB:', error);
  }
}