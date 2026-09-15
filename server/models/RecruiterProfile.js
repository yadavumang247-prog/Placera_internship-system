import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: 'University Recruiter',
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    verificationDocumentUrl: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);
