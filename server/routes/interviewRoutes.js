import express from 'express';
import {
  scheduleInterview,
  getInterviews,
  evaluateInterview,
} from '../controllers/interviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('RECRUITER', 'ADMIN'), scheduleInterview);
router.get('/', getInterviews);
router.put('/:id/evaluate', authorizeRoles('RECRUITER', 'ADMIN'), evaluateInterview);

export default router;
