import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  consultationFee: { type: Number, required: true },
  medicineCharges: { type: Number, default: 0 },
  labTestCharges: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
}, { timestamps: true });

const billModel = mongoose.models.bill || mongoose.model('bill', billSchema);

export default billModel;