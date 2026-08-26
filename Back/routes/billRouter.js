import express from 'express';
import { generateBill, getAllBills, getBillByAppointment, getPatientBills, markBillAsPaid } from '../controllers/billController.js';
import authMiddleware from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const billRouter = express.Router();

billRouter.post('/', authMiddleware, checkRole('admin', 'doctor'), generateBill);
billRouter.get('/appointment/:appointmentId', authMiddleware, getBillByAppointment);
billRouter.get('/mybills', authMiddleware, checkRole('patient'), getPatientBills);
billRouter.get('/admin', authMiddleware, checkRole('admin'), getAllBills);
billRouter.put('/:id', authMiddleware, checkRole('admin'), markBillAsPaid);
billRouter.get('/:id', authMiddleware, getAllBills);

export default billRouter;