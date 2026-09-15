import express from 'express';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles, requireVerified } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Optional authentication so public visitors can browse, but logged in students get personalized match percentages
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwt = (await import('jsonwebtoken')).default;
      const { config } = await import('../config/env.js');
      const { User } = await import('../models/User.js');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch (err) {
    // Ignore and proceed unauthenticated
  }
  next();
};

router.get('/', optionalAuth, getAllOpportunities);
router.get('/:id', optionalAuth, getOpportunityById);

// Recruiter / Admin actions
router.post('/', authenticate, authorizeRoles('RECRUITER', 'ADMIN'), requireVerified, createOpportunity);
router.put('/:id', authenticate, authorizeRoles('RECRUITER', 'ADMIN'), updateOpportunity);
router.delete('/:id', authenticate, authorizeRoles('RECRUITER', 'ADMIN'), deleteOpportunity);

export default router;
