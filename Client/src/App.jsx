import React from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
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
 

const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/my-bills" element={<MyBills />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/appointments" element={<AdminAppointments />} />
        <Route path="/billing" element={<AdminBilling />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </div>
  )
}

export default App
