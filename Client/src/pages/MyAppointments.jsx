import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaCalendarCheck, FaUserMd, FaUser, FaSignOutAlt, FaBars,
  FaTimes, FaStethoscope, FaHome, FaCheckCircle, FaTimesCircle,
  FaClock, FaPrescription,
} from 'react-icons/fa';
import { AuthContext } from "../context/AuthContext"


const MyAppointments = () => {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchAppointments = async () => {

      try {
        const config = { headers: { Authorization: `Bearer ${token}` }};
        const response = await axios.get('/api/appointments/myAppointments', config);
        
        if (response.data.success) {
          setAppointments(response.data.appointments);
        } else {
          toast.error('Unable to load appointments');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const updateStatus = async (appointmentId, newStatus) => {

    try {

      const config = {headers: { Authorization: `Bearer ${token}` }};

      const response = await axios.put(`/api/appointments/${appointmentId}/status`, { status: newStatus }, config);
      
      if (response.data.success) {
        toast.success(`Appointment ${newStatus} successful`);
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: newStatus } : app
          )
        );

      } else {
        toast.error('Update failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during update');
    }
  };

  const cancelAppointment = (id) => {
    if (window.confirm('Do you really want to cancel this appointment?')) {
      updateStatus(id, 'cancelled');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Disconnected');
  };

  const getNavItems = () => {
    const base = [
      { label: 'Dashboard', icon: FaHome, path: `/${user?.role}-dashboard` },
      { label: 'My Appointment', icon: FaCalendarCheck, path: '/my-appointments' },
    ];
    if (user?.role === 'doctor') {
      base.push({ label: 'Prescriptions', icon: FaPrescription, path: '/prescriptions' });
    }
    if (user?.role === 'patient') {
      base.push({ label: 'Profil', icon: FaUser, path: '/profile' });
    }
    return base;
  };

  const navItems = getNavItems();

  // Affichage du statut avec badge coloré
  const renderStatusBadge = (status) => {
    const classes = {
      pending: 'bg-amber-100 text-amber-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-600'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Boutons d'action selon le rôle et le statut
  const renderActions = (app) => {
    const isPatient = user?.role === 'patient';
    const isDoctor = user?.role === 'doctor';
    const isAdmin = user?.role === 'admin';

    if (isPatient && app.status !== 'cancelled' && app.status !== 'completed') {
      return (
        <button
          onClick={() => cancelAppointment(app._id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Cancel
        </button>
      );
    }

    if (isDoctor || isAdmin) {
      if (app.status === 'pending') {
        return (
          <div className="flex gap-2">
            <button
              onClick={() => updateStatus(app._id, 'confirmed')}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => updateStatus(app._id, 'cancelled')}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Refuse
            </button>
          </div>
        );
      }
      if (app.status === 'confirmed') {
        return (
          <button
            onClick={() => updateStatus(app._id, 'completed')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            To end
          </button>
        );
      }
    }

    return <span className="text-gray-400 text-sm">No action</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center w-full'}`}>
            <FaStethoscope className="text-2xl text-cyan-300" />
            {sidebarOpen && <span className="text-xl font-bold">HMS</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-cyan-200 transition"
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <div
          className={`p-4 border-b border-indigo-600 flex items-center gap-3 ${
            !sidebarOpen && 'justify-center'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <p className="font-medium">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-cyan-200 capitalize">{user?.role || 'patient'}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-indigo-600 transition-colors ${
                item.path === '/my-appointments' ? 'bg-indigo-800 border-r-4 border-cyan-400' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              <item.icon className="text-xl flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-600/30 transition text-red-300 hover:text-white"
          >
            <FaSignOutAlt className="text-xl flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
              <FaCalendarCheck className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No appointments found</h3>
              <p className="text-gray-500 mt-2">
                You do not yet have any scheduled appointments.
              </p>
              {user?.role === 'patient' && (
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700"
                >
                  Make an appointment
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {appointments.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {app.patientId?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {app.doctorId?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(app.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.time}</td>
                        <td className="px-4 py-3 text-sm">{renderStatusBadge(app.status)}</td>
                        <td className="px-4 py-3 text-sm">{renderActions(app)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
};

export default MyAppointments;