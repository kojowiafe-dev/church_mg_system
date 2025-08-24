import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaEnvelope, FaPhone, FaChurch, FaHome } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import WindowResize from '../../layouts/WindowResize';
import api from '../api';

const Profile = () => {
  const windowSize = WindowResize();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    house_address: '',
    profile_image: ''
  });
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile(res.data);
        setFormData({
          username: res.data.username || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          house_address: res.data.house_address || '',
          profile_image: res.data.profile_image || ''
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Handle welcome toast
  useEffect(() => {
    const showWelcomeToast = () => {
      const popup = localStorage.getItem('loginToken');
      if (popup && profile?.username) {
        toast.success(`Welcome ${profile.username}!`, {
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
  }, [profile?.username]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.id) {
      toast.error('User ID not found!');
      return;
    }
    try {
      const res = await api.put(`/users/${profile.id}`, formData);
      setProfile(res.data);
      setFormData({
        username: res.data.username || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        house_address: res.data.house_address || '',
        profile_image: res.data.profile_image || ''
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile!');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-18 p-6 bg-white shadow-xl rounded-xl">
      <div className="flex items-center gap-4 mb-6">
        {profile?.profile_image ? (
          <img
            src={profile.profile_image}
            alt="Profile"
            className="rounded-full object-cover"
            style={{ width: windowSize.width < 800 ? 48 : 96, height: windowSize.width < 800 ? 48 : 96 }}
          />
        ) : (
          <FaUserCircle className="text-gray-700" size={windowSize.width < 800 ? '24' : '48'} />
        )}
        <div>
          <h2 className="sm:text-2xl text-sm font-semibold text-gray-800">{profile?.username}</h2>
          <p className="text-gray-500 capitalize">{profile?.role}</p>
        </div>
      </div>

      {!isEditing ? (
        <div className="sm:space-y-4 space-y-2 text-sm">
          <div className="flex items-center gap-3 text-gray-700">
            <FaEnvelope />
            <span>{profile?.email || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaPhone />
            <span>{profile?.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaHome />
            <span>{profile?.house_address || 'Not provided'}</span>
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
            <label className="block text-md text-gray-500 font-bold">House Address</label>
            <input
              type="text"
              name="house_address"
              value={formData.house_address}
              onChange={handleChange}
              className="w-full shadow-lg border-1 border-gray-300 px-5 py-4 rounded-2xl focus:outline-2 outline-gray-700 "
            />
          </div>
          <div>
            <label className="block text-gray-500 text-md font-bold">Profile Image URL</label>
            <input
              type="text"
              name="profile_image"
              value={formData.profile_image}
              onChange={handleChange}
              className="w-full shadow-lg border-1 border-gray-300 px-5 py-4 rounded-2xl focus:outline-2 outline-gray-700"
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