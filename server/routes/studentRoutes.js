import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadResume,
  getRecommendations,
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('STUDENT', 'ADMIN'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.get('/recommendations', getRecommendations);

export default router;
