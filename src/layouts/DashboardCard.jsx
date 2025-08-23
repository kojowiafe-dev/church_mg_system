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
      className="bg-white shadow-md rounded-2xl sm:p-6 p-4 border border-gray-200 hover:shadow-lg transition cursor-pointer"
    >
      <h2 className="sm:text-lg text-sm sm:font-bold font-semibold text-gray-700">{title}</h2>
      <p className={`sm:text-3xl text-xl sm:font-bold font-semibold mt-2 ${colorClass}`}>{value}</p>
      <div className="flex justify-end items-center gap-2 text-sm sm:font-bold font-semibold text-gray-700">
        View <FiChevronRight size={18} />
      </div>
    </div>
  );
};

export default DashboardCard;
