import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEye, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';


const DoctorRow = ({ doctor, onDelete, onUpdate }) => {

  const navigate = useNavigate();
  const { backendUrl, token } = useContext(AuthContext);
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [availabilityInput, setAvailabilityInput] = useState('');

  const handleAvailabilityUpdate = async () => {

    try {

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const availabilityArray = availabilityInput.split(',').map(s => s.trim());
      
      const response = await axios.put(backendUrl + '/api/doctors/availability', {
        doctorId: doctor._id,
        availability: availabilityArray,
      }, config);

      if (response.data.success) {
        toast.success('Availability updated');
        setEditingAvailability(false);
        setAvailabilityInput('');
        onUpdate(); 
      } else {
        toast.error('Update failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating availability');
    }
  };

  const startEditing = () => {
    setEditingAvailability(true);
    setAvailabilityInput(doctor.availability?.join(', ') || '');
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-4 py-3 text-sm text-gray-800 flex items-center gap-2">
        <img
          src={doctor.userId?.image || 'https://via.placeholder.com/30'}
          alt={doctor.userId?.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        {doctor.userId?.name}
      </td>

      <td className="px-4 py-3 text-sm text-gray-600">{doctor.userId?.email}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{doctor.specialization}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{doctor.experience} yrs</td>
      <td className="px-4 py-3 text-sm text-gray-600">{doctor.fee} Ar</td>
      
      <td className="px-4 py-3 text-sm text-gray-600">
        {editingAvailability ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={availabilityInput}
              onChange={(e) => setAvailabilityInput(e.target.value)}
              placeholder="YYYY-MM-DDTHH:mm, ..."
              className="border rounded px-2 py-1 text-sm w-40"
            />

            <button onClick={handleAvailabilityUpdate} className="text-green-600 hover:text-green-800">
              <FaSave />
            </button>

            <button onClick={() => setEditingAvailability(false)} className="text-red-600 hover:text-red-800">
              <FaTimes />
            </button>

          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-xs">
              {doctor.availability?.length > 0
                ? doctor.availability.slice(0, 2).join(', ') +
                  (doctor.availability.length > 2 ? '...' : '')
                : 'No slots'}
            </span>
            <button onClick={startEditing} className="text-blue-600 hover:text-blue-800" title="Edit availability">
              <FaEdit size={14} />
            </button>
          </div>
        )}
      </td>

      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/doctors/${doctor._id}`)}
            className="text-blue-600 hover:text-blue-800 transition"
            title="View profile"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => onDelete(doctor._id, doctor.userId?.name)}
            className="text-red-600 hover:text-red-800 transition"
            title="Delete doctor"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DoctorRow;