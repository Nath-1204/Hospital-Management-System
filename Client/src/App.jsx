import React from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PatientDashboard from './pages/PatientDashboard'
import MyAppointments from './pages/MyAppointments'
import BookAppointment from './pages/BookAppointment'


const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </div>
  )
}

export default App
