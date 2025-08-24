import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import api from '../pages/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', preacher: '', description: '', date: '' });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/event');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.preacher || !form.description || !form.date) {
      alert('Please fill all fields');
      return;
    }

    try {
      setCreating(true);
      if (editingId) {
        // Update existing event
        const response = await api.patch(`/event/${editingId}`, form);
        setEvents(events.map(evt => (evt.id === editingId ? response.data : evt)));
        setEditingId(null);
      } else {
        // Create new event
        const response = await api.post('/event', form);
        setEvents([response.data, ...events]);
      }

      setForm({ name: '', preacher: '', description: '', date: '' });
    } catch (error) {
      console.error('Failed to submit event', error);
      alert('Failed to submit event');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (event) => {
    setForm({ name: event.name, preacher: event.preacher, description: event.description, date: event.date });
    setEditingId(event.id);
  };

  const cancelEdit = () => {
    setForm({ name: '', preacher: '', description: '', date: '' });
    setEditingId(null);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/event/${id}`);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Failed to delete event', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto pt-18">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Manage Events
      </motion.h1>

      {/* Create/Update Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-blue-700">
          {editingId ? 'Update Event' : 'Create New Event'}
        </h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Event name"
          className="w-full font-bold text-gray-700 border border-gray-200 shadow-md p-4 rounded-xl hover:shadow-lg transition cursor-pointer outline-0"
        />
        <input
          name="preacher"
          value={form.preacher}
          onChange={handleChange}
          placeholder="Preacher"
          className="w-full font-bold text-gray-700 border border-gray-200 shadow-md p-4 rounded-xl hover:shadow-lg transition cursor-pointer outline-0"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full font-bold text-gray-700 border border-gray-200 shadow-md p-4 rounded-xl hover:shadow-lg transition cursor-pointer outline-0"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full font-bold text-gray-700 border border-gray-200 shadow-md p-4 rounded-xl hover:shadow-lg transition cursor-pointer outline-0"
        />
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white shadow-md font-bold px-4 py-2 rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 cursor-pointer"
            disabled={creating}
          >
            {creating ? 'Saving...' : editingId ? 'Update Event' : 'Create Event'}
          </button>
          {editingId && (
            <button
              type="button"
              className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </motion.form>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : events.length === 0 ? (
        <motion.div
          className="text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No events available.
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <h2 className="text-lg font-bold text-blue-600 mb-1">{event.name}</h2>
              <h2 className="text-sm font-bold text-blue-400 mb-1">{event.preacher}</h2>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="text-sm text-gray-500">Date: {event.date}</div>

              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => handleEdit(event)}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                  onClick={() => deleteEvent(event.id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
