import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['MCQ', 'CODING'],
      default: 'MCQ',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['APTITUDE', 'LOGICAL', 'TECHNICAL', 'DSA', 'VERBAL', 'CORE_CS'],
      default: 'TECHNICAL',
    },
    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
      default: 'MEDIUM',
    },
    marks: {
      type: Number,
      default: 1,
    },
    // MCQ fields
    options: [
      {
        text: { type: String, required: true },
      },
    ],
    correctOptionIndex: {
      type: Number,
      select: false, // Security: do not expose answer directly in bulk queries
    },
    explanation: {
      type: String,
      default: '',
    },
    // Coding Problem fields
    codingDetails: {
      supportedLanguages: [{ type: String, default: ['javascript', 'python', 'java', 'cpp'] }],
      starterCode: {
        javascript: { type: String, default: '// Write your solution here\nfunction solve() {\n  \n}\n' },
        python: { type: String, default: '# Write your solution here\ndef solve():\n    pass\n' },
        java: { type: String, default: 'public class Solution {\n    public static void main(String[] args) {\n        \n    }\n}' },
        cpp: { type: String, default: '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}' },
      },
      testCases: [
        {
          input: String,
          expectedOutput: String,
          isHidden: { type: Boolean, default: false },
          explanation: String,
        },
      ],
      timeLimitMs: { type: Number, default: 2000 },
      memoryLimitMb: { type: Number, default: 256 },
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);
