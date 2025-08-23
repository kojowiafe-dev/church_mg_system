import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart, Legend } from 'recharts'
import api from '../api'
import DashboardCards from '../../layouts/DashboardCards'
import WindowResize from '../../layouts/WindowResize'
// import { useNavigate } from 'react-router-dom'


const memberData = [
    { name: 'Jan', members: 2000 },
    { name: 'Feb', members: 3900 },
    { name: 'Mar', members: 2000 },
    { name: 'Apr', members: 2780 },
    { name: 'May', members: 1890 },
    { name: 'Jun', members: 2390 },
    { name: 'Jul', members: 5090 },
]

const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
]

const AdminDashboard = () => {

  // const navigate = useNavigate();
  const [memberCount, setMemberCount] = useState(0);
  // const [donationTotal, setDonationTotal] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  // const [isOpen, setIsOpen] = useState(false);

  const windowSize = WindowResize();

  // const handleClick = (location) => {
  //   navigate(location)
  // }


  // const toggleMenu = () => setIsOpen(!isOpen);
  

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const membersRes = await api.get('/count/members');
        const eventsRes = await api.get('/count/events/upcoming')
        setMemberCount(membersRes.data.total_members);
        setEventCount(eventsRes.data.total_upcoming_events);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();

  }, []);

  
  return (
    <div className="space-y-12 pt-18">

      <div>
        <DashboardCards members={memberCount} donations={6520} events={eventCount} />
        <div className={`${windowSize.width < 800 ? 'block' : 'grid grid-cols-2'}`}>
          <div className='col-span-1 text-center'>
            <h2 className="sm:text-lg text-md sm:font-bold font-semibold mb-4 text-gray-700">Church Members Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="members" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className='col-span-1 text-center'>
            <h2 className="sm:text-lg text-md sm:font-bold font-semibold mb-4 text-gray-700">Church Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard