import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('[db] MongoDB connected');
};
