import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['MONGODB_URI', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[warn] Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sms_scheduler',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
};
