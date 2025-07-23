import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../api';
import bgImage from '../../assets/elianna-gill-DppEkXKjahk-unsplash.jpg';
import BackgroundImage from '../../components/BackgroundImage';
import  { notifySuccess, notifyError } from '../../utils/toastHelpers';

const formValidation = {
  username: {
    required: 'Username is required',
    minLength: { value: 3, message: 'Username must be at least 3 characters' }
  },
  password: {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' }
  },
  role: { required: 'Role is required' }
};

const LoginForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {['username', 'password', 'role'].map((field, index) => (
        <div className="space-y-2" key={index}>
          <label className="block text-sm font-medium text-gray-700">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          {field === 'password' ? (
            <div className="relative">
              <input
                {...register(field, formValidation[field])}
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                placeholder={`Enter your ${field}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          ) : field === 'role' ? (
            <select
              {...register(field, formValidation[field])}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="pastor">Pastor</option>
              <option value="member">Member</option>
            </select>
          ) : (
            <input
              {...register(field, formValidation[field])}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
              placeholder={`Enter your ${field}`}
            />
          )}
          {errors[field] && (
            <p className="text-red-500 text-sm mt-1">{errors[field].message}</p>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm text-gray-700">
          <input {...register('remember_me')} type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2" />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer
          ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </div>
        ) : 'Sign In'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
          Register here
        </Link>
      </p>
    </form>
  );
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const popup = localStorage.getItem('registerToken');
    if (popup) {
      notifySuccess("You've registered!", { position: 'top-right', autoClose: 3000 });
      localStorage.removeItem('registerToken');
    }
  }, []);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const payload = {
        username: data.username,
        password: data.password,
        role: data.role,
      };

      const response = await api.post('/auth/login', payload, {
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      });

      if (!response.data.access_token) throw new Error('No access token received');

      const { access_token, role } = response.data;
      const storage = data.remember_me ? localStorage : sessionStorage;

      storage.setItem('accessToken', access_token);
      storage.setItem('role', role);
      storage.setItem('username', data.username);

      login(access_token, role, data.username);
      localStorage.setItem('loginToken', 'Welcome');
      navigate('/profile');

    } catch (error) {
      const message = error.response?.data?.detail ||
        (error.response?.status === 401 && "Invalid username or password") ||
        (error.message === 'No access token received' && "Invalid response from server") ||
        (error.message === 'Network Error' && "Cannot connect to server. Please check your connection.") ||
        "Something went wrong";

      notifyError(message, { style: { background: "#000", color: "#fff" } });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundImage src={bgImage} className="fixed inset-0 w-full h-full" fallbackColor="#222" style={{ opacity: 0.3, objectFit: 'cover' }} />
      <div className="relative z-20 w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg rounded-lg pr-16 pl-16 p-8 m-2">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>
        <LoginForm onSubmit={handleLogin} loading={loading} />
      </div>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-slate-800 text-white px-6 py-4 rounded-xl shadow-lg"
        bodyClassName="text-sm font-medium"
      /> */}
    </div>
  );
};

export default Login;