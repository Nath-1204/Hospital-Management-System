import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  FaPrescription, FaHome, FaCalendarCheck,
  FaUser, FaEdit, FaEye, FaStethoscope,
} from 'react-icons/fa';


const DoctorPrescriptions = () => {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchAppointments = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/appointments/myAppointments', config);
       
        if (response.data.success) {
          const withPrescription = response.data.appointments.filter(app => app.prescription && app.prescription.trim() !== '');
          setAppointments(withPrescription);
        } else {
          toast.error('Unable to load prescriptions');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === 'doctor') {
      fetchAppointments();
    } else {
      navigate('/login');
    }
  }, [token, user, navigate, backendUrl]);

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
          <p className="mt-4 text-gray-600">Loading prescriptions...</p>
        </div>
      </div>
    );
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
        <Header title="My Prescriptions" user={user} />

        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {appointments.length === 0 ? (
              <div className="p-8 text-center">
                <FaPrescription className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No prescriptions yet</h3>
                <p className="text-gray-500 mt-2">
                  You haven't written any prescriptions. You can write one after completing an appointment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {appointments.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm text-gray-800">{app.patientId?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(app.date).toLocaleDateString('fr-FR')} {app.time}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                          {app.prescription}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => navigate(`/prescription/${app._id}`)}
                            className="text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
                            title="View / Edit prescription"
                          >
                            <FaEdit size={16} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;