import React from "react";
import { Disclosure } from "@headlessui/react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import { FaChurch, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Church from "../assets/Adobe Express - file.png";

const Header = () => {
  return (
    <div>
      <Disclosure
        as="nav"
        className="bg-white/80 dark:bg-gray-900 backdrop-blur-md fixed top-5 left-2 right-2 z-50 rounded-xl shadow-lg"
      >
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <Link to="/">
                  <img src={Church} alt="Church Logo" className="w-10 h-10" />
                </Link>
                {/* <FaChurch className="text-indigo-600 w-7 h-7" />
                <span className="text-lg font-bold text-indigo-700">
                  <Link to="/">KGCCI</Link>
                </span> */}
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-6 font-medium text-sm">
                <Link
                  to="/features"
                  className="hover:text-indigo-600 transition"
                >
                  Features
                </Link>
                <Link to="/about" className="hover:text-indigo-600 transition">
                  About
                </Link>
                <Link
                  to="/contact"
                  className="hover:text-indigo-600 transition"
                >
                  Contact
                </Link>

                {/* Login Button for Desktop */}
                <Link to="/login">
                  <button className="ml-4 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:scale-105 hover:shadow-lg transition">
                    <FaSignInAlt /> Login
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Disclosure.Button className="md:hidden text-indigo-600 hover:text-indigo-800">
                {open ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </Disclosure.Button>
            </div>

            {/* Mobile Nav with Transition */}
            <Transition
              show={open}
              enter="transition duration-300 ease-out"
              enterFrom="opacity-0 -translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="transition duration-200 ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-4"
            >
              <Disclosure.Panel
                static
                className="md:hidden px-4 pb-4 space-y-2"
              >
                <Link
                  to="/features"
                  className="block py-2 text-sm hover:text-indigo-600"
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  className="block py-2 text-sm hover:text-indigo-600"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block py-2 text-sm hover:text-indigo-600"
                >
                  Contact
                </Link>
                {/* Login Button for Mobile */}
                <Link to="/login">
                  <button className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:scale-105 hover:shadow-lg transition">
                    <FaSignInAlt /> Login
                  </button>
                </Link>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Header;
