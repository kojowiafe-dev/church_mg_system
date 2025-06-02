import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import api from '../../pages/api';

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    occupation: '',
    baptism_date: '',
    membership_date: '',
    emergency_contact: '',
    emergency_contact_phone: '',
    notes: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      fetchMember();
    }
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/members/${id}`);
      const member = response.data;
      setFormData({
        ...member,
        date_of_birth: member.date_of_birth || '',
        baptism_date: member.baptism_date || '',
        membership_date: member.membership_date || '',
      });
    } catch (error) {
      console.error(error);
      // You might want to add a toast notification here
      navigate('/members');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.marital_status) newErrors.marital_status = 'Marital status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString().split('T')[0] : null,
        baptism_date: formData.baptism_date ? new Date(formData.baptism_date).toISOString().split('T')[0] : null,
        membership_date: formData.membership_date ? new Date(formData.membership_date).toISOString().split('T')[0] : null,
      };

      if (isEditMode) {
        await api.put(`/members/${id}`, formattedData);
      } else {
        await api.post('/members', formattedData);
      }
      navigate('/members');
    } catch (error) {
      console.error(error);
      // You might want to add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 pt-18">
      <div className="max-w-3xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-poppins font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {isEditMode ? 'Edit Member' : 'Add New Member'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`block w-full p-4 rounded-md shadow-sm sm:text-sm ${
                        errors.first_name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.first_name && (
                      <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={`block w-full p-4 rounded-md shadow-sm sm:text-sm ${
                        errors.last_name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.last_name && (
                      <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="date_of_birth"
                      id="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={(e) => handleDateChange('date_of_birth', e.target.value)}
                      className={`block w-full p-4 cursor-pointer rounded-md shadow-sm sm:text-sm ${
                        errors.date_of_birth
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.date_of_birth && (
                      <p className="mt-2 text-sm text-red-600">{errors.date_of_birth}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <div className="mt-1">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`block w-full p-4 cursor-pointer rounded-md shadow-sm sm:text-sm ${
                        errors.gender
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
                    Marital Status
                  </label>
                  <div className="mt-1">
                    <select
                      id="marital_status"
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleChange}
                      className={`block w-full p-4 cursor-pointer rounded-md shadow-sm sm:text-sm ${
                        errors.marital_status
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    >
                      <option value="">Select marital status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                    {errors.marital_status && (
                      <p className="mt-2 text-sm text-red-600">{errors.marital_status}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                    Occupation
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="occupation"
                      id="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>


                <div>
                  <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
                    Emergency Contact Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="emergency_contact"
                      id="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      className="block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>


                <div>
                  <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700">
                    Emergency Contact Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="emergency_contact_phone"
                      id="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleChange}
                      className="block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>


                <div>
                  <label htmlFor="baptism_date" className="block text-sm font-medium text-gray-700">
                    Baptism Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="baptism_date"
                      id="baptism_date"
                      value={formData.baptism_date}
                      onChange={(e) => handleDateChange('baptism_date', e.target.value)}
                      className="block w-full p-4 cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="membership_date" className="block text-sm font-medium text-gray-700">
                    Membership Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="membership_date"
                      id="membership_date"
                      value={formData.membership_date}
                      onChange={(e) => handleDateChange('membership_date', e.target.value)}
                      className="block w-full p-4 cursor-pointer rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>


                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      className="block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end gap-x-3">
              <button
                type="button"
                onClick={() => navigate('/members')}
                className="rounded-md cursor-pointer bg-white py-2 px-3 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex cursor-pointer justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm; 