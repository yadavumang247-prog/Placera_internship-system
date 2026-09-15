import { StudentProfile } from '../models/StudentProfile.js';
import { Opportunity } from '../models/Opportunity.js';
import { AlgorithmConfig } from '../models/AlgorithmConfig.js';
import { rankRecommendedOpportunities } from '../algorithms/recommendation.js';

// GET /api/students/profile
export const getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }
    const pObj = profile.toObject ? profile.toObject() : profile;
    pObj.academics = {
      department: pObj.branch,
      branch: pObj.branch,
      degree: pObj.degree,
      currentYear: 4,
      graduationYear: pObj.graduationYear,
      cgpa: pObj.cgpa,
      tenthPercentage: pObj.tenthPercentage,
      twelfthPercentage: pObj.twelfthPercentage,
      activeBacklogs: pObj.activeBacklogs || 0,
      college: pObj.college,
    };
    res.json({ success: true, profile: pObj });
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/profile
export const updateProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    if (req.body.academics) {
      const {
        branch,
        department,
        degree,
        graduationYear,
        cgpa,
        tenthPercentage,
        twelfthPercentage,
        activeBacklogs,
        college,
      } = req.body.academics;
      if (branch || department) profile.branch = branch || department;
      if (degree) profile.degree = degree;
      if (graduationYear) profile.graduationYear = graduationYear;
      if (cgpa !== undefined) profile.cgpa = Number(cgpa);
      if (tenthPercentage !== undefined) profile.tenthPercentage = Number(tenthPercentage);
      if (twelfthPercentage !== undefined) profile.twelfthPercentage = Number(twelfthPercentage);
      if (activeBacklogs !== undefined) profile.activeBacklogs = Number(activeBacklogs);
      if (college) profile.college = college;
    }

    const fieldsToUpdate = [
      'fullName',
      'phone',
      'headline',
      'location',
      'college',
      'university',
      'degree',
      'branch',
      'graduationYear',
      'cgpa',
      'percentage',
      'tenthPercentage',
      'twelfthPercentage',
      'activeBacklogs',
      'skills',
      'softSkills',
      'projects',
      'certifications',
      'experience',
      'achievements',
      'profiles',
      'preferences',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();
    res.json({ success: true, message: 'Profile updated successfully.', profile });
  } catch (err) {
    next(err);
  }
};

// POST /api/students/resume
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a valid resume document.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        resumeUrl: fileUrl,
        resumeName: req.file.originalname,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Resume uploaded successfully.',
      resumeUrl: fileUrl,
      resumeName: req.file.originalname,
      profile,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/students/recommendations
export const getRecommendations = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found. Please complete profile.' });
    }

    const opportunities = await Opportunity.find({ status: 'ACTIVE' })
      .populate('organization', 'name logo location industry tier')
      .lean();

    const activeConfig = await AlgorithmConfig.getActiveConfig();

    const ranked = rankRecommendedOpportunities(profile, opportunities, activeConfig);

    res.json({
      success: true,
      count: ranked.length,
      recommendations: ranked,
    });
  } catch (err) {
    next(err);
  }
};
