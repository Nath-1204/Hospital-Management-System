import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { 
    createDoctor, deleteDoctor, getAllDoctors, 
    getDoctorById, getDoctorProfile, updateDoctorAvailability, 
    updateDoctorProfile 
} from '../controllers/doctorController.js';


const doctorRouter = express.Router();

doctorRouter.post('/addDoctor', authMiddleware, checkRole('admin'), createDoctor);
doctorRouter.get('/allDoctor', authMiddleware, getAllDoctors);
doctorRouter.put('/availability', authMiddleware, checkRole('admin', 'doctor'), updateDoctorAvailability);
doctorRouter.delete('/:id', authMiddleware, checkRole('admin'), deleteDoctor);
doctorRouter.get('/profile', authMiddleware, checkRole('doctor'), getDoctorProfile);
doctorRouter.put('/profile', authMiddleware, checkRole('doctor'), updateDoctorProfile);
doctorRouter.get('/:id', authMiddleware, checkRole('admin'), getDoctorById);

export default doctorRouter;