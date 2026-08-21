import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import billModel from '../models/billModel.js';
import doctorModel from '../models/doctorModel.js';


// ADMIN DASHBOARD STATS
const getAdminStats = async (req, res) => {
  
  try {

    const totalPatients = await userModel.countDocuments({ role: 'patient' });
    const totalDoctors = await userModel.countDocuments({ role: 'doctor' });
    const totalAppointments = await appointmentModel.countDocuments();
    const todayAppointments = await appointmentModel.countDocuments({
      date: new Date().toISOString().slice(0, 10)
    });
    
    const totalRevenue = await billModel.aggregate([
      { $match: { paid: true } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentAppointments = await appointmentModel.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentAppointments
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DOCTOR DASHBOARD STATS
const getDoctorStats = async (req, res) => {

  try {
    
    const doctorId = req.user.id; 
    const doctorProfile = await doctorModel.findOne({ userId: doctorId });

    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Profil médecin introuvable' });
    }

    const totalAppointments = await appointmentModel.countDocuments({ doctorId });

    const today = new Date().toISOString().slice(0, 10);
    const todayAppointments = await appointmentModel.countDocuments({
      doctorId,
      date: today
    });

    const pendingAppointments = await appointmentModel.countDocuments({
      doctorId,
      status: 'pending'
    });

    const upcomingAppointments = await appointmentModel.countDocuments({
      doctorId,
      date: { $gte: today },
      status: { $in: ['confirmed', 'pending'] }
    });

    const recentPatients = await appointmentModel.find({
      doctorId,
      status: 'completed'
    })
      .populate('patientId', 'name email phone')
      .sort({ updatedAt: -1 })
      .limit(5);

    const revenue = await billModel.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: 'appointmentId',
          foreignField: '_id',
          as: 'appt'
        }
      },
      { $unwind: '$appt' },
      {
        $match: {
          'appt.doctorId': doctorId,
          paid: true
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        upcomingAppointments,
        totalRevenue: revenue[0]?.total || 0,
        recentPatients,
        doctorProfile: {
          specialization: doctorProfile.specialization,
          experience: doctorProfile.experience,
          fee: doctorProfile.fee,
          availability: doctorProfile.availability
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATIENT DASHBOARD STATS
const getPatientStats = async (req, res) => {

  try {

    const patientId = req.user.id;
    const totalAppointments = await appointmentModel.countDocuments({ patientId });
 
    const today = new Date().toISOString().slice(0, 10);
    const upcomingAppointments = await appointmentModel.countDocuments({
      patientId,
      date: { $gte: today },
      status: { $ne: 'cancelled' }
    });

    const pendingAppointments = await appointmentModel.countDocuments({
      patientId,
      status: 'pending'
    });

    const recentAppointments = await appointmentModel.find({ patientId })
      .populate('doctorId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const unpaidBills = await billModel.countDocuments({
      patientId,
      paid: false
    });

    const totalSpent = await billModel.aggregate([
      { $match: { patientId, paid: true } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const nextAppointment = await appointmentModel.findOne({
      patientId,
      date: { $gte: today },
      status: { $ne: 'cancelled' }
    })
      .populate('doctorId', 'name specialization')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      stats: {
        totalAppointments,
        upcomingAppointments,
        pendingAppointments,
        unpaidBills,
        totalSpent: totalSpent[0]?.total || 0,
        recentAppointments,
        nextAppointment
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAdminStats, getDoctorStats, getPatientStats };