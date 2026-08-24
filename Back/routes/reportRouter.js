import express from 'express';
import {
  getAppointmentStats,
  getRevenueStats,
  getDoctorAppointmentDistribution,
  getPatientDistribution
} from '../controllers/reportController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';


const reportRouter = express.Router();

reportRouter.use(authMiddleware);
reportRouter.use(checkRole('admin'));

reportRouter.get('/appointments-stats', getAppointmentStats);
reportRouter.get('/revenue-stats', getRevenueStats);
reportRouter.get('/doctor-distribution', getDoctorAppointmentDistribution);
reportRouter.get('/patient-distribution', getPatientDistribution);

export default reportRouter;