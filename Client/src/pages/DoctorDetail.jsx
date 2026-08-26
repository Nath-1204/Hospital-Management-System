import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import assets from '../assets/assets';
import {
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaVenusMars,
  FaStethoscope, FaBriefcase, FaMoneyBillWave, FaClock, FaArrowLeft,
  FaHome, FaUserMd, FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaChartLine,
} from 'react-icons/fa';


const DoctorDetail = () => {

  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchDoctor = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + `/api/doctors/${id}`, config);
        
        if (response.data.success) {
          setDoctor(response.data.doctor);
        } else {
          toast.error('Doctor not found');
          navigate('/doctors');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }

    };

    if (token && user?.role === 'admin') {
      fetchDoctor();
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
          <p className="mt-4 text-gray-600">Loading doctor...</p>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  const userData = doctor.userId;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        logout={logout}
        navItems={navItems}
        activePath="/doctors"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Doctor Details" user={user} />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <button
                onClick={() => navigate('/doctors')}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
              >
                <FaArrowLeft /> Back to doctors list
              </button>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={userData?.image || assets.defaultImage}
                  alt={userData?.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{userData?.name}</h2>
                  <p className="text-indigo-600">{doctor.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span>{userData?.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <span>{userData?.phone || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaVenusMars className="text-gray-400" />
                      <span>{userData?.gender || 'Not specified'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{userData?.dob ? new Date(userData.dob).toLocaleDateString('fr-FR') : 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span>Joined: {new Date(doctor.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Professional Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaStethoscope className="text-gray-400" />
                      <span>Specialization: {doctor.specialization}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-gray-400" />
                      <span>Experience: {doctor.experience} years</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-gray-400" />
                      <span>Consultation Fee: {doctor.fee} Ar</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <span>Availability: {doctor.availability?.length || 0} slots</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>{userData?.address?.line1 || 'N/A'}</p>
                    <p>{userData?.address?.city || 'N/A'}</p>
                  </div>
                </div>

                {doctor.availability?.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-700 mb-2">All Availability Slots</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availability.map((slot, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDetail;