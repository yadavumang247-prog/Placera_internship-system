import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { isDatabaseReady } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import recruiterRoutes from './routes/recruiterRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const requireDatabase = (req, res, next) => {
  if (isDatabaseReady()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: 'Database is still connecting or unavailable. Please try again shortly.',
  });
};

// Middleware
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbReady = isDatabaseReady();
  res.json({
    status: dbReady ? 'HEALTHY' : 'DEGRADED',
    database: dbReady ? 'CONNECTED' : 'CONNECTING_OR_UNAVAILABLE',
    service: 'Placera — Smart Internship & Placement Allocation Platform',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/students', requireDatabase, studentRoutes);
app.use('/api/recruiter', requireDatabase, recruiterRoutes);
app.use('/api/opportunities', requireDatabase, opportunityRoutes);
app.use('/api/applications', requireDatabase, applicationRoutes);
app.use('/api/assessments', requireDatabase, assessmentRoutes);
app.use('/api/interviews', requireDatabase, interviewRoutes);
app.use('/api/admin', requireDatabase, adminRoutes);
app.use('/api/notifications', requireDatabase, notificationRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
