import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
  FaFileInvoiceDollar, FaCalendarCheck, FaUserMd, FaUser,
  FaSignOutAlt, FaHome, FaStethoscope, FaMoneyBillWave,
  FaEye, FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';


const MyBills = () => {

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchBills = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/bills/mybills', config);
        
        if (response.data.success) {
          setBills(response.data.bills);
        } else {
          toast.error('Unable to load bills');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBills();
    } else {
      navigate('/login');
    }
  }, [token, navigate, backendUrl]);

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/patient-dashboard' },
    { label: 'My Appointments', icon: FaCalendarCheck, path: '/my-appointments' },
    { label: 'My Bills', icon: FaFileInvoiceDollar, path: '/my-bills' },
    { label: 'Profile', icon: FaUser, path: '/profile' },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bills...</p>
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
        activePath="/my-bills"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="My Bills" user={user} />

        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {bills.length === 0 ? (
              <div className="p-8 text-center">
                <FaFileInvoiceDollar className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No bills found</h3>
                <p className="text-gray-500 mt-2">
                  You don't have any bills yet. Bills are generated after appointments.
                </p>
              </div>

            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appointment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
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
                    {bills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm text-gray-800">
                          #{bill.appointmentId?._id?.slice(-6) || 'N/A'}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-600">
                          {bill.appointmentId?.doctorId?.name || 'Unknown'}
                        </td>
                        
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {bill.appointmentId?.date
                            ? formatDate(bill.appointmentId.date)
                            : 'N/A'}
                        </td>

                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {bill.totalAmount} Ar
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {bill.paid ? (
                            <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                              <FaCheckCircle /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                              <FaTimesCircle /> Unpaid
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => navigate(`/bills/${bill._id}`)}
                            className="text-indigo-600 hover:text-indigo-800 transition"
                            title="View details"
                          >
                            <FaEye size={16} />
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

export default MyBills;