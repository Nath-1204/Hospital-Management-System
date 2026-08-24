import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
  FaFileInvoiceDollar, FaHome, FaUserMd, FaUsers, FaCalendarCheck,
  FaChartLine, FaUser, FaPlus, FaCheckCircle, FaTimesCircle,
  FaEye, FaTrash, FaEdit, FaMoneyBillWave, FaStethoscope, FaTimes,
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';


const AdminBilling = () => {

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    appointmentId: '',
    medicineCharges: 0,
    labTestCharges: 0,
    discount: 0,
  });

  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  const fetchBills = async () => {

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(backendUrl + '/api/bills/admin', config);
      
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

  const fetchAppointments = async () => {

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(backendUrl + '/api/appointments/myAppointments', config);
      
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }

    } catch (error) {
      toast.error('Failed to load appointments');
    }
  };

  useEffect(() => {

    if (token && user?.role === 'admin') {
      fetchBills();
    } else {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const markAsPaid = async (id) => {

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(backendUrl + `/api/bills/${id}`, {}, config);
      
      if (response.data.success) {
        toast.success('Bill marked as paid');
        setBills(bills.map(b => b._id === id ? { ...b, paid: true } : b));
      } else {
        toast.error('Update failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  const generateBill = async (e) => {

    e.preventDefault();

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(backendUrl + '/api/bills', formData, config);
      
      if (response.data.success) {
        toast.success('Bill generated successfully');
        setShowModal(false);
        setFormData({ appointmentId: '', medicineCharges: 0, labTestCharges: 0, discount: 0 });
        fetchBills();
      } else {
        toast.error(response.data.message || 'Generation failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        activePath="/billing"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Billing Management" user={user} />

        <main className="flex-1 p-6">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                setShowModal(true);
                fetchAppointments();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
            >
              <FaPlus /> Generate Bill
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {bills.length === 0 ? (
              <div className="p-8 text-center">
                <FaFileInvoiceDollar className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No bills found</h3>
                <p className="text-gray-500 mt-2">There are no bills in the system yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {bills.map((bill) => (
                      <tr key={bill._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm text-gray-800">{bill.patientId?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{bill.appointmentId?.doctorId?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">#{bill.appointmentId?._id?.slice(-6) || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {bill.appointmentId?.date ? formatDate(bill.appointmentId.date) : 'N/A'}
                        </td>

                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{bill.totalAmount} Ar</td>
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
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => navigate(`/bills/${bill._id}`)}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="View details"
                            >
                              <FaEye size={16} />
                            </button>
                            {!bill.paid && (
                              <button
                                onClick={() => markAsPaid(bill._id)}
                                className="text-green-600 hover:text-green-800 transition"
                                title="Mark as paid"
                              >
                                <FaMoneyBillWave size={16} />
                              </button>
                            )}
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

      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Generate Bill</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={generateBill}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment</label>
                  <select
                    name="appointmentId"
                    value={formData.appointmentId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">-- Select an appointment --</option>
                    {appointments.map((app) => (
                      <option key={app._id} value={app._id}>
                        {app.patientId?.name} - {app.doctorId?.name} - {formatDate(app.date)} {app.time}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Charges (Ar)</label>
                  <input
                    type="number"
                    name="medicineCharges"
                    value={formData.medicineCharges}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lab Test Charges (Ar)</label>
                  <input
                    type="number"
                    name="labTestCharges"
                    value={formData.labTestCharges}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (Ar)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBilling;