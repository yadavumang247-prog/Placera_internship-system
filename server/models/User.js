import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['STUDENT', 'RECRUITER', 'ADMIN', 'COLLEGE_ADMIN'],
      default: 'STUDENT',
      required: true,
    },
    adminType: {
      type: String,
      enum: ['PLATFORM_ADMIN', 'COLLEGE_ADMIN'],
      default: 'PLATFORM_ADMIN',
    },
    collegeName: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    verificationProof: {
      documentType: { type: String, default: 'INSTITUTION_ID' },
      documentUrl: { type: String, default: '' },
      sheerIdCode: { type: String, default: '' },
      verifiedAt: { type: Date },
      notes: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
