import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { FiCalendar, FiBookOpen, FiSearch } from 'react-icons/fi';

const MemberDashboard = () => {
  const [tab, setTab] = useState('sermons');
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [sermonsRes, eventsRes] = await Promise.all([
        api.get('/sermon'),
        api.get('/event'),
      ]);
      setSermons(sermonsRes.data.reverse());
      setEvents(eventsRes.data.reverse());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSermons = sermons.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
  const filteredEvents = events.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const activeList = tab === 'sermons' ? filteredSermons : filteredEvents;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-18">
      <motion.h1
        className="sm:text-4xl text-md sm:font-bold font-semibold text-center mb-6 text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Member Dashboard
      </motion.h1>

      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setTab('sermons')}
          className={`px-4 py-2 rounded-md font-bold cursor-pointer ${tab === 'sermons' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <FiBookOpen className="inline-block mr-2" /> Sermons
        </button>
        <button
          onClick={() => setTab('events')}
          className={`cursor-pointer px-4 py-2 rounded-md font-bold ${tab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <FiCalendar className="inline-block mr-2" /> Events
        </button>
      </div>

      <div className="mb-4 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={`Search ${tab}...`}
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
              No {tab} found.
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
                  {tab === 'sermons' ? item.title : item.name}
                </h3>
                <p className="text-sm text-gray-600 font-bold">
                  {tab === 'sermons'
                    ? `Preacher: ${item.preacher}`
                    : `Location: ${item.location}`}
                </p>
                <p className="text-sm text-gray-500 mt-1 font-bold">
                  Date: {item.date}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MemberDashboard;
