import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
  FaUserMd, FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaChartLine,
  FaSignOutAlt, FaBars, FaTimes, FaUser, FaHospitalUser, FaStethoscope,
  FaHome, FaClock, FaMoneyBillWave,
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';


const AdminDashboard = () => {

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    recentAppointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);


  useEffect(() => {

    const fetchDashboard = async () => {

      try {
        
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/dashboard/admin', config);

        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          toast.error('Unable to load statistics');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/admin-dashboard' },
    { label: 'Patients', icon: FaUsers, path: '/patients' },
    { label: 'Doctors', icon: FaUserMd, path: '/doctors' },
    { label: 'Appointments', icon: FaCalendarCheck, path: '/appointments' },
    { label: 'Billing', icon: FaFileInvoiceDollar, path: '/billing' },
    { label: 'Reports', icon: FaChartLine, path: '/reports' },
    { label: 'Profile', icon: FaUser, path: '/profile' },
  ];

  const statsCards = [
    {
      label: 'Total Patients',
      value: stats.totalPatients,
      icon: FaUsers,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Doctors',
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Appointments',
      value: stats.totalAppointments,
      icon: FaCalendarCheck,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaClock,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Total Revenue',
      value: `${stats.totalRevenue} Ar`,
      icon: FaMoneyBillWave,
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
        activePath="/admin-dashboard"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {statsCards.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100"
              >
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="text-2xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">📋 Recent Appointments</h2>
              <button
                className="text-sm text-indigo-600 hover:underline"
                onClick={() => navigate('/appointments')}
              >
                View all
              </button>
            </div>
            {stats.recentAppointments?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Patient
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Doctor
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recentAppointments.map((app, idx) => (
                      <tr key={idx} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {app.patientId?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {app.doctorId?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {new Date(app.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{app.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent appointments.</p>
            )}
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default AdminDashboard;