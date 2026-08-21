import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./configs/db.js";
import authRouter from "./routes/authRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import patientRouter from "./routes/patientRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import connectCloudinary from "./configs/cloudinary.js";
import seedAdmin from "./configs/adminSeed.js";

//  app config
const app = express();
const port = process.env.PORT || 5000;
connectDb();
connectCloudinary();
seedAdmin();

// middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/patients", patientRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
    res.send('API is running....');
})

app.listen(port, () => console.log('Server is running on port', port));
