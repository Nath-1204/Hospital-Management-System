import express from 'express';
import {
  getAdminStats,
  getDoctorStats,
  getPatientStats
} from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const dashboardRouter = express.Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get('/admin', checkRole('admin'), getAdminStats);
dashboardRouter.get('/doctor', checkRole('doctor'), getDoctorStats);
dashboardRouter.get('/patient', checkRole('patient'), getPatientStats);

export default dashboardRouter;