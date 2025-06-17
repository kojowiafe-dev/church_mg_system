import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import AOS from "aos";
import { FaChurch, FaUsers, FaCalendarAlt, FaSignInAlt } from "react-icons/fa";
import bgImage from '../assets/john-price-RAZQiZOX3mU-unsplash.jpg'
import 'aos/dist/aos.css';
import TextTransition, { presets } from "react-text-transition";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import video from '../video/5949377-hd_1920_1080_24fps.mp4'


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

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-indigo-50 text-gray-800">
      {/* <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})`, opacity: 0.5 }}>
      </div> */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      {/* Navbar */}
      <header className="bg-indigo-300/30 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center fixed w-full z-50">
        <div className="flex items-center gap-2 text-xl font-bold text-indigo-600 relative z-20">
          <FaChurch className="text-indigo-600" />
          KGCCI
        </div>
        
        <Link to='/login'>
            <button className="cursor-pointer font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-3 rounded hover:scale-110 flex items-center gap-2 transition duration-300 ease-in-out" >
            <FaSignInAlt /> Login
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative z-10 text-white min-h-screen mt-16"
      >
        <div className="absolute inset-0 overflow-hidden">
          <video style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8' }} autoPlay muted loop>
            <source src={video} type="video/mp4" />
          </video>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-50/80 mb-4 drop-shadow-md" data-aos="fade-up">
          Welcome to <span className="text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 block">King Of Glory Covenant Chapel International</span>
        </h1>
        <div className="text-gray-300 text-lg md:text-xl mb-6 max-w-2xl mt-10" data-aos="fade-down">
          {/* A modern church management system designed to empower your ministry and enhance community engagement. */}
          Streamline your church operations — {prefix} {" "}
          <div className="flex justify-center items-center"> 
            <TextTransition springConfig={presets.wobbly} inline className="text-3xl font-bold">
              <span aria-live="polite" className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 inline-block">{words[wordIndex]}</span>
            </TextTransition>
          </div>
          and more from one powerful dashboard.
        </div>
        <Link to='/register'>
          <motion.button
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
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
      <section id="features" className="py-16 px-6 relative z-10 min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <h2 className="text-4xl font-bold text-center text-indigo-800 mb-4" data-aos="fade-left">
          Powerful Features for Your Ministry
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto" data-aos="fade-right">
          Streamline your church operations and enhance community engagement with our comprehensive management tools
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <div
            data-aos="fade-up"
            className="p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-indigo-100"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Member Management</h3>
            <p className="text-gray-600">Track attendance, manage member profiles, and maintain family relationships within your congregation.</p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-indigo-100"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Event & Service Planning</h3>
            <p className="text-gray-600">Schedule services, events, and meetings. Send automated reminders to members and volunteers.</p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-indigo-100"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChurch className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Sermon & Media Library</h3>
            <p className="text-gray-600">Organize and share sermons, worship songs, and media content with your congregation.</p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-indigo-100"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUsers className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Volunteer Management</h3>
            <p className="text-gray-600">Coordinate ministry teams, schedule volunteers, and track service hours efficiently.</p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-indigo-100"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalendarAlt className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Ministry Groups</h3>
            <p className="text-gray-600">Manage small groups, Bible studies, and ministry teams with dedicated communication tools.</p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-delay="500"
            className="p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] border border-indigo-100"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChurch className="text-indigo-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Resource Management</h3>
            <p className="text-gray-600">Track church resources, equipment, and facilities with an easy-to-use inventory system.</p>
          </div>

        </div>
      </section>


      {/* Footer */}
      {/* <footer className="text-indigo-600 bg-indigo-50/80 text-center py-6 mt-auto font-bold relative z-10">
        <p>&copy; {new Date().getFullYear()} ChurchConnect. All rights reserved.</p>
      </footer> */}
      <footer className="bg-indigo-300/30 backdrop-blur-md text-white px-6 py-10 md:px-20">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Branding */}
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-700">KGCCI</h1>
            <p className="mt-4 text-gray-400">
              Come and experience the King Of Glory.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-indigo-300/30">Home</a></li>
              <li><a href="#" className="hover:text-indigo-300/30">Services</a></li>
              <li><a href="#" className="hover:text-indigo-300/30">About</a></li>
              <li><a href="#" className="hover:bg-indigo-300/30">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4 text-indigo-300/30 text-2xl">
              <a href="#" className="text-indigo-700"><FaFacebookF /></a>
              <a href="#" className="text-indigo-700"><FaTwitter /></a>
              <a href="#" className="text-indigo-700"><FaLinkedinIn /></a>
              <a href="#" className="text-indigo-700"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} KGCCI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}