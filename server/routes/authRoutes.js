import express from 'express';
import {
  registerStudent,
  registerRecruiter,
  registerCollegeAdmin,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register/student', registerStudent);
router.post('/register/recruiter', registerRecruiter);
router.post('/register/college-admin', registerCollegeAdmin);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
