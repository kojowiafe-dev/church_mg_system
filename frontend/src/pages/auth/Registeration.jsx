// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import { useForm } from 'react-hook-form';
// import api from '../api';
// import bgImage from '../../assets/elianna-gill-DppEkXKjahk-unsplash.jpg';
// import 'react-toastify/dist/ReactToastify.css';
// import BackgroundImage from '../../components/BackgroundImage';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// const AdminRegister = () => {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();
//   const { register, handleSubmit, watch, formState: { errors } } = useForm();
//   const password = watch('password');

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       await api.post('/admin/register', {
//         username: data.username,
//         email: data.email,
//         password: data.password,
//         phone: data.phone,
//         house_address: data.house_address
//       });

//       toast.success("Registration successful! Please check your email to verify your account.", {
//         style: { background: "#000", color: "#fff" }
//       });

//       navigate('/login', {
//         state: { showRegisterSuccess: true, replace: true }
//       });

//     } catch (error) {
//       const errorMessage = error.response?.data?.detail || "Registration failed";
//       toast.error(errorMessage, {
//         style: { background: "#000", color: "#fff" }
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       {/* Background Image */}
//       <BackgroundImage 
//           src={bgImage}
//           className="absolute inset-0"
//           fallbackColor="#222"
//           style={{ opacity: 0.5 }}
//       />
//       <div className="absolute inset-0 bg-black opacity-40" />
//       {/* <div 
//         className="absolute inset-0 bg-cover bg-center" 
//         style={{ 
//           backgroundImage: `url(${bgImage})`, 
//           opacity: 0.5, 
//           zIndex: 10 
//         }}
//       />
//       <div className="absolute inset-0 bg-black opacity-40" /> */}

//       {/* Registration Form */}
//       <div
//         className="relative z-20 w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8"
//       >
//         <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h2>
        
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Username</label>
//               <input
//                 {...register('username', { 
//                   required: 'Username is required',
//                   minLength: {
//                     value: 3,
//                     message: 'Username must be at least 3 characters'
//                   },
//                   pattern: {
//                     value: /^[a-zA-Z0-9_]+$/,
//                     message: 'Username can only contain letters, numbers, and underscores'
//                   }
//                 })}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your username"
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 {...register('email', { 
//                   required: 'Email is required',
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: 'Invalid email address'
//                   }
//                 })}
//                 type="email"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your email"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="relative">
//                 <input
//                   {...register('password', { 
//                     required: 'Password is required',
//                     minLength: {
//                       value: 8,
//                       message: 'Password must be at least 8 characters'
//                     },
//                     pattern: {
//                       value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//                       message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
//                     }
//                   })}
//                   type={showPassword ? "text" : "password"}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? <FaEye /> : <FaEyeSlash/>}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//               <div className="relative">
//                 <input
//                   {...register('confirmPassword', { 
//                     required: 'Please confirm your password',
//                     validate: value => value === password || 'Passwords do not match'
//                   })}
//                   type={showConfirmPassword ? "text" : "password"}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showConfirmPassword ? <FaEye/> : <FaEyeSlash />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">Phone</label>
//               <input
//                 {...register('phone', { 
//                   required: 'Phone number is required',
//                   pattern: {
//                     value: /^[0-9]{10}$/,
//                     message: 'Please enter a valid 10-digit phone number'
//                   }
//                 })}
//                 type="tel"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your phone number"
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//               )}
//             </div>

//             <div className="space-y-2 md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">House Address</label>
//               <input
//                 {...register('house_address', { 
//                   required: 'House address is required',
//                   minLength: {
//                     value: 5,
//                     message: 'Address must be at least 5 characters'
//                   }
//                 })}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your house address"
//               />
//               {errors.house_address && (
//                 <p className="text-red-500 text-sm mt-1">{errors.house_address.message}</p>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer
//               ${loading 
//                 ? 'bg-blue-400 cursor-not-allowed' 
//                 : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
//               }`}
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Creating Account...
//               </div>
//             ) : 'Create Account'}
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
//               Sign in here
//             </Link>
//           </p>
//         </form>
//       </div>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         theme="dark"
//         toastClassName="bg-slate-800 text-white px-6 py-4 rounded-xl shadow-lg"
//         bodyClassName="text-sm font-medium"
//       />
//     </div>
//   );
// };

// export default AdminRegister;