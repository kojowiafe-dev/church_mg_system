// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';
// import { CalendarIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
// import { toast } from 'react-hot-toast';
// import api from '../pages/api';

// const EventManager = () => {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     date: '',
//     preacher: '',
//     time: '',
//     location: '',
//     category: '',
//     attendees: '',
//   });
//   const [formErrors, setFormErrors] = useState({});

//   // Form validation rules
//   const validationRules = {
//     name: {
//       required: true,
//       minLength: 3,
//       maxLength: 100,
//     },
//     description: {
//       required: true,
//       minLength: 10,
//       maxLength: 500,
//     },
//     date: {
//       required: true,
//     },
//     preacher: {
//       required: true,
//     },
//     time: {
//       required: true,
//     },
//     location: {
//       required: true,
//       minLength: 3,
//       maxLength: 200,
//     },
//     category: {
//       required: true,
//     },
//     attendees: {
//       required: true,
//       pattern: /^\d+$/,
//     },
//   };

//   // Validate form field
//   const validateField = (name, value) => {
//     const rules = validationRules[name];
//     if (!rules) return '';

//     if (rules.required && !value) {
//       return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
//     }

//     if (rules.minLength && value.length < rules.minLength) {
//       return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
//     }

//     if (rules.maxLength && value.length > rules.maxLength) {
//       return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${rules.maxLength} characters`;
//     }

//     if (rules.pattern && !rules.pattern.test(value)) {
//       return `${name.charAt(0).toUpperCase() + name.slice(1)} must be a valid number`;
//     }

//     return '';
//   };

//   // Validate entire form
//   const validateForm = () => {
//     const errors = {};
//     Object.keys(formData).forEach(key => {
//       const error = validateField(key, formData[key]);
//       if (error) errors[key] = error;
//     });
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/event');
//       if (!response.ok) {
//         throw new Error('Failed to fetch events');
//       }
//       const data = await response.json();
//       setEvents(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       toast.error('Failed to load events');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error('Please fix the form errors');
//       return;
//     }

//     try {
//       const response = await api.post('/event', formData);

//       if (!response.ok) {
//         throw new Error('Failed to create event');
//       }

//       toast.success('Event created successfully');
//       setIsModalOpen(false);
//       setFormData({
//         name: '',
//         description: '',
//         date: '',
//         preacher: '',
//       });
//       fetchEvents();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this event?')) {
//       return;
//     }

//     try {
//       const response = await api.delete(`/event/${id}`);

//       if (!response.ok) {
//         throw new Error('Failed to delete event');
//       }

//       toast.success('Event deleted successfully');
//       fetchEvents();
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   const handleEdit = (event) => {
//     navigate(`/events/edit/${event.id}`);
//   };

//   const renderEventCard = (event) => (
//     <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
//       <div className="flex justify-between items-start mb-4">
//         <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => handleEdit(event)}
//             className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => handleDelete(event.id)}
//             className="text-red-600 hover:text-red-800 transition-colors duration-200"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
      
//       <div className="space-y-3">
//         <div className="flex items-center text-gray-600">
//           <CalendarIcon className="h-5 w-5 mr-2" />
//           <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
//         </div>
//         <div className="flex items-center text-gray-600">
//           <UserIcon className="h-5 w-5 mr-2" />
//           <span>{event.preacher}</span>
//         </div>
//         <div className="flex items-start text-gray-600">
//           <DocumentTextIcon className="h-5 w-5 mr-2 mt-1" />
//           <p className="text-sm">{event.description}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderFormField = (name, label, type = 'text', placeholder = '') => {
//     if (type === 'textarea') {
//       return (
//         <div className="mb-4">
//           <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//             {label}
//           </label>
//           <textarea
//             id={name}
//             name={name}
//             value={formData[name]}
//             onChange={handleInputChange}
//             placeholder={placeholder}
//             rows="4"
//             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
//               formErrors[name] ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {formErrors[name] && (
//             <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
//           )}
//         </div>
//       );
//     }

//     return (
//       <div className="mb-4">
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//         <input
//           type={type}
//           id={name}
//           name={name}
//           value={formData[name]}
//           onChange={handleInputChange}
//           placeholder={placeholder}
//           className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//             formErrors[name] ? 'border-red-500' : 'border-gray-300'
//           }`}
//         />
//         {formErrors[name] && (
//           <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
//         )}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-red-600 text-center">
//           <p className="text-xl font-semibold mb-2">Error Loading Events</p>
//           <p>{error}</p>
//           <button
//             onClick={fetchEvents}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//         >
//           Add New Event
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map(renderEventCard)}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-900">Add New Event</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
//               >
//                 ✕
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {renderFormField('name', 'Event Name', 'text', 'Enter event name')}
//               {renderFormField('description', 'Description', 'textarea', 'Enter event description')}
//               {renderFormField('date', 'Date', 'date')}
//               {renderFormField('preacher', 'Preacher', 'text', 'Enter preacher name')}
//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
//                 >
//                   Create Event
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventManager;