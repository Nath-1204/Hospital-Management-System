import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaEnvelope, FaEye, FaEyeSlash, FaLock,
  FaSignInAlt, FaUser, FaUserPlus, FaStethoscope,
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';


const Login = () => {

  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, setToken, backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      let endpoint = '';
      let payload = {};

      if (state === 'login') {
        endpoint = '/api/auth/login';
        payload = { email, password };
      } else {
        endpoint = '/api/auth/register';
        payload = { name, email, password, role: 'patient' };
      }

      const response = await axios.post(`${backendUrl}${endpoint}`, payload);
      const { success, token, user, message } = response.data;

      if (success) {

        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success(state === 'login' ? 'Connexion successful !' : 'Account successfully created!');

        if (user.role === 'admin') navigate('/admin-dashboard');
        else if (user.role === 'doctor') navigate('/doctor-dashboard');
        else navigate('/patient-dashboard');
      } else {
        toast.error(message || 'An error has occurred');
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Server connection error';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-indigo-100 transition-all hover:shadow-3xl">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <FaStethoscope className="text-3xl" />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-800">
              {state === 'login' ? 'Login' : 'Register'}{' '}
              <span className="text-indigo-600">User</span>
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              {state === 'login'
                ? 'Welcome back! Please enter your details.'
                : 'Create an account to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {state === 'register' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-indigo-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-gray-50 hover:bg-white"
                  required
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-indigo-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-gray-50 hover:bg-white"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-indigo-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 bg-gray-50 hover:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-500 hover:text-indigo-700 transition"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-300/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-75"
                    />
                    <path
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      fill="currentColor"
                    />
                  </svg>
                  {state === 'login' ? 'Connexion...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {state === 'login' ? (
                    <>
                      <FaSignInAlt /> Connexion
                    </>
                  ) : (
                    <>
                      <FaUserPlus /> Create an account
                    </>
                  )}
                </>
              )}
            </button>

            <div className="text-center text-sm mt-4">
              {state === 'login' ? (
                <>
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-indigo-600 font-medium hover:text-indigo-800 transition hover:underline"
                      onClick={() => setState('register')}
                    >
                      Register
                    </button>
                  </p>
                  <a
                    href="#"
                    className="block mt-2 text-indigo-500 hover:text-indigo-700 hover:underline transition"
                  >
                    Forgot your password?
                  </a>
                </>
              ) : (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-indigo-600 font-medium hover:text-indigo-800 transition hover:underline"
                    onClick={() => setState('login')}
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Hospital Management System
        </p>
      </div>
    </div>
  );
};

export default Login;