import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import PatientDashboard from './pages/PatientDashboard'
import MyAppointments from './pages/MyAppointments'
import BookAppointment from './pages/BookAppointment'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import Patients from './pages/Patients'
import Doctors from './pages/Doctors'
import { Navigate } from "react-router-dom"
import AdminProfile from './pages/AdminProfile'
import AdminAppointments from './pages/AdminAppointments'
import MyBills from './pages/MyBills'
import AdminBilling from './pages/AdminBilling'
import Reports from './pages/Reports'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorAppointments from './pages/DoctorAppointments'
import DoctorPrescriptions from './pages/DoctorPrescriptions'
import PrescriptionDetail from './pages/PrescriptionDetail'
import DoctorProfile from './pages/DoctorProfile'
import BillDetail from './pages/BillDetail'
import { Toaster } from "react-hot-toast"
import DoctorDetail from './pages/DoctorDetail'
import PatientDetail from './pages/PatientDetail'
 

const App = () => {

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/my-bills" element={<MyBills />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/appointments" element={<AdminAppointments />} />
        <Route path="/billing" element={<AdminBilling />} />
        <Route path="/bills/:id" element={<BillDetail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/prescriptions" element={<DoctorPrescriptions />} />
        <Route path="/prescription/:id" element={<PrescriptionDetail />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
      </Routes>
    </div>
  )
}

export default App
