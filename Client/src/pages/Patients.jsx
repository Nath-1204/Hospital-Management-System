import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import assets from '../assets/assets';
import {
  FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCalendarAlt,
  FaTrash, FaEye, FaHome, FaUserMd, FaUsers,
  FaCalendarCheck, FaFileInvoiceDollar, FaChartLine, FaSignOutAlt, FaBars, FaTimes,
} from 'react-icons/fa';


const Patients = () => {

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, name: '' });
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchPatients = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/patients', config);
        
        if (response.data.success) {
          setPatients(response.data.patients);
        } else {
          toast.error('Unable to load patients');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === 'admin') {
      fetchPatients();
    } else {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const handleDelete = (id, name) => {
    setConfirmModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {

    const { id, name } = confirmModal;

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.delete(backendUrl + `/api/patients/${id}`, config);
      
      if (response.data.success) {
        toast.success(`Patient "${name}" deleted successfully`);
        setPatients(patients.filter((p) => p._id !== id));
      } else {
        toast.error('Deletion failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during deletion');
    } finally {
      setConfirmModal({ isOpen: false, id: null, name: '' });
    }
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, id: null, name: '' });
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
          <p className="mt-4 text-gray-600">Loading patients...</p>
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
        activePath="/patients"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
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
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {patients.length === 0 ? (
              <div className="p-8 text-center">
                <FaUsers className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No patients found</h3>
                <p className="text-gray-500 mt-2">There are no registered patients yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DOB
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {patients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-200 transition">
                        <td className="px-4 py-3 text-sm text-gray-800 flex items-center gap-2">
                          <img
                            src={patient.image || assets.defaultImage}
                            alt={patient.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {patient.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.phone || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{patient.gender || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {patient.dob ? new Date(patient.dob).toLocaleDateString('fr-FR') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => navigate(`/patients/${patient._id}`)}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="View profile"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(patient._id, patient.name)}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Delete patient"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete patient "${confirmModal.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Patients;