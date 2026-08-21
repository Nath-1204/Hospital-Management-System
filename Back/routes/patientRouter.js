import express from 'express';
import {
  getAllPatients,
  getPatientProfile,
  updatePatientProfile,
  deletePatient
} from '../controllers/patientController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const patientRouter = express.Router();

patientRouter.use(authMiddleware);

patientRouter.get('/', checkRole('admin'), getAllPatients);
patientRouter.get('/:id', getPatientProfile); 
patientRouter.put('/:id', updatePatientProfile);
patientRouter.delete('/:id', checkRole('admin'), deletePatient);

export default patientRouter;