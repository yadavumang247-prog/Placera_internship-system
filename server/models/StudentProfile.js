import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: [{ type: String, trim: true }],
  role: { type: String, default: 'Developer' },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  duration: { type: String, default: '' },
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  duration: { type: String, default: '' }, // e.g. "6 months" or "Jun 2025 - Aug 2025"
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  months: { type: Number, default: 0 },
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  year: { type: String, default: '' },
});

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Personal Information
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    dateOfBirth: { type: Date },
    profilePhoto: { type: String, default: '' },
    location: { type: String, default: '' },
    headline: { type: String, default: 'Aspiring Software Engineer' },

    // Academic Information
    college: { type: String, default: 'National Institute of Technology' },
    university: { type: String, default: 'State Technical University' },
    degree: { type: String, default: 'B.Tech' },
    branch: { type: String, required: true }, // e.g. 'Computer Science & Engineering'
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    percentage: { type: Number, min: 0, max: 100 },
    tenthPercentage: { type: Number, min: 0, max: 100 },
    twelfthPercentage: { type: Number, min: 0, max: 100 },
    activeBacklogs: { type: Number, default: 0 },

    // Skills
    skills: [{ type: String, trim: true }], // Normalized list of technical skills
    softSkills: [{ type: String, trim: true }],

    // Projects, Certs, Experience, Achievements
    projects: [projectSchema],
    certifications: [certificationSchema],
    experience: [experienceSchema],
    achievements: [achievementSchema],

    // External Profiles
    profiles: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      codingPlatform: { type: String, default: '' }, // LeetCode / Codeforces
    },

    // Preferences
    preferences: {
      preferredRoles: [{ type: String }],
      preferredDomains: [{ type: String }],
      preferredLocations: [{ type: String }],
      workMode: {
        type: String,
        enum: ['REMOTE', 'HYBRID', 'ON_SITE', 'ANY'],
        default: 'ANY',
      },
      opportunityType: {
        type: String,
        enum: ['INTERNSHIP', 'FULL_TIME', 'BOTH'],
        default: 'BOTH',
      },
      expectedStipendOrSalary: { type: String, default: '' },
    },

    // Resume
    resumeUrl: { type: String, default: '' },
    resumeName: { type: String, default: '' },

    // Verification
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    verificationDocumentUrl: { type: String, default: '' },
    verificationNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Virtual for calculating profile completeness percentage
studentProfileSchema.virtual('profileCompleteness').get(function () {
  let score = 0;
  if (this.fullName) score += 10;
  if (this.phone) score += 5;
  if (this.branch && this.cgpa) score += 20;
  if (this.skills && this.skills.length >= 3) score += 20;
  if (this.projects && this.projects.length >= 1) score += 15;
  if (this.experience && this.experience.length >= 1) score += 10;
  if (this.resumeUrl) score += 10;
  if (this.preferences && this.preferences.preferredRoles.length > 0) score += 10;
  return Math.min(score, 100);
});

studentProfileSchema.set('toJSON', { virtuals: true });
studentProfileSchema.set('toObject', { virtuals: true });

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
