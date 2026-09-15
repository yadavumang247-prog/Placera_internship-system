import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      required: true,
      default: 'Technology / Software',
    },
    companySize: {
      type: String,
      default: '50-200 employees',
    },
    location: {
      type: String,
      default: 'Bangalore, India',
    },
    description: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    tier: {
      type: String,
      enum: ['TIER_1', 'DREAM', 'REGULAR', 'STARTUP'],
      default: 'REGULAR',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', organizationSchema);
