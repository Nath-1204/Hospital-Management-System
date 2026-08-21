import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  medicalHistory: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  allergies: { type: [String], default: [] },
}, { timestamps: true });

const patientModel = mongoose.models.patient || mongoose.model('patient', patientSchema);

export default patientModel;