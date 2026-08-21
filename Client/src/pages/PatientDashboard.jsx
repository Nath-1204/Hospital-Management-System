import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaUserMd, FaUsers, FaCalendarCheck, FaFileInvoiceDollar,
  FaPrescription, FaChartLine, FaSignOutAlt, FaBars, FaTimes,
  FaUser, FaHospitalUser, FaStethoscope, FaHome, FaClock,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';




const PatientDashboard = () => {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext)

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` }, };
        const response = await axios.get('/api/dashboard/patient', config);
        
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

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Déconnecté');
  };

  // Construction des cartes de statistiques
  const statsCards = [
    {
      label: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      icon: FaCalendarCheck,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Upcoming Appointments',
      value: stats?.upcomingAppointments || 0,
      icon: FaClock,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pending Appointments',
      value: stats?.pendingAppointments || 0,
      icon: FaClock,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Unpaid Bills',
      value: stats?.unpaidBills || 0,
      icon: FaFileInvoiceDollar,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Total spent',
      value: `${stats?.totalSpent || 0} €`,
      icon: FaMoneyBillWave,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/patient-dashboard' },
    { label: 'My Appointments', icon: FaCalendarCheck, path: '/my-appointments' },
    { label: 'My Bills', icon: FaFileInvoiceDollar, path: '/my-bills' },
    { label: 'Profil', icon: FaUser, path: '/profile' },
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg`}>
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
              <p className="font-medium">{user?.name || 'Patient'}</p>
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
                item.path === '/patient-dashboard' ? 'bg-indigo-800 border-r-4 border-cyan-400' : ''
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
            {sidebarOpen && <span>Deconnexion</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Patient</h1>
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

          {stats?.nextAppointment && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                📅 Next appointment
              </h2>
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{stats.nextAppointment.doctorId?.name}</p>
                  <p className="text-sm text-gray-600">
                    {stats.nextAppointment.doctorId?.specialization}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(stats.nextAppointment.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hour</p>
                  <p className="font-medium">{stats.nextAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stats.nextAppointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : stats.nextAppointment.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {stats.nextAppointment.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                📋 Last appointments
              </h2>
              <button
                className="text-sm text-indigo-600 hover:underline"
                onClick={() => navigate('/my-appointments')}
              >
                See all
              </button>
            </div>
            {stats?.recentAppointments?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Doctor
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Hour
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recentAppointments.map((app, idx) => (
                      <tr key={idx} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {app.doctorId?.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {new Date(app.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{app.time}</td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : app.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : app.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent appointments.
              </p>
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default PatientDashboard;