import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiBookOpen, FiSearch, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import WindowResize from '../layouts/WindowResize';

const SermonList = ({
  tab,
  setTab,
  search,
  setSearch,
  loading,
  error,
  activeList,
  onEdit,
  onDelete,
  onCreate,
  showActions = false
}) => {


  const windowSize = WindowResize();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-18">

      <motion.h1
        className="sm:text-4xl text-xl sm:font-bold font-semibold text-center mb-6 text-blue-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Sermon & Event Manager
      </motion.h1>

      <div className="flex justify-center mb-6 sm:space-x-4 space-x-2">

        <button
          onClick={() => setTab('sermons')}
          className={`sm:px-4 px-2 sm:py-2 py-0 rounded-md sm:font-bold font-semibold cursor-pointer ${tab === 'sermons' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <FiBookOpen className={`${windowSize.width < 800 ? 'hidden' : 'inline-block'} mr-2`} /> 
          Sermons
        </button>

        <button
          onClick={() => setTab('events')}
          className={`cursor-pointer sm:px-4 px-3 sm:py-2 py-1 rounded-md sm:font-bold font-semibold ${tab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <FiCalendar className={`${windowSize.width < 800 ? 'hidden' : 'inline-block'} mr-2`} /> 
          Events
        </button>
        <button
          onClick={onCreate}
          className="px-4 py-2 cursor-pointer rounded-md sm:font-bold font-semibold bg-green-600 text-white hover:bg-green-700 text-nowrap"
        >
          <FiPlus className={`${windowSize.width < 800 ? 'hidden' : 'inline-block'} mr-2`} /> 
          Create {tab === 'events' ? 'Event' : 'Sermon'}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* THE SEARCH BUTTON */}
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
        // if the data is loading
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        // else
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeList.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No {tab} found.
            </div>
          ) : (
            activeList.map((item, idx) => {
              const itemId = item.id || `temp-${idx}`;
              return (
                <motion.div
                  key={`${tab}-${itemId}`}
                  layoutId={`${tab}-${itemId}`}
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
                  {showActions && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-slate-800 text-white px-6 py-4 rounded-xl shadow-lg"
        bodyClassName="text-sm font-medium"
      /> */}
    </div>
  );
};

export default SermonList; 