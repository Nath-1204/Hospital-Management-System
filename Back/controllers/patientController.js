import userModel from '../models/userModel.js';
import patientModel from '../models/patientModel.js';


const getAllPatients = async (req, res) => {

  try {

    const patients = await userModel.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      patients
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

const getPatientProfile = async (req, res) => {

  try {

    const { id } = req.params;
    const requester = req.user;

    if (requester.role === 'patient' && requester.id !== id) {
      return res.status(403).json({ success: false, message: 'Access denied: you can only view your own profile' });
    }

    // Récupérer l'utilisateur
    const user = await userModel.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Récupérer les informations médicales complémentaires depuis patientModel
    const patientInfo = await patientModel.findOne({ userId: id });

    res.json({
      success: true,
      patient: {
        ...user._doc, 
        medicalHistory: patientInfo?.medicalHistory || '',
        bloodGroup: patientInfo?.bloodGroup || '',
        allergies: patientInfo?.allergies || []
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePatientProfile = async (req, res) => {

  try {
    
    const { id } = req.params;
    const requester = req.user;
    const updates = req.body;

    if (requester.role === 'patient' && requester.id !== id) {
      return res.status(403).json({ success: false, message: 'Access denied: you can only modify your own profile' });
    }

    // Empêcher la modification du rôle, de l'email ou du mot de passe via cette route
    const forbiddenFields = ['role', 'email', 'password', '_id', 'createdAt', 'updatedAt'];
    forbiddenFields.forEach(field => delete updates[field]);

    // Mise à jour de l'utilisateur
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Mise à jour des informations médicales si fournies
    const medicalUpdates = {};
    if (updates.medicalHistory !== undefined) medicalUpdates.medicalHistory = updates.medicalHistory;
    if (updates.bloodGroup !== undefined) medicalUpdates.bloodGroup = updates.bloodGroup;
    if (updates.allergies !== undefined) medicalUpdates.allergies = updates.allergies;

    if (Object.keys(medicalUpdates).length > 0) {
      await patientModel.findOneAndUpdate(
        { userId: id },
        { $set: medicalUpdates },
        { new: true, upsert: true } 
      );
    }

    // Re-récupérer le patient complet avec ses infos médicales
    const patientInfo = await patientModel.findOne({ userId: id });
    const fullPatient = {
      ...updatedUser._doc,
      medicalHistory: patientInfo?.medicalHistory || '',
      bloodGroup: patientInfo?.bloodGroup || '',
      allergies: patientInfo?.allergies || []
    };

    res.json({
      success: true,
      patient: fullPatient
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePatient = async (req, res) => {
    
  try {

    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user || user.role !== 'patient') {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Supprimer l'utilisateur
    await userModel.findByIdAndDelete(id);
    await patientModel.findOneAndDelete({ userId: id });

    res.json({ success: true, message: 'Patient deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { 
  getAllPatients, getPatientProfile, 
  updatePatientProfile, deletePatient,
};