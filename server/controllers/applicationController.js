import { Application } from '../models/Application.js';
import { ApplicationSnapshot } from '../models/ApplicationSnapshot.js';
import { Opportunity } from '../models/Opportunity.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { RecruitmentRound } from '../models/RecruitmentRound.js';
import { Notification } from '../models/Notification.js';
import { checkEligibility } from '../algorithms/eligibility.js';
import { calculateCandidateScore } from '../algorithms/scoring.js';
import { AlgorithmConfig } from '../models/AlgorithmConfig.js';

// POST /api/applications
export const applyToOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ success: false, message: 'Opportunity ID is required.' });
    }

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    // 1. Check if application deadline has passed
    if (new Date() > new Date(opportunity.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'The application deadline for this opportunity has passed. Submissions are permanently closed.',
      });
    }

    // 2. Check if student already applied
    const existing = await Application.findOne({
      student: req.user._id,
      opportunity: opportunityId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this opportunity.',
      });
    }

    // 3. Fetch student's profile
    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your student profile before applying.',
      });
    }

    // 4. Algorithmic Eligibility Verification
    const eligibility = checkEligibility(studentProfile, opportunity);
    if (!eligibility.isEligible) {
      return res.status(400).json({
        success: false,
        isEligible: false,
        message: 'You do not meet the mandatory eligibility criteria for this opportunity.',
        reasons: eligibility.reasons,
        criteriaStatus: eligibility.criteriaStatus,
      });
    }

    // 5. Create Immutable Application Snapshot
    const snapshot = await ApplicationSnapshot.create({
      student: req.user._id,
      opportunity: opportunity._id,
      fullName: studentProfile.fullName,
      email: req.user.email,
      phone: studentProfile.phone,
      college: studentProfile.college,
      degree: studentProfile.degree,
      branch: studentProfile.branch,
      graduationYear: studentProfile.graduationYear,
      cgpa: studentProfile.cgpa,
      percentage: studentProfile.percentage,
      activeBacklogs: studentProfile.activeBacklogs,
      skills: studentProfile.skills,
      projects: studentProfile.projects,
      experience: studentProfile.experience,
      certifications: studentProfile.certifications,
      achievements: studentProfile.achievements,
      profiles: studentProfile.profiles,
      preferences: studentProfile.preferences,
      resumeUrl: studentProfile.resumeUrl,
      resumeName: studentProfile.resumeName,
    });

    // 6. Calculate initial match score
    const activeConfig = await AlgorithmConfig.getActiveConfig();
    const scoring = calculateCandidateScore(studentProfile, opportunity, activeConfig);

    // Get first round
    const firstRound = await RecruitmentRound.findOne({ opportunity: opportunity._id }).sort({ roundOrder: 1 });

    // 7. Create Application
    const application = await Application.create({
      student: req.user._id,
      opportunity: opportunity._id,
      snapshot: snapshot._id,
      status: 'APPLIED',
      isEligible: true,
      matchScore: scoring.overallScore,
      scoreBreakdown: scoring.scoreBreakdown,
      currentRoundIndex: 0,
      currentRound: firstRound ? firstRound._id : null,
      roundHistory: firstRound
        ? [
            {
              roundOrder: firstRound.roundOrder,
              roundName: firstRound.name,
              roundType: firstRound.type,
              status: 'PENDING',
              evaluatedAt: new Date(),
            },
          ]
        : [],
    });

    // 8. Dispatch In-App Notification
    await Notification.create({
      recipient: req.user._id,
      title: 'Application Submitted',
      message: `Your application for '${opportunity.title}' has been successfully submitted and snapshotted.`,
      type: 'APPLICATION',
      link: `/student/applications/${application._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Your profile snapshot is locked.',
      application,
      snapshot,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/student
export const getStudentApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({
        path: 'opportunity',
        populate: { path: 'organization', select: 'name logo location industry' },
      })
      .populate('currentRound')
      .populate('snapshot')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/applications/:id
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'opportunity',
        populate: { path: 'organization' },
      })
      .populate('currentRound')
      .populate('snapshot')
      .lean();

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const isStudentOwner = req.user.role === 'STUDENT' && application.student.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';
    const isRecruiterOwner =
      req.user.role === 'RECRUITER' && application.opportunity.recruiter.toString() === req.user._id.toString();

    // FAIRNESS ENFORCEMENT:
    // If user is recruiter and deadline has NOT passed, prevent viewing individual candidate details!
    if (isRecruiterOwner && !isAdmin) {
      const isDeadlinePassed = new Date() > new Date(application.opportunity.applicationDeadline);
      if (!isDeadlinePassed) {
        return res.status(403).json({
          success: false,
          isLocked: true,
          message:
            'Fairness Policy: Candidate individual profiles and snapshots are locked until the application deadline has expired.',
        });
      }
    }

    if (!isStudentOwner && !isAdmin && !isRecruiterOwner) {
      return res.status(403).json({ success: false, message: 'Access denied to this application.' });
    }

    // Fetch all rounds for the opportunity
    const rounds = await RecruitmentRound.find({ opportunity: application.opportunity._id })
      .sort({ roundOrder: 1 })
      .lean();

    res.json({
      success: true,
      application,
      rounds,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/applications/:id/withdraw
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (['SELECTED', 'WITHDRAWN', 'REJECTED'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw an application that is currently ${application.status}.`,
      });
    }

    application.status = 'WITHDRAWN';
    await application.save();

    res.json({ success: true, message: 'Application has been withdrawn.' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/applications/:id/respond
export const respondToOffer = async (req, res, next) => {
  try {
    const { status } = req.body; // 'OFFER_ACCEPTED' | 'OFFER_DECLINED'
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id,
    }).populate('opportunity');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      recipient: application.opportunity.recruiter,
      title: 'Candidate Offer Response',
      message: `Candidate has ${status === 'OFFER_ACCEPTED' ? 'ACCEPTED' : 'DECLINED'} the placement offer for ${application.opportunity.title}.`,
      type: 'OFFER',
    });

    res.json({ success: true, message: `Offer marked as ${status}.`, application });
  } catch (err) {
    next(err);
  }
};
