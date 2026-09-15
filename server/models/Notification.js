import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'APPLICATION',
        'DEADLINE',
        'SHORTLIST',
        'ASSESSMENT',
        'ROUND_UPDATE',
        'INTERVIEW',
        'OFFER',
        'VERIFICATION',
        'SYSTEM',
      ],
      default: 'SYSTEM',
    },
    link: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
