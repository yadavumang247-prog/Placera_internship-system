import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    round: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruitmentRound',
      required: true,
    },
    roundName: {
      type: String,
      default: 'Technical Interview',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    mode: {
      type: String,
      enum: ['ONLINE', 'OFFLINE'],
      default: 'ONLINE',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    interviewers: [{ type: String }],
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'],
      default: 'SCHEDULED',
    },
    rubrics: {
      technicalKnowledge: { type: Number, min: 0, max: 10, default: 0 },
      problemSolving: { type: Number, min: 0, max: 10, default: 0 },
      communication: { type: Number, min: 0, max: 10, default: 0 },
      roleFit: { type: Number, min: 0, max: 10, default: 0 },
      overallScore: { type: Number, min: 0, max: 10, default: 0 },
    },
    verdict: {
      type: String,
      enum: ['PENDING', 'RECOMMENDED_FOR_NEXT_ROUND', 'REJECTED', 'SELECTED'],
      default: 'PENDING',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model('Interview', interviewSchema);
