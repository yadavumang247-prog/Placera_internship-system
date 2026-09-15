import express from 'express';
import {
  getAdminDashboard,
  getAdminAnalytics,
  getStudentsList,
  verifyStudent,
  getRecruitersList,
  verifyRecruiter,
  getAlgorithmConfig,
  updateAlgorithmConfig,
  getPlacementDrives,
  createPlacementDrive,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getAdminAnalytics);

router.get('/students', getStudentsList);
router.put('/students/:id/verify', verifyStudent);

router.get('/recruiters', getRecruitersList);
router.put('/recruiters/:id/verify', verifyRecruiter);

router.get('/algorithm-config', getAlgorithmConfig);
router.put('/algorithm-config', updateAlgorithmConfig);

router.get('/drives', getPlacementDrives);
router.post('/drives', createPlacementDrive);

export default router;
