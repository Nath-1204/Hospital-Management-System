import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
import bcrypt from "bcryptjs"

// Créer un nouveau médecin 
const createDoctor = async (req, res) => {

  try {
    const { name, email, password, specialization, experience, fee, image, ...rest } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This email address is already in use.' });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
      image: image || '',
      ...rest
    });
    await user.save();

    const doctor = new doctorModel({
      userId: user._id,
      specialization,
      experience,
      fee,
    });
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor: {
        user: { id: user._id, name: user.name, email: user.email },
        specialization,
        experience,
        fee,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer tous les médecins 
const getAllDoctors = async (req, res) => {

  try {
    
    const doctors = await doctorModel.find().populate('userId', 'name email image phone address');
    res.json({ success: true, doctors });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ajouter un médecin (par Admin)
const updateDoctorAvailability = async (req, res) => {

  try {

    const { doctorId, availability } = req.body;
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    doctor.availability = availability;
    await doctor.save();
    res.json({ success: true, doctor });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer un médecin 
const deleteDoctor = async (req, res) => {

  try {

    const { id } = req.params;
    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await doctorModel.findByIdAndDelete(id);
    await userModel.findByIdAndDelete(doctor.userId);
    res.json({ success: true, message: 'Doctor deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer le profil du docteur connecté
const getDoctorProfile = async (req, res) => {

  try {

    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const doctor = await doctorModel.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.json({
      success: true,
      doctor: {
        ...user._doc,
        specialization: doctor.specialization,
        experience: doctor.experience,
        fee: doctor.fee,
        availability: doctor.availability,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour le profil du docteur
const updateDoctorProfile = async (req, res) => {

  try {

    const userId = req.user.id;
    const { name, phone, gender, dob, address, image, specialization, experience, fee, availability } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $set: { name, phone, gender, dob, address, image } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const doctor = await doctorModel.findOneAndUpdate(
      { userId },
      { $set: { specialization, experience, fee, availability } },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor: {
        ...user._doc,
        specialization: doctor.specialization,
        experience: doctor.experience,
        fee: doctor.fee,
        availability: doctor.availability,
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer un médecin par son ID
const getDoctorById = async (req, res) => {

  try {

    const { id } = req.params;
    const doctor = await doctorModel.findById(id).populate('userId', 'name email image phone address gender dob');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, doctor });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { 
  createDoctor, getAllDoctors, 
  updateDoctorAvailability, 
  deleteDoctor, getDoctorProfile,
  updateDoctorProfile , getDoctorById,
};