import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import assets from '../assets/assets';


const Sidebar = ({ sidebarOpen, setSidebarOpen, user, logout, navItems, activePath }) => {
  
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logout');
    };

  return (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg h-full`}
    >

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
        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          <img
            src={user?.image || assets.defaultImage}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        {sidebarOpen && (
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-cyan-200 capitalize truncate">{user?.role || 'patient'}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-indigo-600 transition-colors cursor-pointer ${
              activePath === item.path ? 'bg-indigo-800 border-r-4 border-cyan-400' : ''
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
  );
};

export default Sidebar;