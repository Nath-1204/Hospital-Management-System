import billModel from '../models/billModel.js';
import appointmentModel from '../models/appointmentModel.js';


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

export { generateBill, getBillByAppointment };