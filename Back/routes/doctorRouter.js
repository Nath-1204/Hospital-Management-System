import express from 'express';
import { createDoctor, deleteDoctor, getAllDoctors, updateDoctorAvailability } from '../controllers/doctorController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const doctorRouter = express.Router();

doctorRouter.post('/addDoctor', authMiddleware, checkRole('admin'), createDoctor);
doctorRouter.get('/allDoctor', authMiddleware, getAllDoctors);
doctorRouter.put('/availability', authMiddleware, checkRole('admin', 'doctor'), updateDoctorAvailability);
doctorRouter.delete('/:id', authMiddleware, checkRole('admin'), deleteDoctor);

export default doctorRouter;