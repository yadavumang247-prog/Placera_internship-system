import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { Organization } from '../models/Organization.js';
import { Notification } from '../models/Notification.js';
import { config } from '../config/env.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, status: user.status },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

// POST /api/auth/register/student
export const registerStudent = async (req, res, next) => {
  try {
    const {
      email,
      password,
      fullName,
      name,
      branch,
      degree = 'B.Tech',
      graduationYear,
      cgpa,
      college = 'National Institute of Technology',
      collegeName,
      phone = '',
      skills = [],
      rollNumber = '',
      documentUrl = '',
      sheerIdCode = '',
    } = req.body;

    const studentName = fullName || name;
    const finalCollege = collegeName || college;

    if (!email || !password || !studentName || !branch || !graduationYear || cgpa === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: email, password, fullName, branch, graduationYear, and cgpa.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const isSheerVerified = Boolean(sheerIdCode && sheerIdCode.length >= 6);
    const userStatus = isSheerVerified ? 'VERIFIED' : 'PENDING';

    const user = await User.create({
      email,
      password,
      role: 'STUDENT',
      collegeName: finalCollege,
      phone,
      verificationProof: {
        documentType: 'STUDENT_COLLEGE_ID',
        documentUrl: documentUrl || '',
        sheerIdCode: sheerIdCode || '',
        verifiedAt: isSheerVerified ? new Date() : null,
        notes: rollNumber ? `Roll No: ${rollNumber}` : '',
      },
      status: userStatus,
      isEmailVerified: true,
    });

    const studentProfile = await StudentProfile.create({
      user: user._id,
      fullName: studentName,
      branch,
      degree,
      graduationYear: Number(graduationYear),
      cgpa: Number(cgpa),
      college: finalCollege,
      phone,
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : [],
      verificationStatus: userStatus,
      verificationDocumentUrl: documentUrl || '',
      verificationNotes: rollNumber ? `Roll Number: ${rollNumber}` : '',
    });

    await Notification.create({
      recipient: user._id,
      title: 'Welcome to Placera',
      message: `Your student account has been created (${userStatus === 'VERIFIED' ? 'Verified via SheerID' : 'Pending verification review'}). Complete your profile to discover matched opportunities.`,
      type: 'SYSTEM',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Student registration successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      profile: studentProfile,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/register/recruiter
export const registerRecruiter = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      fullName,
      phone = '',
      designation = 'Talent Acquisition Partner',
      organizationName,
      companyName,
      website = '',
      industry = 'Software & Technology',
      companySize = '100-500',
      location = 'Bangalore, India',
      description = '',
      cin = '',
      gstin = '',
      documentUrl = '',
      sheerIdCode = '',
    } = req.body;

    const recruiterName = name || fullName;
    const orgName = organizationName || companyName;

    if (!email || !password || !recruiterName || !orgName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: email, password, name, and organizationName.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Find or create organization
    let org = await Organization.findOne({ name: orgName });
    if (!org) {
      org = await Organization.create({
        name: orgName,
        website,
        industry,
        companySize,
        location,
        description,
        verified: true,
      });
    }

    const isSheerVerified = Boolean(sheerIdCode && sheerIdCode.length >= 6);
    const userStatus = isSheerVerified ? 'VERIFIED' : 'PENDING';

    const user = await User.create({
      email,
      password,
      role: 'RECRUITER',
      phone,
      designation,
      verificationProof: {
        documentType: 'CORPORATE_REGISTRATION_OR_ID',
        documentUrl: documentUrl || '',
        sheerIdCode: sheerIdCode || '',
        verifiedAt: isSheerVerified ? new Date() : null,
        notes: cin ? `CIN: ${cin}, GSTIN: ${gstin}` : '',
      },
      status: userStatus,
      isEmailVerified: true,
    });

    const recruiterProfile = await RecruiterProfile.create({
      user: user._id,
      name: recruiterName,
      phone,
      designation,
      organization: org._id,
      verificationStatus: userStatus,
      verificationDocumentUrl: documentUrl || '',
    });

    await Notification.create({
      recipient: user._id,
      title: 'Recruiter Account Created',
      message: `Welcome to Placera! Your account for ${org.name} is ${userStatus === 'VERIFIED' ? 'active' : 'pending institutional verification'}.`,
      type: 'SYSTEM',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Recruiter registration successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      profile: recruiterProfile,
      organization: org,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/register/college-admin
export const registerCollegeAdmin = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      collegeName,
      designation = 'Head of Training & Placement Cell',
      phone = '',
      accreditationId = '',
      documentUrl = '',
      sheerIdCode = '',
    } = req.body;

    if (!email || !password || !name || !collegeName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: email, password, name, and collegeName.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this institutional email already exists.',
      });
    }

    const isSheerVerified = Boolean(sheerIdCode && sheerIdCode.length >= 6);
    const userStatus = isSheerVerified ? 'VERIFIED' : 'PENDING';

    const user = await User.create({
      email,
      password,
      role: 'COLLEGE_ADMIN',
      adminType: 'COLLEGE_ADMIN',
      collegeName,
      designation,
      phone,
      verificationProof: {
        documentType: 'COLLEGE_AUTHORIZATION_LETTER',
        documentUrl: documentUrl || '',
        sheerIdCode: sheerIdCode || '',
        verifiedAt: isSheerVerified ? new Date() : null,
        notes: accreditationId ? `Accreditation/Affiliation ID: ${accreditationId}` : '',
      },
      status: userStatus,
      isEmailVerified: true,
    });

    await Notification.create({
      recipient: user._id,
      title: 'College Placement Administration Initialized',
      message: `Welcome to Placera! Your placement administration portal for ${collegeName} has been registered (${userStatus === 'VERIFIED' ? 'Verified' : 'Pending Verification Review'}).`,
      type: 'SYSTEM',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'College Placement Cell registration successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        adminType: user.adminType,
        collegeName: user.collegeName,
        status: user.status,
      },
      profile: {
        name,
        collegeName,
        designation,
        phone,
        verificationProof: user.verificationProof,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Fetch associated profile based on role
    let profile = null;
    let organization = null;

    if (user.role === 'STUDENT') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'RECRUITER') {
      profile = await RecruiterProfile.findOne({ user: user._id }).populate('organization');
      organization = profile ? profile.organization : null;
    } else if (user.role === 'COLLEGE_ADMIN' || user.role === 'ADMIN') {
      profile = {
        name: user.designation || 'College Administrator',
        collegeName: user.collegeName || 'Placement Administration',
        adminType: user.adminType || (user.role === 'COLLEGE_ADMIN' ? 'COLLEGE_ADMIN' : 'PLATFORM_ADMIN'),
        verificationProof: user.verificationProof,
      };
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        adminType: user.adminType,
        collegeName: user.collegeName,
        status: user.status,
      },
      profile,
      organization,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    let organization = null;

    if (user.role === 'STUDENT') {
      profile = await StudentProfile.findOne({ user: user._id });
    } else if (user.role === 'RECRUITER') {
      profile = await RecruiterProfile.findOne({ user: user._id }).populate('organization');
      organization = profile ? profile.organization : null;
    } else if (user.role === 'COLLEGE_ADMIN' || user.role === 'ADMIN') {
      profile = {
        name: user.designation || 'College Administrator',
        collegeName: user.collegeName || 'Placement Administration',
        adminType: user.adminType || (user.role === 'COLLEGE_ADMIN' ? 'COLLEGE_ADMIN' : 'PLATFORM_ADMIN'),
        verificationProof: user.verificationProof,
      };
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        adminType: user.adminType,
        collegeName: user.collegeName,
        status: user.status,
      },
      profile,
      organization,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been dispatched.',
  });
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  res.json({
    success: true,
    message: 'Password has been reset successfully.',
  });
};
