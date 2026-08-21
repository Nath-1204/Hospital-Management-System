import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: "" }, 
  address: { 
    line1: { type: String, default: "" },
    city: { type: String, default: "" }
  },
  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  phone: { type: String, default: "" },
  role: { 
    type: String, 
    enum: ['patient', 'doctor', 'admin'], 
    default: 'patient' 
  }
}, { timestamps: true }); 

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;