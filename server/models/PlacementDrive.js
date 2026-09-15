import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: String,
      required: true, // e.g. "2025-2026"
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    eligibleBatches: [{ type: Number }], // e.g. [2025, 2026]
    eligibleDepartments: [{ type: String }],
    participatingOrganizations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
      },
    ],
    status: {
      type: String,
      enum: ['UPCOMING', 'ACTIVE', 'COMPLETED'],
      default: 'ACTIVE',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);
