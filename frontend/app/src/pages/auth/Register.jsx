import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';
import api from '../api';
import bgImage from '../../assets/elianna-gill-DppEkXKjahk-unsplash.jpg';
import BackgroundImage from '../../components/BackgroundImage';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Format dates properly
      const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      // Create user and member profile in a single request
      const registrationData = {
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
          phone: data.phone,
          house_address: data.house_address,
          role: data.role
        },
        member: {
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: formatDate(data.date_of_birth),
          gender: data.gender,
          marital_status: data.marital_status,
          occupation: data.occupation || null,
          emergency_contact: data.emergency_contact || null,
          emergency_contact_phone: data.emergency_contact_phone || null,
          baptism_date: formatDate(data.baptism_date),
          membership_date: new Date().toISOString().split("T")[0],
          notes: data.notes || null
        }
      };

      console.log('Registration data:', registrationData); // Debug log

      const response = await api.post('/auth/register', registrationData);
      
      if (response.status === 200) {
        localStorage.setItem('registerToken', 'Welcome')
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.detail || "Registration failed";
      toast.error(errorMessage, {
        style: { background: "#000", color: "#fff" }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      {/* Background Image */}
      <BackgroundImage 
        src={bgImage}
        className="fixed inset-0 w-full h-full"
        fallbackColor="#222"
        style={{ opacity: 0.5, objectFit: 'cover' }}
      />
      <div className="fixed inset-0 bg-black opacity-40" />

      {/* Registration Form */}
      <div className="relative z-20 w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome To KGCCI</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 text-center pb-4">Personal Information</h3>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-4'>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    {...register('role', { required: 'Role is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-0"
                  >
                    <option value="">Select Role</option>
                    <option value="member">Member</option>
                    <option value="pastor">Pastor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    {...register('first_name', { required: 'First name is required' })}
                    type="text"
                    className="w-full outline-0 px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    {...register('last_name', { required: 'Last name is required' })}
                    type="text"
                    className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    {...register('date_of_birth', { required: 'Date of birth is required' })}
                    type="date"
                    className="w-full outline-0 px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="w-full outline-0 px-4 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <select
                    {...register('marital_status', { required: 'Marital status is required' })}
                    className="w-full px-4 outline-0 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.marital_status && (
                    <p className="text-red-500 text-sm mt-1">{errors.marital_status.message}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Contact Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 text-center pb-4">Contact Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-4'>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    {...register('username', { required: 'Username is required' })}
                    type="text"
                    className="w-full px-4 outline-0 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-4 outline-0 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    type="tel"
                    className="w-full px-4 outline-0 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">House Address</label>
                  <input
                    {...register('house_address', { required: 'House address is required' })}
                    type="text"
                    className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.house_address && (
                    <p className="text-red-500 text-sm mt-1">{errors.house_address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Occupation</label>
                  <input
                    {...register('occupation')}
                    type="text"
                    className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 text-center pb-4">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                  <input
                    {...register('emergency_contact')}
                    type="text"
                    className="w-full px-4 outline-0 py-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                  <input
                    {...register('emergency_contact_phone')}
                    type="tel"
                    className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Baptism Date</label>
                  <input
                    {...register('baptism_date')}
                    type="date"
                    className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    {...register('notes')}
                    rows="3"
                    className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 text-center pb-4">Account Security</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className='relative'>
                    <input
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                        }
                      })}
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className='relative'>
                    <input
                      {...register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-3 outline-0 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaEyeSlash/> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 cursor-pointer rounded-lg text-white font-semibold transition-all duration-300
                ${loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </div>
              ) : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in here
          </Link>
        </p>
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

export default Register; 