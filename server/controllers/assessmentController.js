import { Assessment } from '../models/Assessment.js';
import { Question } from '../models/Question.js';
import { AssessmentAttempt } from '../models/AssessmentAttempt.js';
import { CodingSubmission } from '../models/CodingSubmission.js';
import { Application } from '../models/Application.js';
import { RecruitmentRound } from '../models/RecruitmentRound.js';
import { CodeExecutionService } from '../services/codeExecutionService.js';

// GET /api/assessments
export const getStudentAssessments = async (req, res, next) => {
  try {
    let assessments = [];
    if (req.user.role === 'STUDENT') {
      const applications = await Application.find({ student: req.user._id }).select('opportunity').lean();
      const oppIds = applications.map((a) => a.opportunity);

      assessments = await Assessment.find({
        $or: [{ opportunity: { $in: oppIds } }, { status: 'PUBLISHED' }],
      })
        .populate({
          path: 'opportunity',
          populate: { path: 'organization' },
        })
        .populate('round')
        .lean();

      const attempts = await AssessmentAttempt.find({ student: req.user._id }).lean();
      const attemptMap = {};
      attempts.forEach((att) => {
        attemptMap[att.assessment.toString()] = att;
      });

      assessments = assessments.map((a) => ({
        ...a,
        attempt: attemptMap[a._id.toString()] || null,
      }));
    } else {
      assessments = await Assessment.find()
        .populate({
          path: 'opportunity',
          populate: { path: 'organization' },
        })
        .populate('round')
        .lean();
    }

    res.json({ success: true, count: assessments.length, assessments });
  } catch (err) {
    next(err);
  }
};

// GET /api/assessments/:id
export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate({
        path: 'questions',
        select: '-correctOptionIndex', // Do not send correct answers to frontend
      })
      .populate('round')
      .lean();

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    // Check if student already attempted
    let existingAttempt = null;
    if (req.user.role === 'STUDENT') {
      existingAttempt = await AssessmentAttempt.findOne({
        student: req.user._id,
        assessment: assessment._id,
      }).lean();
    }

    res.json({
      success: true,
      assessment,
      alreadyAttempted: !!existingAttempt,
      attempt: existingAttempt,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/assessments/:id/submit
export const submitMcqAssessment = async (req, res, next) => {
  try {
    const { answers, timeSpentSeconds, applicationId } = req.body;
    // answers format: [{ questionId, selectedOptionIndex }]

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    // Check if already attempted
    const existing = await AssessmentAttempt.findOne({
      student: req.user._id,
      assessment: assessment._id,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assessment. Resubmissions are prohibited.',
        attempt: existing,
      });
    }

    // Fetch questions with correct answers to compute score
    const questions = await Question.find({ _id: { $in: assessment.questions } }).select('+correctOptionIndex');

    let totalMarks = 0;
    let scoreObtained = 0;
    let correctCount = 0;
    let attemptedCount = 0;
    const evaluatedAnswers = [];

    for (const q of questions) {
      const qIdStr = q._id.toString();
      totalMarks += q.marks || 1;

      const userAns = (answers || []).find((a) => a.questionId === qIdStr);
      const selectedIndex = userAns && userAns.selectedOptionIndex !== undefined ? userAns.selectedOptionIndex : -1;

      const isAttempted = selectedIndex !== -1;
      if (isAttempted) attemptedCount++;

      const isCorrect = selectedIndex === q.correctOptionIndex;
      let marksEarned = 0;

      if (isCorrect) {
        correctCount++;
        marksEarned = q.marks || 1;
        scoreObtained += marksEarned;
      }

      evaluatedAnswers.push({
        question: q._id,
        selectedOptionIndex: selectedIndex,
        isCorrect,
        marksObtained: marksEarned,
      });
    }

    const incorrectCount = attemptedCount - correctCount;
    const percentage = totalMarks > 0 ? Number(((scoreObtained / totalMarks) * 100).toFixed(1)) : 0;
    const passed = percentage >= (assessment.passingPercentage || 60);

    const attempt = await AssessmentAttempt.create({
      student: req.user._id,
      assessment: assessment._id,
      application: applicationId,
      round: assessment.round,
      answers: evaluatedAnswers,
      totalQuestions: questions.length,
      attemptedCount,
      correctCount,
      incorrectCount,
      totalMarks,
      scoreObtained,
      percentage,
      passed,
      timeSpentSeconds: timeSpentSeconds || 0,
      submittedAt: new Date(),
    });

    // Update Application Round Status
    if (applicationId) {
      const application = await Application.findById(applicationId);
      if (application) {
        const round = await RecruitmentRound.findById(assessment.round);
        if (round) {
          application.roundHistory.push({
            roundOrder: round.roundOrder,
            roundName: round.name,
            roundType: round.type,
            status: passed ? 'PASSED' : 'FAILED',
            score: percentage,
            comments: `Assessment completed. Score: ${percentage}% (${passed ? 'PASSED' : 'FAILED'}).`,
            evaluatedAt: new Date(),
          });

          if (passed) {
            application.status = 'ROUND_PASSED';
          } else {
            application.status = 'REJECTED';
          }
          await application.save();
        }
      }
    }

    res.json({
      success: true,
      message: 'Assessment submitted successfully.',
      result: {
        totalQuestions: questions.length,
        attemptedCount,
        correctCount,
        incorrectCount,
        totalMarks,
        scoreObtained,
        percentage,
        passingPercentage: assessment.passingPercentage,
        passed,
      },
      attemptId: attempt._id,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/coding/run
export const runCodingCode = async (req, res, next) => {
  try {
    const { questionId, language = 'javascript', code } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // Only run against public test cases for preview
    const publicTestCases = (question.codingDetails.testCases || []).filter((tc) => !tc.isHidden);

    const evaluation = await CodeExecutionService.runTests(language, code, publicTestCases);

    res.json({
      success: true,
      evaluation,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/coding/submit
export const submitCodingCode = async (req, res, next) => {
  try {
    const { questionId, language = 'javascript', code, applicationId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // Evaluate all test cases (both public and hidden)
    const allTestCases = question.codingDetails.testCases || [];
    const evaluation = await CodeExecutionService.runTests(language, code, allTestCases);

    const submission = await CodingSubmission.create({
      student: req.user._id,
      question: question._id,
      application: applicationId,
      code,
      language,
      status: evaluation.status,
      passedTestCases: evaluation.passedTestCases,
      totalTestCases: evaluation.totalTestCases,
      testResults: evaluation.testResults,
      executionTimeMs: evaluation.executionTimeMs,
    });

    const passed = evaluation.status === 'ACCEPTED';

    // If attached to application, update status
    if (applicationId) {
      const application = await Application.findById(applicationId);
      if (application) {
        application.roundHistory.push({
          roundOrder: application.currentRoundIndex + 1,
          roundName: 'Coding Assessment',
          roundType: 'CODING',
          status: passed ? 'PASSED' : 'FAILED',
          score: Math.round((evaluation.passedTestCases / Math.max(1, evaluation.totalTestCases)) * 100),
          comments: `Code submission evaluated: ${evaluation.status} (${evaluation.passedTestCases}/${evaluation.totalTestCases} test cases passed).`,
          evaluatedAt: new Date(),
        });
        if (passed) {
          application.status = 'ROUND_PASSED';
        }
        await application.save();
      }
    }

    res.json({
      success: true,
      message: passed ? 'Code accepted! All test cases passed.' : 'Solution did not pass all test cases.',
      submission,
      evaluation,
    });
  } catch (err) {
    next(err);
  }
};
