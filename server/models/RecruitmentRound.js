import mongoose from 'mongoose';

const recruitmentRoundSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    roundOrder: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'MCQ',
        'APTITUDE',
        'CODING',
        'TECHNICAL_INTERVIEW',
        'MANAGERIAL_INTERVIEW',
        'HR_INTERVIEW',
        'CUSTOM',
      ],
      default: 'MCQ',
      required: true,
    },
    passingScore: {
      type: Number,
      default: 60, // e.g. 60%
    },
    timeLimitMinutes: {
      type: Number,
      default: 60,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    instructions: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'COMPLETED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const RecruitmentRound = mongoose.model('RecruitmentRound', recruitmentRoundSchema);
