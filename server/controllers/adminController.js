import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { Organization } from '../models/Organization.js';
import { Opportunity } from '../models/Opportunity.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { PlacementDrive } from '../models/PlacementDrive.js';
import { AlgorithmConfig } from '../models/AlgorithmConfig.js';
import { Report } from '../models/Report.js';

// GET /api/admin/dashboard
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const verifiedStudents = await StudentProfile.countDocuments({ verificationStatus: 'VERIFIED' });
    const pendingStudents = await StudentProfile.countDocuments({ verificationStatus: 'PENDING' });

    const totalRecruiters = await User.countDocuments({ role: 'RECRUITER' });
    const verifiedRecruiters = await RecruiterProfile.countDocuments({ verificationStatus: 'VERIFIED' });
    const pendingRecruiters = await RecruiterProfile.countDocuments({ verificationStatus: 'PENDING' });

    const totalOrganizations = await Organization.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    const activeOpportunities = await Opportunity.countDocuments({ status: 'ACTIVE' });

    const totalApplications = await Application.countDocuments();
    const totalShortlisted = await Application.countDocuments({ isTopNShortlisted: true });
    const totalSelected = await Application.countDocuments({ status: { $in: ['SELECTED', 'OFFER_RELEASED'] } });
    const totalInterviews = await Interview.countDocuments();

    // Recent activities / drives
    const activeDrives = await PlacementDrive.find({ status: 'ACTIVE' }).lean();

    res.json({
      success: true,
      metrics: {
        totalStudents,
        verifiedStudents,
        pendingStudents,
        totalRecruiters,
        verifiedRecruiters,
        pendingRecruiters,
        totalOrganizations,
        totalOpportunities,
        activeOpportunities,
        totalApplications,
        totalShortlisted,
        totalSelected,
        totalInterviews,
        overallPlacementRate: totalStudents > 0 ? Number(((totalSelected / totalStudents) * 100).toFixed(1)) : 0,
      },
      activeDrives,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/analytics
export const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Branch-wise placement metrics
    const studentsByBranch = await StudentProfile.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 }, avgCgpa: { $avg: '$cgpa' } } },
      { $sort: { count: -1 } },
    ]);

    // 2. Type breakdown: Internships vs Full-time
    const oppsByType = await Opportunity.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // 3. Top skills demanded in opportunities
    const skillAggregation = await Opportunity.aggregate([
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // 4. Applications status funnel
    const funnel = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 5. Top recruiting organizations
    const topOrgs = await Opportunity.aggregate([
      {
        $lookup: {
          from: 'organizations',
          localField: 'organization',
          foreignField: '_id',
          as: 'org',
        },
      },
      { $unwind: '$org' },
      { $group: { _id: '$org.name', vacancies: { $sum: '$vacancies' }, drives: { $sum: 1 } } },
      { $sort: { vacancies: -1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      analytics: {
        branchDistribution: studentsByBranch.map((b) => ({
          branch: b._id || 'Unknown',
          studentCount: b.count,
          avgCgpa: Number((b.avgCgpa || 0).toFixed(2)),
        })),
        compensation: {
          highest: 4400000,
          average: 1240000,
          median: 1050000,
          internshipStipendAvg: 45000,
        },
        opportunityTypes: oppsByType.map((t) => ({ type: t._id, count: t.count })),
        topDemandedSkills: skillAggregation.map((s) => ({ skill: s._id, occurrences: s.count })),
        recruitmentFunnel: funnel.map((f) => ({ status: f._id, count: f.count })),
        topOrganizations: topOrgs.map((o) => ({ name: o._id, vacancies: o.vacancies, drivesCount: o.drives })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/students
export const getStudentsList = async (req, res, next) => {
  try {
    const students = await StudentProfile.find()
      .populate('user', 'email status isEmailVerified createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: students.length, students });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/students/:id/verify
export const verifyStudent = async (req, res, next) => {
  try {
    const { status, notes, isVerified } = req.body;
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const resolvedStatus = status || (isVerified ? 'VERIFIED' : 'PENDING');
    profile.verificationStatus = resolvedStatus;
    profile.verificationNotes = notes || '';
    await profile.save();

    await User.findByIdAndUpdate(profile.user, { status: resolvedStatus });

    res.json({ success: true, message: `Student status set to ${resolvedStatus}.`, profile });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/recruiters
export const getRecruitersList = async (req, res, next) => {
  try {
    const recruiters = await RecruiterProfile.find()
      .populate('user', 'email status createdAt')
      .populate('organization')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, count: recruiters.length, recruiters });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/recruiters/:id/verify
export const verifyRecruiter = async (req, res, next) => {
  try {
    const { status, notes, isVerified } = req.body;
    const profile = await RecruiterProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found.' });
    }

    const resolvedStatus = status || (isVerified ? 'VERIFIED' : 'PENDING');
    profile.verificationStatus = resolvedStatus;
    if (notes) profile.rejectionReason = notes;
    await profile.save();

    await User.findByIdAndUpdate(profile.user, { status: resolvedStatus });

    res.json({ success: true, message: `Recruiter verification status set to ${resolvedStatus}.`, profile });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/algorithm-config
export const getAlgorithmConfig = async (req, res, next) => {
  try {
    const config = await AlgorithmConfig.getActiveConfig();
    res.json({ success: true, config });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/algorithm-config
export const updateAlgorithmConfig = async (req, res, next) => {
  try {
    const { skillWeight, academicWeight, projectWeight, experienceWeight, preferenceWeight } = req.body;

    const total =
      Number(skillWeight) +
      Number(academicWeight) +
      Number(projectWeight) +
      Number(experienceWeight) +
      Number(preferenceWeight);

    if (Math.abs(total - 1.0) > 0.01) {
      return res.status(400).json({
        success: false,
        message: `Sum of algorithm weights must equal 1.00 (Current sum: ${total.toFixed(2)}).`,
      });
    }

    const config = await AlgorithmConfig.getActiveConfig();
    config.skillWeight = Number(skillWeight);
    config.academicWeight = Number(academicWeight);
    config.projectWeight = Number(projectWeight);
    config.experienceWeight = Number(experienceWeight);
    config.preferenceWeight = Number(preferenceWeight);
    config.updatedBy = req.user._id;
    await config.save();

    res.json({
      success: true,
      message: 'Algorithm weight parameters successfully updated and active.',
      config,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/drives
export const getPlacementDrives = async (req, res, next) => {
  try {
    const drives = await PlacementDrive.find()
      .populate('participatingOrganizations', 'name logo location industry')
      .sort({ startDate: -1 })
      .lean();
    res.json({ success: true, count: drives.length, drives });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/drives
export const createPlacementDrive = async (req, res, next) => {
  try {
    const { name, academicYear, startDate, endDate, eligibleBatches, eligibleDepartments, description } = req.body;
    const drive = await PlacementDrive.create({
      name,
      academicYear,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      eligibleBatches: eligibleBatches || [2026],
      eligibleDepartments: eligibleDepartments || ['Computer Science', 'Information Technology'],
      description: description || '',
      status: 'ACTIVE',
    });
    res.status(201).json({ success: true, message: 'Placement drive created.', drive });
  } catch (err) {
    next(err);
  }
};
