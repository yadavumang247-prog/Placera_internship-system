import { Opportunity } from '../models/Opportunity.js';
import { RecruitmentRound } from '../models/RecruitmentRound.js';
import { Application } from '../models/Application.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { calculateStudentOpportunityScore } from '../algorithms/recommendation.js';

// GET /api/opportunities
export const getAllOpportunities = async (req, res, next) => {
  try {
    const { search, type, workMode, branch, minCgpa } = req.query;

    const query = { status: { $in: ['ACTIVE', 'DEADLINE_CLOSED'] } };

    if (type) query.type = type;
    if (workMode) query.workMode = workMode;
    if (minCgpa) query.minCgpa = { $lte: Number(minCgpa) };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let opportunities = await Opportunity.find(query)
      .populate('organization', 'name logo industry location tier')
      .sort({ createdAt: -1 })
      .lean();

    // If a student is logged in, attach their personalized match score and eligibility highlights
    if (req.user && req.user.role === 'STUDENT') {
      const studentProfile = await StudentProfile.findOne({ user: req.user._id }).lean();
      if (studentProfile) {
        opportunities = opportunities.map((opp) => {
          const match = calculateStudentOpportunityScore(studentProfile, opp);
          return {
            ...opp,
            match,
          };
        });
      }
    }

    res.json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/opportunities/:id
export const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('organization')
      .lean();

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    // Fetch associated recruitment rounds
    const rounds = await RecruitmentRound.find({ opportunity: opportunity._id })
      .sort({ roundOrder: 1 })
      .lean();

    let studentMatch = null;
    let existingApplication = null;

    if (req.user && req.user.role === 'STUDENT') {
      const studentProfile = await StudentProfile.findOne({ user: req.user._id }).lean();
      if (studentProfile) {
        studentMatch = calculateStudentOpportunityScore(studentProfile, opportunity);
      }
      existingApplication = await Application.findOne({
        student: req.user._id,
        opportunity: opportunity._id,
      }).lean();
    }

    // Applicant count
    const applicantsCount = await Application.countDocuments({ opportunity: opportunity._id });

    res.json({
      success: true,
      opportunity: {
        ...opportunity,
        rounds,
        applicantsCount,
        studentMatch,
        existingApplication,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/opportunities
export const createOpportunity = async (req, res, next) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
    if (!recruiterProfile) {
      return res.status(403).json({ success: false, message: 'Recruiter profile required to post opportunities.' });
    }

    const {
      title,
      role,
      type = 'INTERNSHIP',
      description,
      department = 'Engineering',
      allowedDegrees = ['B.Tech', 'M.Tech', 'MCA'],
      allowedBranches = [],
      minCgpa = 6.0,
      requiredSkills = [],
      preferredSkills = [],
      requiredExperienceMonths = 0,
      graduationYears = [2025, 2026],
      maxBacklogs = 0,
      location = 'Bangalore, India',
      workMode = 'HYBRID',
      stipendOrSalary,
      vacancies = 5,
      applicationDeadline,
      rounds = [],
    } = req.body;

    if (!title || !role || !description || !stipendOrSalary || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: title, role, description, stipendOrSalary, applicationDeadline.',
      });
    }

    const opportunity = await Opportunity.create({
      organization: recruiterProfile.organization,
      recruiter: req.user._id,
      title,
      role,
      type,
      description,
      department,
      allowedDegrees,
      allowedBranches,
      minCgpa: Number(minCgpa),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : [],
      requiredExperienceMonths: Number(requiredExperienceMonths),
      graduationYears: Array.isArray(graduationYears) ? graduationYears.map(Number) : [2025, 2026],
      maxBacklogs: Number(maxBacklogs),
      location,
      workMode,
      stipendOrSalary,
      vacancies: Number(vacancies),
      applicationDeadline: new Date(applicationDeadline),
      status: 'ACTIVE',
    });

    // Create default or custom recruitment rounds
    const roundsToCreate = rounds.length > 0 ? rounds : [
      { roundOrder: 1, name: 'Round 1: Cognitive Aptitude', type: 'APTITUDE', passingScore: 60, timeLimitMinutes: 45 },
      { roundOrder: 2, name: 'Round 2: Technical & DSA Assessment', type: 'CODING', passingScore: 70, timeLimitMinutes: 60 },
      { roundOrder: 3, name: 'Round 3: Technical Interview', type: 'TECHNICAL_INTERVIEW', passingScore: 70, timeLimitMinutes: 45 },
      { roundOrder: 4, name: 'Round 4: HR / Cultural Fit', type: 'HR_INTERVIEW', passingScore: 60, timeLimitMinutes: 30 },
    ];

    const createdRounds = await Promise.all(
      roundsToCreate.map((r, idx) =>
        RecruitmentRound.create({
          opportunity: opportunity._id,
          roundOrder: r.roundOrder || idx + 1,
          name: r.name,
          type: r.type,
          passingScore: r.passingScore || 60,
          timeLimitMinutes: r.timeLimitMinutes || 45,
          instructions: r.instructions || '',
        })
      )
    );

    res.status(201).json({
      success: true,
      message: 'Recruitment opportunity created successfully with configured rounds.',
      opportunity,
      rounds: createdRounds,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/opportunities/:id
export const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    if (opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this opportunity.' });
    }

    const updated = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Opportunity updated.', opportunity: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/opportunities/:id
export const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    if (opportunity.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this opportunity.' });
    }

    await Opportunity.findByIdAndDelete(req.params.id);
    await RecruitmentRound.deleteMany({ opportunity: req.params.id });

    res.json({ success: true, message: 'Opportunity removed successfully.' });
  } catch (err) {
    next(err);
  }
};
