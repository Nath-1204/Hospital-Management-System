import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import {
  FaUser, FaHome, FaUserMd, FaUsers, FaCalendarCheck,
  FaFileInvoiceDollar, FaChartLine, FaCheckCircle, FaTimesCircle,
  FaClock, FaSyncAlt,
} from 'react-icons/fa';
import Header from '../components/Header';


const AdminAppointments = () => {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, newStatus: '', message: '' });
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);


  const fetchAppointments = async () => {

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(backendUrl + '/api/appointments/myAppointments', config);
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

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchAppointments();
    } else {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const updateStatus = async (id, newStatus) => {

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        backendUrl + `/api/appointments/${id}/status`,
        { status: newStatus },
        config
      );

      if (response.data.success) {
        toast.success(`Appointment ${newStatus} successfully`);
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app
          )
        );

      } else {
        toast.error('Update failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during update');
    } finally {
      setConfirmModal({ isOpen: false, id: null, newStatus: '', message: '' });
    }
  };

  const confirmAction = (id, newStatus, actionName) => {
    setConfirmModal({
      isOpen: true,
      id,
      newStatus,
      message: `Are you sure you want to ${actionName} this appointment?`,
    });
  };

  const handleConfirm = () => {
    const { id, newStatus } = confirmModal;
    updateStatus(id, newStatus);
  };

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

  const renderActions = (app) => {

    const { _id, status } = app;

    if (status === 'pending') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => confirmAction(_id, 'confirmed', 'confirm')}
            className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
          >
            <FaCheckCircle /> Confirm
          </button>
          <button
            onClick={() => confirmAction(_id, 'cancelled', 'cancel')}
            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
          >
            <FaTimesCircle /> Cancel
          </button>
        </div>
      );
    }

    if (status === 'confirmed') {
      return (
        <button
          onClick={() => confirmAction(_id, 'completed', 'complete')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          <FaClock /> Complete
        </button>
      );
    }

    if (status === 'completed') {
      return <span className="text-gray-400 text-sm">Completed</span>;
    }

    if (status === 'cancelled') {
      return <span className="text-gray-400 text-sm">Cancelled</span>;
    }

    return null;
  };

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/admin-dashboard' },
    { label: 'Patients', icon: FaUsers, path: '/patients' },
    { label: 'Doctors', icon: FaUserMd, path: '/doctors' },
    { label: 'Appointments', icon: FaCalendarCheck, path: '/appointments' },
    { label: 'Billing', icon: FaFileInvoiceDollar, path: '/billing' },
    { label: 'Reports', icon: FaChartLine, path: '/reports' },
    { label: 'Profile', icon: FaUser, path: '/admin-profile' },
  ];

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
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        logout={logout}
        navItems={navItems}
        activePath="/appointments"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title={"All Appointments"} user={user}/>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {appointments.length === 0 ? (
              <div className="p-8 text-center">
                <FaCalendarCheck className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No appointments found</h3>
                <p className="text-gray-500 mt-2">There are no appointments in the system.</p>
              </div>

            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
            )}
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null, newStatus: '', message: '' })}
        onConfirm={handleConfirm}
        title="Confirm Action"
        message={confirmModal.message}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminAppointments;