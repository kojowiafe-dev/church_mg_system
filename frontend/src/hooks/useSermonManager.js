import { useState, useEffect } from 'react';
import api from '../pages/api';
import { toast } from 'react-hot-toast';

const useSermonManager = () => {
  const [tab, setTab] = useState('sermons');
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sermonsRes, eventsRes] = await Promise.all([
        api.get('/sermon'),
        api.get('/event'),
      ]);
      setSermons(sermonsRes.data.reverse());
      setEvents(eventsRes.data.reverse());
      toast.success('Data loaded successfully');
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again later.");
      toast.error('Failed to load data');
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

  return {
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
    activeList,
    fetchData
  };
};

export default useSermonManager; 