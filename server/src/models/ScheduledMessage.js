import mongoose from 'mongoose';

const scheduledMessageSchema = new mongoose.Schema(
  {
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    message: { type: String, required: true, trim: true, maxlength: 1600 },
    scheduledDateTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    errorMessage: { type: String, default: '' },
    sentAt: { type: Date },
    twilioSid: { type: String, default: '' },
  },
  { timestamps: true }
);

scheduledMessageSchema.index({ scheduledDateTime: 1, status: 1 });

export const ScheduledMessage = mongoose.model('ScheduledMessage', scheduledMessageSchema);
