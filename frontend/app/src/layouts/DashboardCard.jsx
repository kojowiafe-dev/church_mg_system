import React, { useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';


const DashboardCard = ({ title, value, colorClass, onClick }) => {

    useEffect(() => {
    AOS.init({ duration: 700, once: true });
    }, []);

  return (
    <div
      data-aos="fade-up"
      onClick={onClick}
      className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer"
    >
      <h2 className="text-lg font-bold text-gray-700">{title}</h2>
      <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{value}</p>
      <div className="flex justify-end items-center gap-2 text-sm font-bold text-gray-700">
        View <FiChevronRight size={18} />
      </div>
    </div>
  );
};

export default DashboardCard;
