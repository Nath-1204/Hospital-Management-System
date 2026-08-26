import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import assets from '../assets/assets';
import {
  FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCalendarAlt,
  FaMapMarkerAlt, FaStethoscope, FaHeartbeat, FaAllergies, FaArrowLeft,
  FaHome, FaUserMd, FaUsers, FaCalendarCheck, FaFileInvoiceDollar, FaChartLine,
} from 'react-icons/fa';


const PatientDetail = () => {

  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { backendUrl, user, token, logout } = useContext(AuthContext);

  useEffect(() => {

    const fetchPatient = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + `/api/patients/${id}`, config);
        
        if (response.data.success) {
          setPatient(response.data.patient);
        } else {
          toast.error('Patient not found');
          navigate('/patients');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
        navigate('/patients');
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === 'admin') {
      fetchPatient();
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
          <p className="mt-4 text-gray-600">Loading patient...</p>
        </div>
      </div>
    );
  }

  if (!patient) return null;

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
        <Header title="Patient Details" user={user} />

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <button
                onClick={() => navigate('/patients')}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
              >
                <FaArrowLeft /> Back to patients list
              </button>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={patient.image || assets.defaultImage}
                  alt={patient.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
                  <p className="text-gray-500">{patient.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400 w-5" />
                      <span>{patient.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaVenusMars className="text-gray-400 w-5" />
                      <span>{patient.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400 w-5" />
                      <span>{patient.dob ? new Date(patient.dob).toLocaleDateString('fr-FR') : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400 w-5" />
                      <span>
                        {patient.address?.line1 || 'N/A'}, {patient.address?.city || ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Medical Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaHeartbeat className="text-gray-400 w-5" />
                      <span>Blood Group: {patient.bloodGroup || 'N/A'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaStethoscope className="text-gray-400 w-5 mt-1" />
                      <span>Medical History: {patient.medicalHistory || 'None'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaAllergies className="text-gray-400 w-5 mt-1" />
                      <span>Allergies: {patient.allergies?.length > 0 ? patient.allergies.join(', ') : 'None'}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700 mb-2">Account Details</h3>
                  <div className="bg-gray-50 p-3 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-gray-500">Role</span>
                      <p className="font-medium capitalize">{patient.role}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Joined</span>
                      <p className="font-medium">{new Date(patient.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
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

export default PatientDetail;