import mongoose from 'mongoose';

const applicationSnapshotSchema = new mongoose.Schema(
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
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    branch: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, required: true },
    percentage: { type: Number },
    activeBacklogs: { type: Number, default: 0 },
    skills: [{ type: String }],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        role: String,
        githubUrl: String,
        liveUrl: String,
        duration: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
        months: Number,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: String,
        credentialUrl: String,
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        year: String,
      },
    ],
    profiles: {
      github: String,
      linkedin: String,
      portfolio: String,
      codingPlatform: String,
    },
    preferences: {
      preferredRoles: [String],
      preferredDomains: [String],
      preferredLocations: [String],
      workMode: String,
    },
    resumeUrl: { type: String, default: '' },
    resumeName: { type: String, default: '' },
    snapshotTimestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { timestamps: true }
);

export const ApplicationSnapshot = mongoose.model('ApplicationSnapshot', applicationSnapshotSchema);
