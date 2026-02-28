import cron from 'node-cron';
import { ScheduledMessage } from '../models/ScheduledMessage.js';
import { sendSms } from './twilioService.js';

const scheduledJobs = new Map();

const toCronExpression = (date) => {
  const d = new Date(date);
  return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
};

export const scheduleMessageJob = (messageDoc) => {
  const runAt = new Date(messageDoc.scheduledDateTime);
  if (runAt < new Date()) {
    return;
  }

  const expression = toCronExpression(runAt);
  const job = cron.schedule(
    expression,
    async () => {
      try {
        const populated = await ScheduledMessage.findById(messageDoc._id)
          .populate('contactId')
          .populate('deviceId');

        if (!populated || populated.status !== 'pending') {
          job.stop();
          scheduledJobs.delete(String(messageDoc._id));
          return;
        }

        const twilioRes = await sendSms({
          from: populated.deviceId.phone,
          to: populated.contactId.phone,
          body: populated.message,
        });

        populated.status = 'sent';
        populated.sentAt = new Date();
        populated.twilioSid = twilioRes.sid;
        await populated.save();
      } catch (error) {
        await ScheduledMessage.findByIdAndUpdate(messageDoc._id, {
          status: 'failed',
          errorMessage: error.message,
        });
      } finally {
        job.stop();
        scheduledJobs.delete(String(messageDoc._id));
      }
    },
    { timezone: 'UTC' }
  );

  scheduledJobs.set(String(messageDoc._id), job);
};

export const restorePendingSchedules = async () => {
  const pending = await ScheduledMessage.find({ status: 'pending', scheduledDateTime: { $gte: new Date() } });
  pending.forEach(scheduleMessageJob);
};
