import { Device } from '../models/Device.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidPhone } from '../utils/validators.js';

export const addDevice = asyncHandler(async (req, res) => {
  const { phone, label } = req.body;
  if (!isValidPhone(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  const device = await Device.create({ phone, label: label || '' });
  res.status(201).json(device);
});

export const getDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find().sort({ createdAt: -1 });
  res.json(devices);
});
