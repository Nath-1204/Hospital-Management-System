import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, 
  fee: { type: Number, required: true },
  availability: { type: [String], default: [] }, 
}, { timestamps: true });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

export default doctorModel;