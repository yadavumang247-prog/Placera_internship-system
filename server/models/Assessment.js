import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['MCQ', 'CODING', 'HYBRID'],
      default: 'MCQ',
    },
    instructions: {
      type: String,
      default: '',
    },
    timeLimitMinutes: {
      type: Number,
      default: 45,
    },
    passingPercentage: {
      type: Number,
      default: 60,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
    },
  },
  { timestamps: true }
);

export const Assessment = mongoose.model('Assessment', assessmentSchema);
