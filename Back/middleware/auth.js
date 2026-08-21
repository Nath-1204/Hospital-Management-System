import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";


const authMiddleware = async (req, res, next) => {

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user; 
    next();

  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }

};

export default authMiddleware;