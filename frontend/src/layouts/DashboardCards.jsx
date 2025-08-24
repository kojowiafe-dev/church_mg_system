import React from 'react';
import WindowResize from './WindowResize';
import DashboardCard from './DashboardCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'

const DashboardCards = ({ members, donations, events }) => {

  const navigate = useNavigate();

  const windowSize = WindowResize();
  const gridClasses = windowSize.width < 768 
    ? "grid grid-cols-1 gap-6 p-4" 
    : "grid grid-cols-3 gap-6 p-4";

    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.2
        }
      }
    }

    const cardVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

  return (
    <motion.div className={`${gridClasses} mb-10`}
    variants={containerVariants}
    initial="hidden"
    animate="visible">
      {[ 
        {
          title: "Registered Members", value: members, colorClass: "text-blue-600", onClick: () => navigate('/admin/users')
        },
        {
          title: "Total Donations", value: `₵${donations}`, colorClass: "text-green-600", onClick: () => console.log("Go to donations page")
        },
        {
          title: "Upcoming Events", value: events, colorClass: "text-purple-600", onClick: () => navigate('/events')
        }
      ].map((card, index) => (
        <motion.div key={index} variants={cardVariants}>
          <DashboardCard {...card} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardCards;
