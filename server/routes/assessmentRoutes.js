import express from 'express';
import {
  getStudentAssessments,
  getAssessmentById,
  submitMcqAssessment,
  runCodingCode,
  submitCodingCode,
} from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getStudentAssessments);
router.post('/coding/run', runCodingCode);
router.post('/coding/submit', authorizeRoles('STUDENT'), submitCodingCode);
router.get('/:id', getAssessmentById);
router.post('/:id/submit', authorizeRoles('STUDENT'), submitMcqAssessment);

export default router;
