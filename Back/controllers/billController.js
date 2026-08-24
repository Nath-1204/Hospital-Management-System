import billModel from '../models/billModel.js';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from "../models/doctorModel.js"


const generateBill = async (req, res) => {

  try {
    const { appointmentId, medicineCharges, labTestCharges, discount } = req.body;

    const appointment = await appointmentModel.findById(appointmentId).populate('doctorId');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Récupérer les frais de consultation depuis le modèle Doctor
    const doctorProfile = await doctorModel.findOne({ userId: appointment.doctorId._id });
    const consultationFee = doctorProfile ? doctorProfile.fee : 0;

    const total = consultationFee + (medicineCharges || 0) + (labTestCharges || 0) - (discount || 0);

    const bill = new billModel({
      appointmentId,
      patientId: appointment.patientId,
      consultationFee,
      medicineCharges: medicineCharges || 0,
      labTestCharges: labTestCharges || 0,
      discount: discount || 0,
      totalAmount: total,
      paid: false,
    });

    await bill.save();
    res.status(201).json({ success: true, bill });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

const getBillByAppointment = async (req, res) => {

  try {
    const { appointmentId } = req.params;
    const bill = await billModel.findOne({ appointmentId }).populate('patientId', 'name email');
    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
    res.json({ success: true, bill });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

const getPatientBills = async (req, res) => {

  try {

    const patientId = req.user.id;
    const bills = await billModel.find({ patientId })
      .populate('appointmentId', 'date time doctorId') 
      .populate({
        path: 'appointmentId',
        populate: { path: 'doctorId', select: 'name' } 
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bills });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBills = async (req, res) => {

  try {

    const bills = await billModel.find()

      .populate('patientId', 'name email phone')
      .populate({
        path: 'appointmentId',
        populate: { path: 'doctorId', select: 'name' }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bills });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markBillAsPaid = async (req, res) => {

  try {

    const { id } = req.params;
    const bill = await billModel.findById(id);

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    bill.paid = true;
    await bill.save();
    res.json({ success: true, bill });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { generateBill, getBillByAppointment, getPatientBills, getAllBills, markBillAsPaid };