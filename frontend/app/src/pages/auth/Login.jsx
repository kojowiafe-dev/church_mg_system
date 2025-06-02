import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import api from '../api';
import bgImage from '../../assets/elianna-gill-DppEkXKjahk-unsplash.jpg';
import BackgroundImage from '../../components/BackgroundImage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();


  useEffect(() => {
    const showRegisterToast = () => {
      const popup = localStorage.getItem('registerToken');
      if (popup) {
        toast.success(`You've registered!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.removeItem('registerToken');
      }
    };

    // Small delay to ensure auth context is loaded
    const timer = setTimeout(showRegisterToast, 500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    setLoading(true);
    try {
      // Create URLSearchParams for OAuth2 compatibility
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);
      formData.append('role', data.role);

      console.log('Sending login request with data:', Object.fromEntries(formData));
      
      const response = await api.post('/auth/login', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      });

      console.log('Login response:', response.data);

      if (!response.data.access_token) {
        throw new Error('No access token received');
      }

      const { access_token, role } = response.data;
      
      // Store token with expiration if remember_me is checked
      if (data.remember_me) {
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", data.username);
      } else {
        sessionStorage.setItem("accessToken", access_token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("username", data.username);
      }

      console.log('Calling login function from context...');
      login(access_token, role, data.username);

      // Set welcome token before navigation
      localStorage.setItem('loginToken', 'Welcome');
      
      // Navigate based on role
      // const roleRoutes = {
      //   admin: '/admin/profile',
      //   pastor: '/pastor/profile',
      //   member: '/member/profile'
      // };
      // const targetRoute = roleRoutes[role] || '/';
      console.log('Navigating to:', '/profile');
      navigate('/profile');

    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      let errorMessage = "Something went wrong";
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = error.response.data.detail || "You are not authorized to access this role";
        } else if (error.response.status === 401) {
          errorMessage = "Invalid username or password";
        } else {
          errorMessage = error.response.data.detail || "Login failed";
        }
      } else if (error.message === 'No access token received') {
        errorMessage = "Invalid response from server";
      } else if (error.message === 'Network Error') {
        errorMessage = "Cannot connect to server. Please check your connection.";
      }
      
      toast.error(errorMessage, {
        style: { background: "#000", color: "#fff" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <BackgroundImage 
          src={bgImage}
          className="absolute inset-0"
          fallbackColor="#222"
          style={{ opacity: 0.5 }}
      />
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Login Form */}
      <div
        className="relative z-20 w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg rounded-lg pr-16 pl-16 p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              {...register('username', { 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash/> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="pastor">Pastor</option>
              <option value="member">Member</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register('remember_me')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-slate-800 text-white px-6 py-4 rounded-xl shadow-lg"
        bodyClassName="text-sm font-medium"
      />
    </div>
  );
};

export default Login;
