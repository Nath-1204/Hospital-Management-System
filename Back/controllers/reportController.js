import appointmentModel from '../models/appointmentModel.js';
import billModel from '../models/billModel.js';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';


const getAppointmentStats = async (req, res) => {

  try {

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ];

    const result = await appointmentModel.aggregate(pipeline);

    const months = [];
    const counts = [];

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.unshift(monthKey);
      const found = result.find(r => 
        r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1
      );
      counts.unshift(found ? found.count : 0);
    }

    res.json({ success: true, months, counts });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getRevenueStats = async (req, res) => {

  try {

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paid: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ];

    const result = await billModel.aggregate(pipeline);

    const months = [];
    const revenues = [];

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.unshift(monthKey);
      const found = result.find(r => 
        r._id.year === d.getFullYear() && r._id.month === d.getMonth() + 1
      );
      revenues.unshift(found ? found.total : 0);
    }

    res.json({ success: true, months, revenues });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorAppointmentDistribution = async (req, res) => {

  try {

    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $group: {
          _id: '$doctor.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const result = await appointmentModel.aggregate(pipeline);
    const labels = result.map(r => r._id);
    const data = result.map(r => r.count);

    res.json({ success: true, labels, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPatientDistribution = async (req, res) => {

  try {
    
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      {
        $group: {
          _id: {
            doctor: '$doctor.name',
            patient: '$patientId'
          }
        }
      },
      {
        $group: {
          _id: '$_id.doctor',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];

    const result = await appointmentModel.aggregate(pipeline);
    const labels = result.map(r => r._id);
    const data = result.map(r => r.count);

    res.json({ success: true, labels, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAppointmentStats, getRevenueStats, getDoctorAppointmentDistribution, getPatientDistribution };