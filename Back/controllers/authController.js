import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import doctorModel from '../models/doctorModel.js';
import patientModel from '../models/patientModel.js';


// Inscription
const register = async (req, res) => {

  try {
    const { name, email, password, role, ...rest } = req.body;

    if (role === 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Doctors cannot create their own account. Contact the administrator.'
      });
    }

    // Interdire l'inscription avec le rôle admin 
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized admin account created."
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This email address is already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role === 'patient' ? 'patient' : 'patient';

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      ...rest
    });
    await user.save();

    // Créer le profil patient
    const patient = new patientModel({ userId: user._id });
    await patient.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Connexion
const login = async (req, res) => {

  try {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Email or password is incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Email or password is incorrect' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

// Récupérer le profil de l'utilisateur connecté
const getProfile = async (req, res) => {

  try {
    
    const user = await userModel.findById(req.user.id).select('-password');
    res.json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { register, login, getProfile };