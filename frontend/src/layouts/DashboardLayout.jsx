import React, { useEffect, useState, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bounce, Slide, Zoom, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
// import api from '../pages/api';
import WindowResize from './WindowResize';
import { HiMenu, HiX, HiUserCircle } from 'react-icons/hi'
import { FaSignOutAlt, FaHome, FaCalendar, FaDatabase, FaBible, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [UserName, setUserName] = useState("");
    const sidebarRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const windowSize = WindowResize();

    const { auth, logout } = useAuth();
    const { role, username } = auth;

    const handleLogout = () => {
      logout();
      toast.success("Logged out!");
      setIsOpen(false);

      // Redirect after delay
      setTimeout(() => {
        navigate('/'); // or navigate('/login');
      }, 1000);
    };


    const sideBarMenus = {
      admin: [
        { id: 1, name: 'Home', path: '/', icon: <FaHome /> },
        { id: 2, name: 'Profile', path: '/profile', icon: <FaUser/> },
        { id: 3, name: 'Dashboard', path: '/admin/dashboard', icon: <FaDatabase /> },
        { id: 4, name: 'Users', path: '/admin/users', icon: <FaUser /> },
        { id: 5, name: 'Manager', path: '/manager', icon: <FaBible /> },
        // { id: 6, name: 'Events', path: '/events', icon: <FaCalendar /> },
        { id: 7, name: 'Logout', path: '/', icon: <FaSignOutAlt /> }
      ],
      pastor: [
        { id: 1, name: 'Home', path: '/', icon: <FaHome /> },
        { id: 2, name: 'Dashboard', path: '/pastor/dashboard', icon: <FaDatabase /> },
        { id: 3, name: 'Users', path: '/pastor/users', icon: <FaUser /> },
        { id: 4, name: 'Sermons', path: '/sermons', icon: <FaBible /> },
        { id: 5, name: 'Events', path: '/events', icon: <FaCalendar /> },
        { id: 6, name: 'Logout', path: '/', icon: <FaSignOutAlt /> }
      ],
      member: [
        { id: 1, name: 'Home', path: '/', icon: <FaHome /> },
        { id: 2, name: 'Profile', path: '/profile', icon: <FaUser/> },
        { id: 3, name: 'Dashboard', path: '/member/home', icon: <FaDatabase /> },
        { id: 4, name: 'Logout', path: '/', icon: <FaSignOutAlt /> }
        // { name: 'Events', path: '/events' },
      ],
    }

  
  const menu = sideBarMenus[role] || []
  

  useEffect(() => {

    if (localStorage.getItem('justLoggedIn')) {
      toast.success("Welcome back!");
      localStorage.removeItem("justLoggedIn");
    }

    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className='fixed top-0 left-0 w-full bg-white/95 shadow-md z-50'>
        <div className='flex justify-between p-4 items-center pl-7 pr-7' ref={sidebarRef}>
          <button onClick={() => setIsOpen(true)} className={`p-2 text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none`} aria-label="Open menu">
            <HiMenu size={windowSize.width < 800 ? '20' : '24'} />
          </button>
          <div className='sm:text-lg text-sm text-gray-700 font-bold'>KGCCI</div>
          <div className='font-bold flex items-center gap-2 text-gray-700'>
            <HiUserCircle size={24} />
            <Link to={`/profile`} className='sm:text-lg text-sm font-bold'>{username}</Link>
          </div>
        </div>
      </nav>

      {/* Sidebar (Desktop & Mobile View) */}
      <div className={`fixed top-0 left-0 h-full w-full shadow-md transform transition-transform duration-500 ease-in-out z-50 ${isOpen ? '-translate-x-0' : '-translate-x-full'}`}>

        {/* information inside Sidebar */}
        <AnimatePresence>
          {isOpen && (
            <>
             {/* Sidebar Animation */}
             <motion.div
              initial={{ x: '-100%'}}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', stiffness: 230, damping: 20 }}
              className='fixed top-0 left-0 h-full sm:w-80 w-70 bg-white shadow-md transform transition-transform duration-300 ease-in-out z-50 flex flex-col'
              >
                <div className='p-4 border-b-6 border-gray-700 flex justify-between items-center'>
                  <span className='font-bold sm:text-lg text-sm text-gray-700'>Menu</span>
                  <button onClick={() => setIsOpen(false)} className='p-1 text-gray-700 rounded hover:bg-gray-100 cursor-pointer'>
                    <HiX size={windowSize.width < 800 ? '20' : '24'} />
                  </button>
                </div>

                <div className='flex flex-col gap-4 overflow-y-auto h-[calc(100vh-80px)] mt-4 p-4 sm:font-bold font-semibold sm:text-lg text-md text-gray-700 space-y-4'>
                  {menu.map((data) => {
                    if (data.name === 'Logout') {
                      return (
                        <div key={data.id} onClick={handleLogout} className='shadow-md rounded-2xl p-3 border border-gray-200 hover:shadow-lg transition cursor-pointer flex items-center justify-between gap-4 text-red-600'>
                          {data.name}
                          {data.icon}
                        </div>
                      )
                    }

                    return (
                      <Link key={data.id} to={data.path} onClick={() => setIsOpen(false)}>
                        <div
                          className={`shadow-md rounded-2xl p-3 border 
                            ${location.pathname === data.path 
                              ? "border-blue-500 bg-blue-50 text-blue-700" 
                              : "border-gray-200 text-gray-700"} 
                            hover:shadow-lg transition cursor-pointer flex items-center justify-between gap-4`}
                        >
                          {data.name}
                          {data.icon}
                        </div>
                      </Link>
                    );
                  })}
                </div>
             </motion.div>

             {/* Overlay Fade Animation */}
             <motion.div
              className='fixed inset-0 w-full h-full bg-black/30 z-40' 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={() => setIsOpen(false)}>

              </motion.div>
            </>
          )}
        </AnimatePresence>
    
      </div>

      <main className="flex-1 p-6"> 
        <Outlet />
      </main>
      <ToastContainer position='top-right' transition={Bounce} autoClose={2000} theme='dark' toastClassName={() => "bg-slate-800 text-white px-6 py-4 rounded-xl shadow-lg animate-slide-in"} bodyClassName={() => "text-sm font-medium"}/>
    </div>
  )
}

export default DashboardLayout