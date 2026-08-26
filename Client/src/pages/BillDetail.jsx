import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  FaFileInvoiceDollar, FaHome, FaUserMd, FaUsers,
  FaCalendarCheck, FaChartLine, FaUser, FaArrowLeft,
} from 'react-icons/fa';


const BillDetail = () => {

  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchBill = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + `/api/bills/${id}`, config);
        
        if (response.data.success) {
          setBill(response.data.bill);
        } else {
          toast.error('Bill not found');
          navigate('/billing');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
        navigate('/billing');
      } finally {
        setLoading(false);
      }

    };
    
    if (token && user?.role === 'admin') {
      fetchBill();
    } else {
      navigate('/login');
    }
  }, [id, token, user, navigate, backendUrl]);

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
          <p className="mt-4 text-gray-600">Loading bill...</p>
        </div>
      </div>
    );
  }

  if (!bill) return null;

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
        <Header title="Bill Details" user={user} />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <button
                onClick={() => navigate('/billing')}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
              >
                <FaArrowLeft /> Back to billing
              </button>

              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Invoice #{bill._id.slice(-6)}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(bill.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Patient</h3>
                  <p>{bill.patientId?.name}</p>
                  <p className="text-sm text-gray-600">{bill.patientId?.email}</p>
                  <p className="text-sm text-gray-600">{bill.patientId?.phone}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Doctor</h3>
                  <p>{bill.appointmentId?.doctorId?.name}</p>
                  <p className="text-sm text-gray-600">
                    Appointment: {new Date(bill.appointmentId?.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-4">Bill Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Consultation Fee</span>
                    <span>{bill.consultationFee} Ar</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Medicine Charges</span>
                    <span>{bill.medicineCharges} Ar</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Lab Test Charges</span>
                    <span>{bill.labTestCharges} Ar</span>
                  </div>

                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>- {bill.discount} Ar</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>{bill.totalAmount} Ar</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={bill.paid ? 'text-green-600' : 'text-red-600'}>
                      {bill.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BillDetail;