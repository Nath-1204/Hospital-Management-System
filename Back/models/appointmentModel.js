import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  notes: { type: String, default: "" },
  prescription: { type: String, default: "" }, 
  labReports: [{ type: String }], 
}, { timestamps: true });

appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);

export default appointmentModel;