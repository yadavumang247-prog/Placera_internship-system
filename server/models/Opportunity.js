import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['INTERNSHIP', 'FULL_TIME', 'INTERNSHIP_PPO'],
      default: 'INTERNSHIP',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'Engineering',
    },

    // Strict Eligibility Criteria
    allowedDegrees: [{ type: String }],
    allowedBranches: [{ type: String }],
    minCgpa: {
      type: Number,
      required: true,
      default: 6.0,
      min: 0,
      max: 10,
    },
    requiredSkills: [{ type: String, trim: true }], // Mandatory skills
    preferredSkills: [{ type: String, trim: true }], // Good to have skills
    requiredExperienceMonths: {
      type: Number,
      default: 0,
    },
    graduationYears: [{ type: Number }], // Eligible graduating batches
    maxBacklogs: {
      type: Number,
      default: 0,
    },

    // Logistics & Compensation
    location: {
      type: String,
      default: 'Bangalore, India',
    },
    workMode: {
      type: String,
      enum: ['REMOTE', 'HYBRID', 'ON_SITE'],
      default: 'HYBRID',
    },
    stipendOrSalary: {
      type: String,
      required: true,
    },
    vacancies: {
      type: Number,
      required: true,
      default: 5, // Top-N shortlist size
      min: 1,
    },

    // Timeline & Locks
    applicationOpeningDate: {
      type: Date,
      default: Date.now,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'DEADLINE_CLOSED', 'COMPLETED', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    shortlistGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual to check if application deadline has passed
opportunitySchema.virtual('isDeadlinePassed').get(function () {
  return new Date() > new Date(this.applicationDeadline);
});

opportunitySchema.set('toJSON', { virtuals: true });
opportunitySchema.set('toObject', { virtuals: true });

export const Opportunity = mongoose.model('Opportunity', opportunitySchema);
