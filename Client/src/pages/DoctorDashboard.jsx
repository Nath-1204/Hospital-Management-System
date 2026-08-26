import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
  FaCalendarCheck, FaClock, FaUserMd, FaUsers, FaMoneyBillWave,
  FaStethoscope, FaHome, FaUser, FaFileInvoiceDollar, FaChartLine, FaPrescription,
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


const DoctorDashboard = () => {

  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    upcomingAppointments: 0,
    totalRevenue: 0,
    recentPatients: [],
    doctorProfile: {
      specialization: '',
      experience: 0,
      fee: 0,
      availability: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/dashboard/doctor', config);
        
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
  }, [token, navigate, backendUrl]);

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/doctor-dashboard' },
    { label: 'My Appointments', icon: FaCalendarCheck, path: '/doctor-appointments' },
    { label: 'Prescriptions', icon: FaPrescription, path: '/prescriptions' },
    { label: 'Profile', icon: FaUser, path: '/doctor-profile' },
  ];

  const statsCards = [
    {
      label: 'Total Appointments',
      value: stats.totalAppointments,
      icon: FaCalendarCheck,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaClock,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: FaClock,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: FaCalendarCheck,
      color: 'bg-purple-100 text-purple-600',
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
        activePath="/doctor-dashboard"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Doctor Dashboard" user={user} />

        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">👨‍⚕️ Your Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium text-gray-800">{stats.doctorProfile.specialization || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium text-gray-800">{stats.doctorProfile.experience} years</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="font-medium text-gray-800">{stats.doctorProfile.fee} Ar</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Available Slots</p>
                <p className="font-medium text-gray-800">{stats.doctorProfile.availability?.length || 0}</p>
              </div>
            </div>

            {stats.doctorProfile.availability?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">Recent Availability</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {stats.doctorProfile.availability.slice(0, 5).map((slot, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                    >
                      {slot}
                    </span>
                  ))}
                  {stats.doctorProfile.availability.length > 5 && (
                    <span className="text-xs text-gray-400">+{stats.doctorProfile.availability.length - 5} more</span>
                  )}
                </div>
              </div>
            )}
          </div>

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
              <h2 className="text-lg font-semibold text-gray-700">📋 Recent Patients</h2>
              <button
                className="text-sm text-indigo-600 hover:underline"
                onClick={() => navigate('/my-appointments')}
              >
                View all
              </button>
            </div>

            {stats.recentPatients?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {stats.recentPatients.map((patient, idx) => (
                      <tr key={idx} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-2 text-sm text-gray-800">{patient.patientId?.name || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{patient.patientId?.email || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{patient.patientId?.phone || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent patients.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;