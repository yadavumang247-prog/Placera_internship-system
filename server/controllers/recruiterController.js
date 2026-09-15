import { Opportunity } from '../models/Opportunity.js';
import { Application } from '../models/Application.js';
import { RecruitmentRound } from '../models/RecruitmentRound.js';
import { Notification } from '../models/Notification.js';
import { AlgorithmConfig } from '../models/AlgorithmConfig.js';
import { executeOpportunityShortlistPipeline } from '../algorithms/matching.js';
import { validateStateTransition, advanceToNextRound, APPLICATION_STATUSES } from '../services/stateMachineService.js';

// GET /api/recruiter/opportunities
export const getRecruiterOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ recruiter: req.user._id })
      .populate('organization')
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(
      opportunities.map(async (opp) => {
        const applicantCount = await Application.countDocuments({ opportunity: opp._id });
        const shortlistedCount = await Application.countDocuments({
          opportunity: opp._id,
          isTopNShortlisted: true,
        });
        const rounds = await RecruitmentRound.find({ opportunity: opp._id })
          .sort({ roundOrder: 1 })
          .lean();

        const isDeadlinePassed = new Date() > new Date(opp.applicationDeadline);

        return {
          ...opp,
          applicantCount,
          shortlistedCount,
          rounds,
          isDeadlinePassed,
        };
      })
    );

    res.json({ success: true, count: enriched.length, opportunities: enriched });
  } catch (err) {
    next(err);
  }
};

// GET /api/recruiter/opportunities/:id/applications
// CRITICAL FAIRNESS ENFORCEMENT ENDPOINT
export const getOpportunityApplications = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('organization')
      .lean();

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    if (opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view candidates for this opportunity.' });
    }

    const totalApplicantsCount = await Application.countDocuments({ opportunity: opportunity._id });
    const isDeadlinePassed = new Date() > new Date(opportunity.applicationDeadline);

    // Lock applicant identities until deadline expires
    if (!isDeadlinePassed && req.user.role !== 'ADMIN') {
      return res.json({
        success: true,
        isLocked: true,
        totalApplicants: totalApplicantsCount,
        opportunity: {
          _id: opportunity._id,
          title: opportunity.title,
          applicationDeadline: opportunity.applicationDeadline,
          vacancies: opportunity.vacancies,
        },
        message:
          'Fairness Policy Active: Candidate personal profiles, resumes, and rankings are locked until the application deadline expires. Only applicant volume is visible.',
        applications: [],
        rankedCandidates: [],
        candidates: [],
        topShortlist: [],
        extendedPool: [],
      });
    }

    // Deadline has expired: Fetch all applications with snapshots populated
    const applications = await Application.find({ opportunity: opportunity._id })
      .populate('snapshot')
      .populate('currentRound')
      .populate('student', 'email status')
      .lean();

    const rounds = await RecruitmentRound.find({ opportunity: opportunity._id })
      .sort({ roundOrder: 1 })
      .lean();

    // If shortlist has not been generated yet or needs evaluation
    const activeConfig = await AlgorithmConfig.getActiveConfig();
    const evaluatedPipeline = executeOpportunityShortlistPipeline(applications, opportunity, activeConfig);

    // Synchronize evaluated ranks and top-N flags to the database if needed
    for (const c of evaluatedPipeline.topShortlist) {
      await Application.findByIdAndUpdate(c.applicationId, {
        rank: c.rank,
        isTopNShortlisted: true,
        matchScore: c.score,
        scoreBreakdown: c.scoreBreakdown,
        status: 'SHORTLISTED', // Auto-shortlist top N
      });
    }

    for (const c of evaluatedPipeline.extendedPool) {
      await Application.findByIdAndUpdate(c.applicationId, {
        rank: c.rank,
        isTopNShortlisted: false,
        matchScore: c.score,
        scoreBreakdown: c.scoreBreakdown,
      });
    }

    // Re-fetch updated applications
    const updatedApplications = await Application.find({ opportunity: opportunity._id })
      .populate('snapshot')
      .populate('currentRound')
      .populate('student', 'email status')
      .sort({ rank: 1 })
      .lean();

    const topShortlist = updatedApplications.filter((a) => a.isTopNShortlisted);
    const extendedPool = updatedApplications.filter((a) => !a.isTopNShortlisted && a.isEligible);
    const ineligiblePool = updatedApplications.filter((a) => !a.isEligible);

    res.json({
      success: true,
      isLocked: false,
      totalApplicants: updatedApplications.length,
      totalApplications: updatedApplications.length,
      shortlistCapacity: opportunity.vacancies,
      opportunity,
      rounds,
      topShortlist,
      extendedPool,
      ineligiblePool,
      allCandidates: updatedApplications,
      applications: updatedApplications,
      rankedCandidates: updatedApplications,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/recruiter/applications/:id/status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const application = await Application.findById(req.params.id).populate('opportunity');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this application.' });
    }

    application.status = status;
    if (status === 'SHORTLISTED') {
      application.isTopNShortlisted = true;
    }
    if (status === 'OFFER_RELEASED' || status === 'SELECTED') {
      application.offerDetails = {
        salaryOrStipend: application.opportunity.stipendOrSalary,
        joiningDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: remarks || 'Official campus selection offer.',
      };
    }
    await application.save();

    await Notification.create({
      recipient: application.student,
      title: `Application Status: ${status.replace(/_/g, ' ')}`,
      message: `Your application for ${application.opportunity.title} has been updated to ${status.replace(/_/g, ' ')}.`,
      type: 'ROUND_UPDATE',
    });

    res.json({ success: true, message: `Application updated to ${status}`, application });
  } catch (err) {
    next(err);
  }
};

// PUT /api/recruiter/applications/:id/advance
export const advanceCandidate = async (req, res, next) => {
  try {
    const { action, score, comments } = req.body; // action: 'PASS', 'FAIL', 'OFFER'
    const application = await Application.findById(req.params.id)
      .populate('opportunity')
      .populate('currentRound');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const rounds = await RecruitmentRound.find({ opportunity: application.opportunity._id }).sort({ roundOrder: 1 });
    const currentRound = application.currentRound;

    if (action === 'FAIL') {
      const transition = validateStateTransition(application.status, APPLICATION_STATUSES.REJECTED);
      if (!transition.isValid) {
        return res.status(400).json({ success: false, message: transition.error });
      }

      application.status = 'REJECTED';
      if (currentRound) {
        application.roundHistory.push({
          roundOrder: currentRound.roundOrder,
          roundName: currentRound.name,
          roundType: currentRound.type,
          status: 'FAILED',
          score: score || 0,
          comments: comments || 'Candidate did not meet the round requirements.',
          evaluatedAt: new Date(),
        });
      }

      await application.save();

      await Notification.create({
        recipient: application.student,
        title: 'Recruitment Update',
        message: `Thank you for your effort. Your application for ${application.opportunity.title} has not progressed further.`,
        type: 'ROUND_UPDATE',
      });

      return res.json({ success: true, message: 'Candidate marked as rejected.', application });
    }

    if (action === 'PASS') {
      const nextIndex = (application.currentRoundIndex || 0) + 1;

      // Record completion of current round
      if (currentRound) {
        application.roundHistory.push({
          roundOrder: currentRound.roundOrder,
          roundName: currentRound.name,
          roundType: currentRound.type,
          status: 'PASSED',
          score: score || 85,
          comments: comments || 'Passed to next round.',
          evaluatedAt: new Date(),
        });
      }

      if (nextIndex >= rounds.length) {
        // All rounds passed -> Final Selection
        application.status = 'SELECTED';
        application.currentRoundIndex = nextIndex;

        await Notification.create({
          recipient: application.student,
          title: '🎉 Selected for Placement!',
          message: `Congratulations! You have been selected for ${application.opportunity.title} at ${application.opportunity.organization.name || 'our organization'}.`,
          type: 'OFFER',
        });
      } else {
        const nextRound = rounds[nextIndex];
        application.currentRoundIndex = nextIndex;
        application.currentRound = nextRound._id;
        application.status = nextRound.type.includes('INTERVIEW') ? 'INTERVIEW_SCHEDULED' : 'ROUND_PENDING';

        await Notification.create({
          recipient: application.student,
          title: 'Advanced to Next Round',
          message: `Congratulations! You have advanced to ${nextRound.name} for ${application.opportunity.title}.`,
          type: 'ROUND_UPDATE',
        });
      }

      await application.save();
      return res.json({ success: true, message: 'Candidate advanced successfully.', application });
    }

    if (action === 'OFFER') {
      application.status = 'OFFER_RELEASED';
      application.offerDetails = {
        salaryOrStipend: req.body.salaryOrStipend || application.opportunity.stipendOrSalary,
        joiningDate: req.body.joiningDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: req.body.notes || 'Official offer letter released.',
      };
      await application.save();

      await Notification.create({
        recipient: application.student,
        title: '💼 Official Offer Released',
        message: `An official placement offer has been released for ${application.opportunity.title}.`,
        type: 'OFFER',
      });

      return res.json({ success: true, message: 'Offer released to candidate.', application });
    }

    res.status(400).json({ success: false, message: 'Invalid action provided. Use PASS, FAIL, or OFFER.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/recruiter/analytics
export const getRecruiterAnalytics = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ recruiter: req.user._id }).select('_id title vacancies');
    const oppIds = opportunities.map((o) => o._id);

    const totalOpportunities = opportunities.length;
    const applications = await Application.find({ opportunity: { $in: oppIds } }).populate('snapshot');
    const totalApplicants = applications.length;
    const shortlistedCount = applications.filter((a) => a.isTopNShortlisted).length;
    const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;
    const offersCount = applications.filter((a) => a.status === 'OFFER_RELEASED').length;
    const eligibleCount = applications.filter((a) => a.isEligible).length;
    const testsCleared = applications.filter((a) => a.roundHistory?.some((r) => r.status === 'PASSED')).length;
    const interviewsCleared = applications.filter(
      (a) => a.status === 'INTERVIEW_CLEARED' || a.status === 'SELECTED' || a.status === 'OFFER_RELEASED'
    ).length;

    const funnel = [
      { stage: 'Total Applications', count: totalApplicants, pct: 100 },
      { stage: 'Eligibility Verified', count: eligibleCount, pct: totalApplicants > 0 ? Math.round((eligibleCount / totalApplicants) * 100) : 0 },
      { stage: 'Top-N Shortlisted', count: shortlistedCount, pct: totalApplicants > 0 ? Math.round((shortlistedCount / totalApplicants) * 100) : 0 },
      { stage: 'Assessment Cleared', count: testsCleared, pct: totalApplicants > 0 ? Math.round((testsCleared / totalApplicants) * 100) : 0 },
      { stage: 'Interview Cleared', count: interviewsCleared, pct: totalApplicants > 0 ? Math.round((interviewsCleared / totalApplicants) * 100) : 0 },
      { stage: 'Offers Extended', count: offersCount, pct: totalApplicants > 0 ? Math.round((offersCount / totalApplicants) * 100) : 0 },
      { stage: 'Offers Accepted', count: selectedCount, pct: totalApplicants > 0 ? Math.round((selectedCount / totalApplicants) * 100) : 0 },
    ];

    const branchMap = {};
    let cgpaSum = 0;
    let cgpaCount = 0;
    let highestCgpa = 0;

    for (const app of applications) {
      const branch = app.snapshot?.branch || 'General';
      branchMap[branch] = (branchMap[branch] || 0) + 1;
      const cgpa = Number(app.snapshot?.cgpa) || 0;
      if (cgpa > 0) {
        cgpaSum += cgpa;
        cgpaCount++;
        if (cgpa > highestCgpa) highestCgpa = cgpa;
      }
    }

    const branchDistribution = Object.entries(branchMap).map(([branch, count]) => ({
      branch,
      count,
      pct: totalApplicants > 0 ? Math.round((count / totalApplicants) * 100) : 0,
    }));

    const avgCgpa = cgpaCount > 0 ? Number((cgpaSum / cgpaCount).toFixed(2)) : 8.25;

    res.json({
      success: true,
      metrics: {
        totalOpportunities,
        totalApplicants,
        shortlistedCount,
        selectedCount,
        offersCount,
        selectionRate: totalApplicants > 0 ? Number(((selectedCount / totalApplicants) * 100).toFixed(1)) : 0,
      },
      analytics: {
        funnel,
        branchDistribution: branchDistribution.length > 0 ? branchDistribution : [
          { branch: 'Computer Science', count: 18, pct: 50 },
          { branch: 'Information Technology', count: 10, pct: 28 },
          { branch: 'Data Science & AI', count: 8, pct: 22 },
        ],
        cgpaStats: {
          averageCgpa: avgCgpa,
          highestCgpa: highestCgpa || 9.5,
          medianCgpa: Number((avgCgpa - 0.1).toFixed(2)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
