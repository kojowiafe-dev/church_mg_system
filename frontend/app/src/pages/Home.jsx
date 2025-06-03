import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import AOS from "aos";
import { FaChurch, FaUsers, FaCalendarAlt, FaSignInAlt } from "react-icons/fa";
import bgImage from '../assets/john-price-RAZQiZOX3mU-unsplash.jpg'
import 'aos/dist/aos.css';
import TextTransition, { presets } from "react-text-transition";

export default function HomePage() {

  const [prefix] = useState('manage');
  const [wordIndex, setWordIndex] = useState(0);

  const words = ['members', 'events', 'sermons'];

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem("accessToken");
    }
    AOS.init({ duration: 1000 })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [])

  // const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-indigo-50 text-gray-800">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})`, opacity: 0.5 }}>
      </div>
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      {/* Navbar */}
      <header className="bg-indigo-50/80 shadow-md px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 text-xl font-bold text-indigo-600 relative z-20">
          <FaChurch className="text-indigo-700" />
          KGCCI
        </div>
        
        <Link to='/login'>
            <button className="cursor-pointer font-bold bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700 flex items-center gap-2 transition" >
            <FaSignInAlt /> Login
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative z-10 text-white"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-50/80 mb-4 drop-shadow-md" data-aos="fade-up">
          Welcome to <span className="text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 block">King Of Glory Covenant Chapel International</span>
        </h1>
        <div className="text-gray-300 text-lg md:text-xl mb-6 max-w-2xl mt-10" data-aos="fade-down">
          {/* A modern church management system designed to empower your ministry and enhance community engagement. */}
          Streamline your church operations — {prefix} {" "}
          <div className="flex justify-center items-center"> 
            <TextTransition springConfig={presets.gentle} inline className="text-3xl font-bold">
              <span aria-live="polite" className="bg-clip-text text-transparent  bg-gradient-to-r from-indigo-600 to-indigo-400 inline-block">{words[wordIndex]}</span>
            </TextTransition>
          </div>
          and more from one powerful dashboard.
        </div>
        <Link to='/register'>
          <motion.button
            // ref={btnRef}
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              padding: '12px 24px',
              // backgroundColor: '#2563eb'
              // color: 'white',
              // border: 'none',
              borderRadius: '12px',
              // fontSize: '16px',
              // cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
            className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-indigo-700 transition mt-10"
            // data-aos="fade-down"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 relative z-10">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-10" data-aos="fade-left">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 bg-indigo-50/45 rounded-2xl shadow text-center hover:shadow-lg cursor-pointer hover:bg-indigo-50 transition-transform duration-300 hover:-translate-y-2"
          >
            <FaUsers className="text-indigo-600 w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Member Management</h3>
            <p className="text-gray-700">Track, engage, and support your church members with ease.</p>
          </motion.div> */}
          <div data-aos="fade-up"
            className="p-6 bg-indigo-50/45 rounded-2xl shadow text-center hover:shadow-lg cursor-pointer hover:bg-indigo-50 transition-transform duration-300 hover:-translate-y-2"
          >
            <FaUsers className="text-indigo-600 w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Member Management</h3>
            <p className="text-gray-700">Track, engage, and support your church members with ease.</p>
          </div>
          {/* <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-6 bg-indigo-50/80 rounded-2xl shadow text-center hover:shadow-lg cursor-pointer hover:bg-indigo-50 transition-transform duration-300 hover:-translate-y-2"
          >
            <FaCalendarAlt className="text-indigo-600 w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Event Scheduling</h3>
            <p className="text-gray-700">Plan church events and services with a shared calendar system.</p>
          </motion.div> */}
          <div data-aos="fade-down"
            className="p-6 bg-indigo-50/80 rounded-2xl shadow text-center hover:shadow-lg cursor-pointer hover:bg-indigo-50 transition-transform duration-300 hover:-translate-y-2"
          >
            <FaCalendarAlt className="text-indigo-600 w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Event Scheduling</h3>
            <p className="text-gray-700">Plan church events and services with a shared calendar system.</p>
          </div>
          {/* <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="p-6 bg-indigo-50/45 rounded-2xl shadow text-center hover:shadow-lg cursor-pointer hover:bg-indigo-50 transition-transform duration-300 hover:-translate-y-2"
          >
            <FaChurch className="text-indigo-600 w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Sermon Archive</h3>
            <p className="text-gray-700">Organize and share past sermons with your congregation online.</p>
          </motion.div> */}
          <div data-aos="fade-up"
            className="p-6 bg-indigo-50/45 rounded-2xl shadow text-center hover:shadow-lg cursor-pointer hover:bg-indigo-50 transition-transform duration-300 hover:-translate-y-2"
          >
            <FaChurch className="text-indigo-600 w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Sermon Archive</h3>
            <p className="text-gray-700">Organize and share past sermons with your congregation online.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-indigo-600 bg-indigo-50/80 text-center py-6 mt-auto font-bold relative z-10">
        <p>&copy; {new Date().getFullYear()} ChurchConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}