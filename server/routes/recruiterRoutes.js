import express from 'express';
import {
  getRecruiterOpportunities,
  getOpportunityApplications,
  advanceCandidate,
  updateApplicationStatus,
  getRecruiterAnalytics,
} from '../controllers/recruiterController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('RECRUITER', 'ADMIN'));

router.get('/opportunities', getRecruiterOpportunities);
router.get('/opportunities/:id/applications', getOpportunityApplications);
router.post('/opportunities/:id/rank', getOpportunityApplications);
router.put('/applications/:id/advance', advanceCandidate);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/analytics', getRecruiterAnalytics);

export default router;
