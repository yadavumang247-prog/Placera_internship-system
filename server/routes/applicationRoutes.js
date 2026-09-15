import express from 'express';
import {
  applyToOpportunity,
  getStudentApplications,
  getApplicationById,
  withdrawApplication,
  respondToOffer,
} from '../controllers/applicationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', authorizeRoles('STUDENT'), applyToOpportunity);
router.get('/student', authorizeRoles('STUDENT'), getStudentApplications);
router.get('/:id', getApplicationById);
router.put('/:id/withdraw', authorizeRoles('STUDENT'), withdrawApplication);
router.put('/:id/respond', authorizeRoles('STUDENT'), respondToOffer);

export default router;
