import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import assets from '../assets/assets';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt,
  FaVenusMars, FaStethoscope, FaHome, FaCalendarCheck, FaSave,
  FaCamera, FaFileInvoiceDollar, FaChartLine, FaUserMd, FaUsers,
  FaBriefcase, FaMoneyBillWave, FaClock,
} from 'react-icons/fa';


const DoctorProfile = () => {
  
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: { line1: '', city: '' },
    image: '',
    specialization: '',
    experience: '',
    fee: '',
    availability: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { backendUrl, user, setUser, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/doctors/profile', config);
        
        if (response.data.success) {
          const data = response.data.doctor;
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            gender: data.gender || 'Not Selected',
            dob: data.dob || '',
            address: data.address || { line1: '', city: '' },
            image: data.image || '',
            specialization: data.specialization || '',
            experience: data.experience || '',
            fee: data.fee || '',
            availability: data.availability || [],
          });

        } else {
          toast.error('Unable to load profile');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [token, user, navigate, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    const array = value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, availability: array }));
  };

  const handleImageChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('The image must not exceed 2 MB');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {

      setUploading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(backendUrl + '/api/upload', formDataUpload, {
        ...config,
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setFormData((prev) => ({ ...prev, image: response.data.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Image upload failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        image: formData.image,
        specialization: formData.specialization,
        experience: formData.experience,
        fee: formData.fee,
        availability: formData.availability,
      };

      const response = await axios.put(backendUrl + '/api/doctors/profile', payload, config);
      
      if (response.data.success) {
        toast.success('Profile updated successfully!');

        setUser((prev) => ({
          ...prev,
          name: formData.name,
          image: formData.image,
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
        }));

        const updatedUser = { ...user, name: formData.name, image: formData.image };
        localStorage.setItem('user', JSON.stringify(updatedUser));

      } else {
        toast.error('Update failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error during update');
    } finally {
      setSaving(false);
    }
  };

  
  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/doctor-dashboard' },
    { label: 'My Appointments', icon: FaCalendarCheck, path: '/doctor-appointments' },
    { label: 'Prescriptions', icon: FaStethoscope, path: '/prescriptions' },
    { label: 'Profile', icon: FaUser, path: '/doctor-profile' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
        activePath="/doctor-profile"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header title="Doctor Profile" user={user} />

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <img
                    src={formData.image || assets.defaultImage}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700 transition"
                  >
                    <FaCamera size={14} />
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click the icon to change the photo'}
                  </p>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Delete photo
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaVenusMars className="text-gray-400" />
                    </div>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Not Selected">Not specified</option>
                      <option value="Male">Man</option>
                      <option value="Female">Women</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaStethoscope className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (Ar)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMoneyBillWave className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="fee"
                      value={formData.fee}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address (line 1)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="line1"
                      value={formData.address.line1}
                      onChange={handleAddressChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability (comma separated, format YYYY-MM-DDTHH:MM)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability.join(', ')}
                      onChange={handleAvailabilityChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500"
                      placeholder="2026-09-01T09:00, 2026-09-01T10:00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Example: 2026-09-01T09:00, 2026-09-01T10:00</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                        <path d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" fill="currentColor" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorProfile;