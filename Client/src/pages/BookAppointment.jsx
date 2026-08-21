import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {
  FaCalendarAlt, FaClock, FaStethoscope, FaSignOutAlt, 
  FaBars, FaTimes, FaHome, FaUser, FaFileInvoiceDollar,
} from 'react-icons/fa';


const BookAppointment = () => {

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { backendUrl, user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchDoctors = async () => {

      try {

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(backendUrl + '/api/doctors/allDoctor', config);
        
        if (response.data.success) {
          setDoctors(response.data.doctors);
        } else {
          toast.error('Unable to load the list of doctors');
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Loading error');
      }
    };

    if (token) {
      fetchDoctors();
    } else {
      navigate('/login');
    }

  }, [token, navigate]);


  useEffect(() => {

    if (selectedDoctor) {

      const doctor = doctors.find((d) => d._id === selectedDoctor);

      if (doctor && doctor.availability) {
        const slots = doctor.availability.sort();
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }

      setSelectedDate('');
      setSelectedTime('');
    } else {
      setAvailableSlots([]);
      setSelectedDate('');
      setSelectedTime('');
    }
  }, [selectedDoctor, doctors]);

  const getUniqueDates = () => {
    const dates = availableSlots.map((slot) => slot.split('T')[0]);
    return [...new Set(dates)];
  };

  const getTimesForDate = (date) => {
    return availableSlots
      .filter((slot) => slot.startsWith(date))
      .map((slot) => slot.split('T')[1]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error('Please select a doctor, a date and a time');
      return;
    }

    setLoading(true);

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        notes: '',
      };

      const response = await axios.post(backendUrl + '/api/appointments/book', payload, config);
      
      if (response.data.success) {
        toast.success('Appointment successfully booked !');
        navigate('/my-appointments');
      } else {
        toast.error(response.data.message || 'Reservation failed');
      }

    } catch (error) {
      const msg = error.response?.data?.message || 'Error during booking';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Disconnected');
  };

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/patient-dashboard' },
    { label: 'My Appointments', icon: FaCalendarAlt, path: '/my-appointments' },
    { label: 'My Bills', icon: FaFileInvoiceDollar, path: '/my-bills' },
    { label: 'Profil', icon: FaUser, path: '/profile' },
  ];

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
                item.path === '/book-appointment' ? 'bg-indigo-800 border-r-4 border-cyan-400' : ''
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
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Make an Appointment</h1>
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-700 mb-6">
                Fill in the information
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a doctor
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">-- Select --</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.userId?.name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDoctor && availableSlots.length > 0 && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose a date
                      </label>
                      <select
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime(''); 
                        }}
                        className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">-- Choose a date --</option>
                        {getUniqueDates().map((date) => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString('fr-FR')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedDate && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Choose a time
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">-- Select a time --</option>
                          {getTimesForDate(selectedDate).map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}

                {selectedDoctor && availableSlots.length === 0 && (
                  <p className="text-amber-600 text-sm mb-4">
                    This doctor does not have any available appointments at the moment.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedDoctor || !selectedDate || !selectedTime}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Reservation in progress...' : 'Book'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;