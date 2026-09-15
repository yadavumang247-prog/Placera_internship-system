import { Interview } from '../models/Interview.js';
import { Application } from '../models/Application.js';
import { Opportunity } from '../models/Opportunity.js';
import { RecruitmentRound } from '../models/RecruitmentRound.js';
import { Notification } from '../models/Notification.js';

// POST /api/interviews
export const scheduleInterview = async (req, res, next) => {
  try {
    const {
      applicationId,
      roundId,
      scheduledAt,
      durationMinutes = 45,
      mode = 'ONLINE',
      meetingLink = '',
      location = '',
      interviewers = [],
    } = req.body;

    const application = await Application.findById(applicationId).populate('opportunity');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const round = await RecruitmentRound.findById(roundId || application.currentRound);
    if (!round) {
      return res.status(404).json({ success: false, message: 'Recruitment round not found.' });
    }

    const interview = await Interview.create({
      application: application._id,
      student: application.student,
      opportunity: application.opportunity._id,
      round: round._id,
      roundName: round.name,
      scheduledAt: new Date(scheduledAt),
      durationMinutes,
      mode,
      meetingLink,
      location,
      interviewers,
      status: 'SCHEDULED',
    });

    application.status = 'INTERVIEW_SCHEDULED';
    await application.save();

    await Notification.create({
      recipient: application.student,
      title: 'Interview Scheduled',
      message: `Your ${round.name} for ${application.opportunity.title} has been scheduled for ${new Date(
        scheduledAt
      ).toLocaleString()}.`,
      type: 'INTERVIEW',
      link: `/student/interviews`,
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully.',
      interview,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/interviews
export const getInterviews = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'STUDENT') {
      query.student = req.user._id;
    } else if (req.user.role === 'RECRUITER') {
      const opps = await Opportunity.find({ recruiter: req.user._id }).select('_id');
      query.opportunity = { $in: opps.map((o) => o._id) };
    }

    const interviews = await Interview.find(query)
      .populate({
        path: 'opportunity',
        select: 'title organization',
        populate: { path: 'organization', select: 'name logo' },
      })
      .populate({
        path: 'application',
        select: 'snapshot status',
        populate: { path: 'snapshot', select: 'fullName email branch cgpa' },
      })
      .populate('round', 'name type')
      .sort({ scheduledAt: 1 })
      .lean();

    res.json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/interviews/:id/evaluate
export const evaluateInterview = async (req, res, next) => {
  try {
    const { rubrics, verdict, notes } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }

    interview.rubrics = {
      ...interview.rubrics,
      ...rubrics,
    };
    interview.verdict = verdict || 'RECOMMENDED_FOR_NEXT_ROUND';
    interview.notes = notes || '';
    interview.status = 'COMPLETED';
    await interview.save();

    // Update application
    const application = await Application.findById(interview.application);
    if (application) {
      const passed = verdict === 'RECOMMENDED_FOR_NEXT_ROUND' || verdict === 'SELECTED';
      application.roundHistory.push({
        roundOrder: application.currentRoundIndex + 1,
        roundName: interview.roundName,
        roundType: 'TECHNICAL_INTERVIEW',
        status: passed ? 'PASSED' : 'FAILED',
        score: rubrics && rubrics.overallScore ? rubrics.overallScore * 10 : 80,
        comments: notes || `Interview evaluated with verdict: ${verdict}`,
        evaluatedAt: new Date(),
      });

      if (verdict === 'SELECTED') {
        application.status = 'SELECTED';
      } else if (verdict === 'REJECTED') {
        application.status = 'REJECTED';
      } else {
        application.status = 'ROUND_PASSED';
      }

      await application.save();
    }

    res.json({
      success: true,
      message: 'Interview evaluation recorded.',
      interview,
    });
  } catch (err) {
    next(err);
  }
};
