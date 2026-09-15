import mongoose from 'mongoose';

const assessmentAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    round: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RecruitmentRound',
      required: true,
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        selectedOptionIndex: { type: Number, default: -1 },
        isCorrect: { type: Boolean, default: false },
        marksObtained: { type: Number, default: 0 },
      },
    ],
    totalQuestions: { type: Number, default: 0 },
    attemptedCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    scoreObtained: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One attempt per student per assessment
assessmentAttemptSchema.index({ student: 1, assessment: 1 }, { unique: true });

export const AssessmentAttempt = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
