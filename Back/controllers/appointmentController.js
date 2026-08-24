import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';


// Réserver un rendez-vous
const bookAppointment = async (req, res) => {

  try {
    
    const { doctorId, date, time, notes } = req.body;
    const patientId = req.user.id; 

    const doctor = await userModel.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const doctorProfile = await doctorModel.findOne({ userId: doctorId });
    if (!doctorProfile) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

    // On vérifie si le créneau est dans la liste des disponibilités 
    const slot = `${date}T${time}`; 
    if (!doctorProfile.availability.includes(slot)) {
      return res.status(400).json({ success: false, message: 'This time slot is not available' });
    }

    const appointment = new appointmentModel({
      patientId,
      doctorId,
      date,
      time,
      notes,
      status: 'pending'
    });

    await appointment.save();
    res.status(201).json({ success: true, appointment });

  } catch (error) {
    if (error.code === 11000) { 
      return res.status(409).json({ success: false, message: 'This time slot is already booked by another patient' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer les rendez-vous d'un patient
const getMyAppointments = async (req, res) => {

  try {
    const userId = req.user.id;
    const role = req.user.role;

    let filter = {};
    if (role === 'patient') filter.patientId = userId;
    else if (role === 'doctor') filter.doctorId = userId;
    else if (role === 'admin') {} 

    const appointments = await appointmentModel.find(filter)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, appointments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour le statut d'un rendez-vous 
const updateAppointmentStatus = async (req, res) => {

  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await appointmentModel.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (req.user.role === 'patient' && status !== 'cancelled') {
      return res.status(403).json({ success: false, message: 'Action not authorized' });
    }

    appointment.status = status;
    await appointment.save();
    res.json({ success: true, appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePrescription = async (req, res) => {

  try {

    const { id } = req.params;
    const { prescription } = req.body;
    const appointment = await appointmentModel.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (req.user.role !== 'admin' && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Accès interdit' });
    }

    appointment.prescription = prescription;
    await appointment.save();
    res.json({ success: true, appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadLabReport = async (req, res) => {

  try {

    const { id } = req.params;
    const appointment = await appointmentModel.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (req.file) {
      appointment.labReports.push(req.file.path); 
      await appointment.save();
    }

    res.json({ success: true, appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { bookAppointment, getMyAppointments, updateAppointmentStatus, updatePrescription, uploadLabReport };