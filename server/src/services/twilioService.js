import twilio from 'twilio';
import { env } from '../config/env.js';

const hasTwilioCreds = env.twilioAccountSid && env.twilioAuthToken;
const client = hasTwilioCreds ? twilio(env.twilioAccountSid, env.twilioAuthToken) : null;

export const sendSms = async ({ from, to, body }) => {
  if (!client) {
    throw new Error('Twilio credentials are not configured.');
  }

  return client.messages.create({ from, to, body });
};
