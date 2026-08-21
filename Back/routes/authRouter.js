import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/profile', authMiddleware, getProfile);

export default authRouter;