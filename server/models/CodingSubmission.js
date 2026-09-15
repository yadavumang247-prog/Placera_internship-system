import mongoose from 'mongoose';

const codingSubmissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'javascript',
    },
    status: {
      type: String,
      enum: ['ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR'],
      default: 'ACCEPTED',
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    testResults: [
      {
        testCaseIndex: Number,
        passed: Boolean,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        errorMessage: String,
      },
    ],
    executionTimeMs: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

export const CodingSubmission = mongoose.model('CodingSubmission', codingSubmissionSchema);
