import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
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
    snapshot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApplicationSnapshot',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'APPLIED',
        'SHORTLISTED',
        'ROUND_PENDING',
        'ROUND_IN_PROGRESS',
        'ROUND_PASSED',
        'ROUND_FAILED',
        'INTERVIEW_SCHEDULED',
        'SELECTED',
        'REJECTED',
        'WITHDRAWN',
        'DISQUALIFIED',
        'OFFER_RELEASED',
      ],
      default: 'APPLIED',
      required: true,
    },
    isEligible: {
      type: Boolean,
      default: true,
    },
    eligibilityReasons: [{ type: String }],
    
    // Algorithmic Evaluation
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      skills: { type: Number, default: 0 },
      academics: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      preferences: { type: Number, default: 0 },
      maxPoints: {
        skills: { type: Number, default: 40 },
        academics: { type: Number, default: 20 },
        projects: { type: Number, default: 15 },
        experience: { type: Number, default: 15 },
        preferences: { type: Number, default: 10 },
      },
    },
    rank: {
      type: Number,
      default: null,
    },
    isTopNShortlisted: {
      type: Boolean,
      default: false,
    },

    // Recruitment Round Flow
    currentRoundIndex: {
      type: Number,
      default: 0,
    },
    currentRound: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruitmentRound',
    },
    roundHistory: [
      {
        roundOrder: Number,
        roundName: String,
        roundType: String,
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'PASSED', 'FAILED', 'SKIPPED'],
        },
        score: Number,
        comments: String,
        evaluatedAt: { type: Date, default: Date.now },
      },
    ],
    offerDetails: {
      salaryOrStipend: String,
      joiningDate: Date,
      notes: String,
    },
  },
  { timestamps: true }
);

// Prevent multiple applications by the same student to the same opportunity
applicationSchema.index({ student: 1, opportunity: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
