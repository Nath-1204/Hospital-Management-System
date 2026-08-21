import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaSignInAlt, FaUser, FaUserPlus } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'


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

          toast.success(state === 'login' ? 'Connexion sucessfull !' : ' Account successfully created!');

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

    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-slate-50 p-8 rounded-md shadow-md border border-indigo-600 rounded-xl">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            {state === 'login' ? 'Login' : "Register"}
            <span className="text-gray-800 pl-3">User</span>
          </h2>
          <p className="text-gray-800 text-xs mb-5 mt-2">
            {state === 'login' ? 'Welcome back! Please enter your details.' : 'Create an account to get started.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {state === 'register' && (
            <div className="relative form-group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center gap-2">
                <FaUser className="text-indigo-600" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 px-4 py-2 border rounded border border-gray-300 placeholder-gray-400"
                required
              />
            </div>
          )}

          <div className="relative form-group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center gap-2">
              <FaEnvelope className="text-indigo-600" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 px-4 py-2 border rounded border border-gray-300 placeholder-gray-400"
              required
            />
          </div>

          <div className="relative form-group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center gap-2">
              <FaLock className="text-indigo-600" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 px-4 py-2 border rounded border border-gray-300 placeholder-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2 mb-2 text-indigo-600 transition"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />} 
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="flex w-full bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 font-semibold py-2 rounded-xl items-center justify-center gap-3 transition duration-300"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                  <circle
                    cx="20"
                    cy="20"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className='opacity-75'
                  />
                  <path
                    d="M16,23 A1,1 0 0,1 34,23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="opacity-75"
                  />
                  {state === 'login' ? 'Connexion...' : 'Creating account...'}
                </svg>
              </>
            ) : (
              <>
                {state === 'login' ? (
                  <>
                    <FaSignInAlt />
                    Connexion
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Create an account
                  </>
                )}
              </>
            )}
          </button>

          <div className="text-center">
            <h3 className='text-xs mt-2'>
              {state === 'login' ? (
                <>
                  Don't have an account? {''}
                  <button 
                    className="text-cyan-0 text-lg font-medium hover:text-cyan-600 transition cursor-pointer"
                    onClick={() => setState('register')}
                  >
                    Register
                  </button>
                  <a href='#' className="block text-xs hover:underline hover:text-cyan-500 cursor-pointer">
                    Forgot your password? 
                  </a>
                </>
              ) : (
                <>
                  Already have an account? {''}
                  <button 
                    className="text-cyan-500 text-lg font-medium hover:text-cyan-600 transition cursor-pointer"
                    onClick={() => setState('login')}
                  >
                    Sign in
                  </button>
                </>
              )}
            </h3>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
