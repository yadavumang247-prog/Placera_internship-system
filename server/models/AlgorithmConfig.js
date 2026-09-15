import mongoose from 'mongoose';

const algorithmConfigSchema = new mongoose.Schema(
  {
    skillWeight: {
      type: Number,
      default: 0.4,
      min: 0,
      max: 1,
    },
    academicWeight: {
      type: Number,
      default: 0.2,
      min: 0,
      max: 1,
    },
    projectWeight: {
      type: Number,
      default: 0.15,
      min: 0,
      max: 1,
    },
    experienceWeight: {
      type: Number,
      default: 0.15,
      min: 0,
      max: 1,
    },
    preferenceWeight: {
      type: Number,
      default: 0.1,
      min: 0,
      max: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Method to get current active configuration or fallback defaults
algorithmConfigSchema.statics.getActiveConfig = async function () {
  let cfg = await this.findOne({ isActive: true });
  if (!cfg) {
    cfg = await this.create({
      skillWeight: 0.4,
      academicWeight: 0.2,
      projectWeight: 0.15,
      experienceWeight: 0.15,
      preferenceWeight: 0.1,
      isActive: true,
    });
  }
  return cfg;
};

export const AlgorithmConfig = mongoose.model('AlgorithmConfig', algorithmConfigSchema);
