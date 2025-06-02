import React, { useState } from 'react';
import api from '../pages/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { toast } from 'react-hot-toast';
import SermonList from '../components/SermonList';
import useSermonManager from '../hooks/useSermonManager';
import { Dialog, Transition } from '@headlessui/react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const SermonManager = () => {
  const {
    tab,
    setTab,
    sermons,
    setSermons,
    events,
    setEvents,
    search,
    setSearch,
    loading,
    error,
    activeList
  } = useSermonManager();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    preacher: '',
    description: '',
    video_url: '',
    date: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form validation rules
  const validationRules = {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    preacher: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    video_url: {
      required: (tab) => tab === 'sermons',
      pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
    },
    date: {
      required: true
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && typeof rules.required === 'function' && !rules.required(tab)) {
      return '';
    }

    if (rules.required && !value) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be a valid YouTube URL`;
    }

    return '';
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) errors[key] = error;
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = tab === 'sermons' ? '/sermon' : '/event';
      const data = tab === 'sermons' 
        ? { 
            title: form.title, 
            preacher: form.preacher, 
            description: form.description, 
            video_url: form.video_url, 
            date: form.date 
          }
        : { 
            name: form.title, 
            preacher: form.preacher, 
            description: form.description, 
            date: form.date 
          };

      if (editingId) {
        const response = await api.patch(`${endpoint}/${editingId}`, data);
        if (tab === 'sermons') {
          setSermons(sermons.map(s => (s.id === editingId ? response.data : s)));
        } else {
          setEvents(events.map(e => (e.id === editingId ? response.data : e)));
        }
        toast.success(`${tab === 'sermons' ? 'Sermon' : 'Event'} updated successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      } else {
        const response = await api.post(endpoint, data);
        if (tab === 'sermons') {
          setSermons([response.data, ...sermons]);
        } else {
          setEvents([response.data, ...events]);
        }
        toast.success(`${tab === 'sermons' ? 'Sermon' : 'Event'} created successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
      
      setForm({
        title: '',
        preacher: '',
        description: '',
        video_url: '',
        date: ''
      });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to submit', error);
      toast.error(`Failed to save ${tab === 'sermons' ? 'sermon' : 'event'}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: tab === 'sermons' ? item.title : item.name,
      preacher: item.preacher,
      description: item.description,
      video_url: item.video_url || '',
      date: item.date
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    console.log('=== HANDLE DELETE DEBUG ===');
    console.log('handleDelete called with ID:', id);
    console.log('ID type:', typeof id);
    console.log('===========================');

    try {
      const endpoint = tab === 'sermons' ? '/sermon' : '/event';
      console.log('Deleting from endpoint:', `${endpoint}/${id}`); // Add for debugging
      
      const response = await api.delete(`${endpoint}/${id}`);
      console.log('Delete response:', response); // Add for debugging
      
      if (tab === 'sermons') {
      // Filter using flexible ID matching
        setSermons(sermons.filter(s => {
          const sId = s.id || s._id || s.ID || s.uuid;
          return sId != id; // Use != instead of !== to handle string/number differences
        }));
      } else {
        setEvents(events.filter(e => {
          const eId = e.id || e._id || e.ID || e.uuid;
          return eId != id;
        }));
      }
      
      toast.success(`${tab === 'sermons' ? 'Sermon' : 'Event'} deleted successfully`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Failed to delete:', error);
      console.error('Error details:', error.response?.data); // Add for debugging
      
      toast.error(`Failed to delete ${tab === 'sermons' ? 'sermon' : 'event'}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };
  
  // Also verify that openDeleteModal is setting the itemToDelete correctly:
  const openDeleteModal = (item) => {
    console.log('=== DETAILED DEBUG DELETE MODAL ===');
    console.log('Full item received:', item);
    console.log('Item type:', typeof item);
    console.log('Item keys:', item ? Object.keys(item) : 'item is null/undefined');
    console.log('Item stringified:', JSON.stringify(item, null, 2));

    console.log('item.id:', item?.id);
    console.log('item._id:', item?._id);
    console.log('item.ID:', item?.ID);
    console.log('item.uuid:', item?.uuid);
    console.log('===================================');
  
    if (!item) {
      console.error('No item passed to openDeleteModal');
      toast.error('Error: No item selected for deletion');
      return;
    }

    const itemId = item.id || item._id || item.ID || item.uuid;
  
    if (!itemId) {
      console.error('Item has no recognizable ID field:', item);
      console.error('Available fields:', Object.keys(item));
      toast.error('Error: Selected item has no ID field');
      return;
    }

    console.log('Found ID:', itemId);
    console.log('Opening delete modal for item:', item);

    const normalizedItem = {
      ...item,
      id: itemId // Ensure we always have an 'id' field
    };
    setItemToDelete(normalizedItem);
    setIsDeleteModalOpen(true);
  };

  const cancelEdit = () => {
    setForm({
      title: '',
      preacher: '',
      description: '',
      video_url: '',
      date: ''
    });
    setEditingId(null);
    setFormErrors({});
    setIsModalOpen(false);
  };

  const renderFormField = (name, label, type = 'text', placeholder = '') => {
    // Skip video_url field for events
    if (name === 'video_url' && tab === 'events') {
      return null;
    }

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full font-bold text-gray-700 border shadow-md p-4 rounded-xl hover:shadow-lg transition cursor-pointer outline-0 ${
            formErrors[name] ? 'border-red-500' : 'border-gray-200'
          }`}
        />
        {formErrors[name] && (
          <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <SermonList
        tab={tab}
        setTab={setTab}
        search={search}
        setSearch={setSearch}
        loading={loading}
        error={error}
        activeList={activeList}
        onEdit={handleEdit}
        onDelete={openDeleteModal}
        onCreate={() => setIsModalOpen(true)}
        showActions={true}
      />

      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto min-h-screen">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mt-35">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit' : 'Create'} {tab === 'sermons' ? 'Sermon' : 'Event'}
            </h2>
            <form onSubmit={handleSubmit}>
              {renderFormField('title', tab === 'sermons' ? 'Title' : 'Name')}
              {renderFormField('preacher', 'Preacher')}
              {renderFormField('description', 'Description', 'textarea')}
              {renderFormField('video_url', 'Video URL', 'text', 'https://youtube.com/...')}
              {renderFormField('date', 'Date', 'date')}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Transition.Root show={isDeleteModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
          }}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <TrashIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete {tab === 'sermons' ? "Sermon" : "Event"}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={async () => {
                        console.log('=== DELETE BUTTON CLICKED ===');
                        console.log('itemToDelete:', itemToDelete);
                        console.log('itemToDelete type:', typeof itemToDelete);
                        console.log('itemToDelete.id:', itemToDelete?.id);
                        console.log('===============================');

                        if (itemToDelete?.id) {
                          console.log('Deleting item with ID:', itemToDelete.id); // Add for debugging
                          try {
                            await handleDelete(itemToDelete.id);
                          } catch (error) {
                            console.error('Delete failed:', error);
                            toast.error('Failed to delete item');
                          }
                        } else {
                          console.log('No item to delete:', itemToDelete); // Add for debugging
                          console.log(error)
                          toast.error('No item selected for deletion');
                          setIsDeleteModalOpen(false);
                        }
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setItemToDelete(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default SermonManager;