import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    label: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Device = mongoose.model('Device', deviceSchema);
