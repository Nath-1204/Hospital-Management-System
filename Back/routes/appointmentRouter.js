import express from 'express';
import { bookAppointment, getMyAppointments, updateAppointmentStatus, updatePrescription, uploadLabReport } from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import upload from "../middleware/upload.js"

const appointmentRouter = express.Router();

appointmentRouter.post('/book', authMiddleware, checkRole('patient'), bookAppointment);
appointmentRouter.get('/myAppointments', authMiddleware, getMyAppointments);
appointmentRouter.put('/:id/status', authMiddleware, updateAppointmentStatus);
appointmentRouter.put('/:id/prescription', authMiddleware, checkRole('doctor', 'admin'), updatePrescription);
appointmentRouter.post('/:id/lab-report', authMiddleware, upload.single('report'), uploadLabReport);

export default appointmentRouter;