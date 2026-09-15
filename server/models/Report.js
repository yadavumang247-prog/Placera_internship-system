import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['OPPORTUNITY', 'RECRUITER', 'STUDENT', 'SYSTEM'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    category: {
      type: String,
      enum: ['FRAUD', 'MISLEADING_CRITERIA', 'UNPROFESSIONAL_BEHAVIOR', 'TECHNICAL_BUG', 'OTHER'],
      default: 'OTHER',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'OPEN',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);
