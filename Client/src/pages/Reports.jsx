import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  FaHome, FaUserMd, FaUsers, FaCalendarCheck, FaFileInvoiceDollar,
  FaChartLine, FaUser, FaStethoscope, FaSyncAlt
} from 'react-icons/fa';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);


const Reports = () => {

  const [appointmentStats, setAppointmentStats] = useState({ months: [], counts: [] });
  const [revenueStats, setRevenueStats] = useState({ months: [], revenues: [] });
  const [doctorDistribution, setDoctorDistribution] = useState({ labels: [], data: [] });
  const [patientDistribution, setPatientDistribution] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  const fetchReports = async () => {

    try {

      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [
        appointmentsRes,
        revenueRes,
        doctorDistRes,
        patientDistRes
      ] = await Promise.all([
        axios.get(backendUrl + '/api/reports/appointments-stats', config),
        axios.get(backendUrl + '/api/reports/revenue-stats', config),
        axios.get(backendUrl + '/api/reports/doctor-distribution', config),
        axios.get(backendUrl + '/api/reports/patient-distribution', config),
      ]);

      if (appointmentsRes.data.success) {
        setAppointmentStats(appointmentsRes.data);
      }

      if (revenueRes.data.success) {
        setRevenueStats(revenueRes.data);
      }
      
      if (doctorDistRes.data.success) {
        setDoctorDistribution(doctorDistRes.data);
      }

      if (patientDistRes.data.success) {
        setPatientDistribution(patientDistRes.data);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchReports();
    } else {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/admin-dashboard' },
    { label: 'Patients', icon: FaUsers, path: '/patients' },
    { label: 'Doctors', icon: FaUserMd, path: '/doctors' },
    { label: 'Appointments', icon: FaCalendarCheck, path: '/appointments' },
    { label: 'Billing', icon: FaFileInvoiceDollar, path: '/billing' },
    { label: 'Reports', icon: FaChartLine, path: '/reports' },
    { label: 'Profile', icon: FaUser, path: '/admin-profile' },
  ];

  const appointmentChartData = {
    labels: appointmentStats.months.map(m => {
      const [year, month] = m.split('-');
      return `${month}/${year.slice(2)}`;
    }),
    datasets: [
      {
        label: 'Number of Appointments',
        data: appointmentStats.counts,
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const revenueChartData = {
    labels: revenueStats.months.map(m => {
      const [year, month] = m.split('-');
      return `${month}/${year.slice(2)}`;
    }),
    datasets: [
      {
        label: 'Revenue (Ar)',
        data: revenueStats.revenues,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doctorPieData = {
    labels: doctorDistribution.labels,
    datasets: [
      {
        label: 'Appointments per Doctor',
        data: doctorDistribution.data,
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const patientPieData = {

    labels: patientDistribution.labels,
    datasets: [
      {
        label: 'Patients per Doctor',
        data: patientDistribution.data,
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
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
        activePath="/reports"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Analytics & Reports" user={user} />

        <main className="flex-1 p-6">
          <div className="mb-4 flex justify-end">
            <button
              onClick={fetchReports}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <FaSyncAlt /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Appointments</h3>
              <Bar data={appointmentChartData} options={chartOptions} />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Revenue (Ar)</h3>
              <Line data={revenueChartData} options={chartOptions} />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Appointments per Doctor</h3>
              {doctorDistribution.labels.length > 0 ? (
                <Pie data={doctorPieData} options={chartOptions} />
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Patients per Doctor</h3>
              {patientDistribution.labels.length > 0 ? (
                <Pie data={patientPieData} options={chartOptions} />
              ) : (
                <p className="text-gray-500 text-center py-8">No data available</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;