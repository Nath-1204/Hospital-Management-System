import express from 'express';
import { generateBill, getBillByAppointment } from '../controllers/billController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const billRouter = express.Router();

billRouter.post('/', authMiddleware, checkRole('admin', 'doctor'), generateBill);
billRouter.get('/appointment/:appointmentId', authMiddleware, getBillByAppointment);

export default billRouter;