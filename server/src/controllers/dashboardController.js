import { Contact } from '../models/Contact.js';
import { Device } from '../models/Device.js';
import { ScheduledMessage } from '../models/ScheduledMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [totalContacts, totalDevices, totalScheduled, totalSent, upcoming, sentLogs] = await Promise.all([
    Contact.countDocuments(),
    Device.countDocuments(),
    ScheduledMessage.countDocuments(),
    ScheduledMessage.countDocuments({ status: 'sent' }),
    ScheduledMessage.find({ scheduledDateTime: { $gte: new Date() }, status: 'pending' })
      .populate('contactId', 'name phone')
      .populate('deviceId', 'phone')
      .sort({ scheduledDateTime: 1 })
      .limit(10),
    ScheduledMessage.find({ status: { $in: ['sent', 'failed'] } })
      .populate('contactId', 'name phone')
      .populate('deviceId', 'phone')
      .sort({ updatedAt: -1 })
      .limit(20),
  ]);

  res.json({ totalContacts, totalDevices, totalScheduled, totalSent, upcoming, sentLogs });
});
