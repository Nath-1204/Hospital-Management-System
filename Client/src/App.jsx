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


const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>
    </div>
  )
}

export default App
