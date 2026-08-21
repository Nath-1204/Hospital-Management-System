import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaFileInvoiceDollar,
  FaPrescription,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaHospitalUser,
  FaStethoscope,
  FaHome,
} from 'react-icons/fa';


const Dashboard = () => {

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

 /*  useEffect(() => {
    const stored = localStorage.getItem('user');

    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      navigate('/login');
    }
  }, [navigate]); */

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const stats = [
    { label: 'Patients', value: 1248, icon: FaUsers, color: 'bg-blue-100 text-blue-600' },
    { label: 'Doctor', value: 24, icon: FaUserMd, color: 'bg-green-100 text-green-600' },
    { label: 'Appointment ', value: 36, icon: FaCalendarCheck, color: 'bg-purple-100 text-purple-600' },
    { label: 'Bill pending', value: 18, icon: FaFileInvoiceDollar, color: 'bg-amber-100 text-amber-600' },
  ];

  const recentAppointments = [
    { patient: 'Jean Dupont', doctor: 'Dr. Martin', date: '15/08/2026', time: '09:30', status: 'Confirmed' },
    { patient: 'Marie Curie', doctor: 'Dr. Lefèvre', date: '15/08/2026', time: '11:00', status: 'Pending' },
    { patient: 'Pierre Dubois', doctor: 'Dr. Moreau', date: '15/08/2026', time: '14:15', status: 'Completed' },
    { patient: 'Sophie Bernard', doctor: 'Dr. Martin', date: '16/08/2026', time: '10:00', status: 'Cancelled' },
  ];

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/dashboard' },
    { label: 'Patients', icon: FaUsers, path: '/patients' },
    { label: 'Doctors', icon: FaUserMd, path: '/doctors' },
    { label: 'Appointments', icon: FaCalendarCheck, path: '/appointments' },
    { label: 'Prescriptions', icon: FaPrescription, path: '/prescriptions' },
    { label: 'Billing', icon: FaFileInvoiceDollar, path: '/billing' },
    { label: 'Reports', icon: FaChartLine, path: '/reports' },
  ];

  /* if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  } */

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

        <div className={`p-4 border-b border-indigo-600 flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
          <div className="w-15 h-15 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
            {/* {user.name.charAt(0)} */} Name
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <p className="font-medium">{/* {user.name} */} User Name</p>
              <p className="text-xs text-cyan-200 capitalize">{/* {user.role} */} user Role</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-indigo-600 transition-colors ${
                item.path === '/dashboard' ? 'bg-indigo-800 border-r-4 border-cyan-400' : ''
              }`}
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
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <div className="w-15 h-15 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {/* {user.name.charAt(0)} */} Name
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-gray-100">
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

          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">📊 Appointments (7 last days)</h2>
            <div className="flex items-end gap-4 h-32">
              {[12, 18, 15, 22, 30, 28, 25].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                    style={{ height: `${(val / 30) * 100}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">J-{6 - i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">📅 Recent Appointment</h2>
              <a href="#" className="text-sm text-indigo-600 hover:underline">See all</a>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hour</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentAppointments.map((app, idx) => (
                    <tr key={idx} className="bg-gray-50 hover:bg-gray-300">
                      <td className="px-4 py-2 text-sm text-gray-800">{app.patient}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{app.doctor}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{app.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{app.time}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === 'Confirmed'
                              ? 'bg-green-100 text-green-700'
                              : app.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : app.status === 'Cancelled' 
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
          </div>

        </main>

      </div>
    </div>
  );
};

export default Dashboard;