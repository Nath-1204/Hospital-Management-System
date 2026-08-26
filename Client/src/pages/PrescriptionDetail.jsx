import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  FaPrescription, FaHome, FaCalendarCheck, FaUser,
  FaSave, FaArrowLeft, FaStethoscope,
} from 'react-icons/fa';


const PrescriptionDetail = () => {

  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchAppointment = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/appointments/myAppointments', config);
        
        if (response.data.success) {
          const app = response.data.appointments.find(a => a._id === id);
          
          if (app) {
            setAppointment(app);
            setPrescription(app.prescription || '');
          } else {
            toast.error('Appointment not found');
            navigate('/doctor-appointments');
          }

        } else {
          toast.error('Failed to load appointment');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === 'doctor') {
      fetchAppointment();
    } else {
      navigate('/login');
    }
  }, [id, token, user, navigate, backendUrl]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        backendUrl + `/api/appointments/${id}/prescription`,
        { prescription },
        config
      );

      if (response.data.success) {
        toast.success('Prescription updated successfully');
        navigate('/prescriptions');
      } else {
        toast.error('Update failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving prescription');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/doctor-dashboard' },
    { label: 'My Appointments', icon: FaCalendarCheck, path: '/doctor-appointments' },
    { label: 'Prescriptions', icon: FaPrescription, path: '/prescriptions' },
    { label: 'Profile', icon: FaUser, path: '/doctor-profile' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        logout={logout}
        navItems={navItems}
        activePath="/prescriptions"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Prescription Details" user={user} />

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigate('/prescriptions')}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                >
                  <FaArrowLeft /> Back to prescriptions
                </button>
                <span className="text-sm text-gray-500">
                  Appointment: {new Date(appointment.date).toLocaleDateString('fr-FR')} at {appointment.time}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">{appointment.patientId?.name}</p>
                <p className="text-sm text-gray-500 mt-2">Doctor</p>
                <p className="font-medium">{appointment.doctorId?.name}</p>
              </div>

              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prescription
                  </label>
                  <textarea
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    rows="8"
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Write prescription details here..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                          <path d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" fill="currentColor" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Prescription
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </main>
      </div>
      
    </div>
  );
};

export default PrescriptionDetail;