import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { FiUser, FiBookOpen, FiSearch, FiTable } from 'react-icons/fi';
import { FaUsers, FaUser, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'

const Users = () => {
  const [tab, setTab] = useState('sermons');
  const [users, setUsers] = useState([]);
//   const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
        // e.preventDefault()
      const [usersRes] = await Promise.all([
        api.get('/users'),
        // api.get('/event'),
      ]);
      setUsers(usersRes.data.reverse());
    //   console.log(usersRes.data)

    //   setEvents(eventsRes.data.reverse());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(s => s.username.toLowerCase().includes(search.toLowerCase()));
//   const filteredEvents = events.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const activeList =  filteredUsers

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-18">
      <motion.h1
        className="text-4xl font-bold text-center mb-6 text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Member Dashboard
      </motion.h1>

      <div className="flex justify-center mb-6 space-x-4">
      <button
          onClick={() => navigate('/admin/dashboard')}
          className={`cursor-pointer px-4 py-2 rounded-md font-bold ${tab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <FiTable className="inline-block mr-2" /> Go to Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded-md font-bold cursor-pointer bg-blue-600 text-white hover:bg-gray-200'}`}
        >
          <FaUserAlt  className="inline-block mr-2" /> Members
        </button>
        <button
          onClick={() => navigate('/members')}
          className={`cursor-pointer px-4 py-2 rounded-md font-bold ${tab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <FiTable className="inline-block mr-2" /> Go to Table
        </button>
      </div>

      <div className="mb-4 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={`Search users...`}
            className="w-full border outline-0 border-gray-300 rounded-md py-2 pl-10 pr-4 focus:ring-blue-500 focus:border-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeList.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No users found.
            </div>
          ) : (
            activeList.map((item, idx) => (
              <motion.div
                key={item.id}
                className="bg-white shadow-md border border-gray-200 rounded-xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <h3 className="text-lg font-bold text-blue-700 mb-1">
                  {item.username}
                </h3>
                <p className="text-sm text-gray-600 font-bold">
                  Role: {item.role}
                </p>
                <p className="text-sm text-gray-600 font-bold mt-2">
                  Joined {new Date(item.join_date).toLocaleString('en-US', { month: 'short', year: 'numeric' })}

                </p>
                
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Users;
