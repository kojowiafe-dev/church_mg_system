import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaPhone, FaChurch } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

const Profile = () => {
  const { auth } = useAuth();
  const { username, email, phone, role, church } = auth;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    church: '',
  });

  // Handle welcome toast
  useEffect(() => {
    const showWelcomeToast = () => {
      const popup = localStorage.getItem('loginToken');
      if (popup && username) {
        toast.success(`Welcome ${username}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          toastClassName: "bg-slate-800 text-white px-6 py-4 rounded-xl shadow-lg",
          bodyClassName: "text-sm font-medium"
        });
        localStorage.removeItem('loginToken');
      }
    };

    // Small delay to ensure auth context is loaded
    const timer = setTimeout(showWelcomeToast, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // Handle form data updates
  useEffect(() => {
    if (username || email || phone || church) {
      setFormData({
        username: username || '',
        email: email || '',
        phone: phone || '',
        church: church || '',
      });
    }
  }, [username, email, phone, church]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call update profile API here
    console.log('Updated data:', formData);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto mt-18 p-6 bg-white shadow-xl rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        <FaUserCircle className="text-gray-700" size={48} />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{username}</h2>
          <p className="text-gray-500 capitalize">{role}</p>
        </div>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <FaEnvelope />
            <span>{email || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaPhone />
            <span>{phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaChurch />
            <span>{church || 'Not assigned'}</span>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="cursor-pointer mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-500 text-md font-bold">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full shadow-lg border-1 border-gray-300 px-5 py-4 rounded-2xl focus:outline-2 outline-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-md font-bold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full shadow-lg border-1 border-gray-300 px-5 py-4 rounded-2xl focus:outline-2 outline-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-md font-bold">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full shadow-lg border-1 border-gray-300 px-5 py-4 rounded-2xl focus:outline-2 outline-gray-700 "
            />
          </div>
          <div>
            <label className="block text-md text-gray-500 font-bold">Church</label>
            <input
              type="text"
              name="church"
              value={formData.church}
              onChange={handleChange}
              className="w-full shadow-lg border-1 border-gray-300 px-5 py-4 rounded-2xl focus:outline-2 outline-gray-700 "
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-3 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-3 cursor-pointer bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
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

export default Profile