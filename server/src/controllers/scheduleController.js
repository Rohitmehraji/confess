import { Contact } from '../models/Contact.js';
import { Device } from '../models/Device.js';
import { ScheduledMessage } from '../models/ScheduledMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseScheduledDateTime } from '../utils/validators.js';
import { scheduleMessageJob } from '../services/schedulerService.js';

export const createSchedule = asyncHandler(async (req, res) => {
  const { contactIds, deviceIds, message, date, hour, minute, second } = req.body;

  if (!Array.isArray(contactIds) || !contactIds.length || !Array.isArray(deviceIds) || !deviceIds.length || !message) {
    return res.status(400).json({ message: 'contactIds, deviceIds and message are required.' });
  }

  const scheduledDateTime = parseScheduledDateTime({ date, hour, minute, second });

  const contacts = await Contact.find({ _id: { $in: contactIds } });
  const devices = await Device.find({ _id: { $in: deviceIds } });

  if (!contacts.length || !devices.length) {
    return res.status(404).json({ message: 'Contacts or devices not found.' });
  }

  const docs = [];
  contacts.forEach((contact) => {
    devices.forEach((device) => {
      docs.push({
        contactId: contact._id,
        deviceId: device._id,
        message,
        scheduledDateTime,
        status: 'pending',
      });
    });
  });

  const created = await ScheduledMessage.insertMany(docs);
  created.forEach(scheduleMessageJob);

  res.status(201).json({
    message: 'Messages scheduled successfully',
    totalScheduled: created.length,
  });
});

export const getScheduledMessages = asyncHandler(async (_req, res) => {
  const messages = await ScheduledMessage.find()
    .populate('contactId', 'name phone')
    .populate('deviceId', 'phone label')
    .sort({ scheduledDateTime: 1 });

  res.json(messages);
});
