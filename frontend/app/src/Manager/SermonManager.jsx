// import React, { useState } from 'react';
// import api from '../pages/api';
// import { toast } from 'react-hot-toast';
// import SermonList from '../components/SermonList';
// import useSermonManager from '../hooks/useSermonManager';

// const SermonManager = () => {
//   const {
//     tab,
//     setTab,
//     sermons,
//     setSermons,
//     events,
//     setEvents,
//     search,
//     setSearch,
//     loading,
//     error,
//     activeList
//   } = useSermonManager();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [form, setForm] = useState({
//     title: '',
//     preacher: '',
//     description: '',
//     video_url: '',
//     date: ''
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [editingId, setEditingId] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Form validation rules
//   const validationRules = {
//     title: {
//       required: true,
//       minLength: 3,
//       maxLength: 100
//     },
//     preacher: {
//       required: true,
//       minLength: 2,
//       maxLength: 100
//     },
//     description: {
//       required: true,
//       minLength: 10,
//       maxLength: 500
//     },
//     video_url: {
//       required: (tab) => tab === 'sermons',
//       pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
//     },
//     date: {
//       required: true
//     }
//   };

//   const validateField = (name, value) => {
//     const rules = validationRules[name];
//     if (!rules) return '';

//     if (rules.required && typeof rules.required === 'function' && !rules.required(tab)) {
//       return '';
//     }

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
//       return `${name.charAt(0).toUpperCase() + name.slice(1)} must be a valid YouTube URL`;
//     }

//     return '';
//   };

//   const validateForm = () => {
//     const errors = {};
//     Object.keys(form).forEach(key => {
//       const error = validateField(key, form[key]);
//       if (error) errors[key] = error;
//     });
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
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

//     setSubmitting(true);
//     try {
//       const endpoint = tab === 'sermons' ? '/sermon' : '/event';
//       const data = tab === 'sermons' 
//         ? { 
//             title: form.title, 
//             preacher: form.preacher, 
//             description: form.description, 
//             video_url: form.video_url, 
//             date: form.date 
//           }
//         : { 
//             name: form.title, 
//             preacher: form.preacher, 
//             description: form.description, 
//             date: form.date 
//           };

//       if (editingId) {
//         const response = await api.patch(`${endpoint}/${editingId}`, data);
//         if (tab === 'sermons') {
//           setSermons(sermons.map(s => (s.id === editingId ? response.data : s)));
//         } else {
//           setEvents(events.map(e => (e.id === editingId ? response.data : e)));
//         }
//         toast.success(`${tab === 'sermons' ? 'Sermon' : 'Event'} updated successfully`);
//       } else {
//         const response = await api.post(endpoint, data);
//         if (tab === 'sermons') {
//           setSermons([response.data, ...sermons]);
//         } else {
//           setEvents([response.data, ...events]);
//         }
//         toast.success(`${tab === 'sermons' ? 'Sermon' : 'Event'} created successfully`);
//       }
      
//       setForm({
//         title: '',
//         preacher: '',
//         description: '',
//         video_url: '',
//         date: ''
//       });
//       setEditingId(null);
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error('Failed to submit', error);
//       toast.error(`Failed to save ${tab === 'sermons' ? 'sermon' : 'event'}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setForm({
//       title: tab === 'sermons' ? item.title : item.name,
//       preacher: item.preacher,
//       description: item.description,
//       video_url: item.video_url || '',
//       date: item.date
//     });
//     setEditingId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm(`Are you sure you want to delete this ${tab.slice(0, -1)}?`)) return;

//     try {
//       const endpoint = tab === 'sermons' ? '/sermon' : '/event';
//       await api.delete(`${endpoint}/${id}`);
//       if (tab === 'sermons') {
//         setSermons(sermons.filter(s => s.id !== id));
//       } else {
//         setEvents(events.filter(e => e.id !== id));
//       }
//       toast.success(`${tab === 'sermons' ? 'Sermon' : 'Event'} deleted successfully`);
//     } catch (error) {
//       console.error('Failed to delete', error);
//       toast.error(`Failed to delete ${tab === 'sermons' ? 'sermon' : 'event'}`);
//     }
//   };

//   const cancelEdit = () => {
//     setForm({
//       title: '',
//       preacher: '',
//       description: '',
//       video_url: '',
//       date: ''
//     });
//     setEditingId(null);
//     setFormErrors({});
//     setIsModalOpen(false);
//   };

//   const renderFormField = (name, label, type = 'text', placeholder = '') => {
//     // Skip video_url field for events
//     if (name === 'video_url' && tab === 'events') {
//       return null;
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
//           value={form[name]}
//           onChange={handleChange}
//           placeholder={placeholder}
//           className={`w-full font-bold text-gray-700 border shadow-md p-4 rounded-xl hover:shadow-lg transition cursor-pointer outline-0 ${
//             formErrors[name] ? 'border-red-500' : 'border-gray-200'
//           }`}
//         />
//         {formErrors[name] && (
//           <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <SermonList
//         tab={tab}
//         setTab={setTab}
//         search={search}
//         setSearch={setSearch}
//         loading={loading}
//         error={error}
//         activeList={activeList}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onCreate={() => setIsModalOpen(true)}
//         showActions={true}
//       />

//       {isModalOpen && (
//         <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto min-h-screen">
//           <div className="bg-white rounded-xl p-6 max-w-lg w-full mt-35">
//             <h2 className="text-2xl font-bold mb-4">
//               {editingId ? 'Edit' : 'Create'} {tab === 'sermons' ? 'Sermon' : 'Event'}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               {renderFormField('title', tab === 'sermons' ? 'Title' : 'Name')}
//               {renderFormField('preacher', 'Preacher')}
//               {renderFormField('description', 'Description', 'textarea')}
//               {renderFormField('video_url', 'Video URL', 'text', 'https://youtube.com/...')}
//               {renderFormField('date', 'Date', 'date')}
//               <div className="flex justify-end space-x-2 mt-4">
//                 <button
//                   type="button"
//                   onClick={cancelEdit}
//                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   {submitting ? 'Saving...' : 'Save'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SermonManager;