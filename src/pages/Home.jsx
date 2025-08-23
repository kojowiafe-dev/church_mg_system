import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import { FaChurch, FaUsers, FaCalendarAlt, FaSignInAlt } from "react-icons/fa";
import "aos/dist/aos.css";
import TextTransition, { presets } from "react-text-transition";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import video from "../video/5949377-hd_1920_1080_24fps.mp4";
import Daddy from "../assets/Daddy.jpg";

import Header from "../components/Header";

export default function HomePage() {
  // const navigate = useNavigate();

  const [prefix] = useState("manage");
  const [wordIndex, setWordIndex] = useState(0);

  const words = ["members", "events", "sermons"];

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      localStorage.removeItem("accessToken");
    }
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-indigo-50 text-gray-800">
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      {/* Navbar */}

      <Header />

      {/* Hero Section */}
      <section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col justify-center items-center text-center px-6 py-30 text-white w-full h-full"
      >
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover opacity-70"
            autoPlay
            muted
            loop
          >
            <source src={video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 mt-10 md:mt-10">
          <h1
            className="text-4xl md:text-5xl font-extrabold text-indigo-50/90 drop-shadow-xl leading-tight mb-4"
            data-aos="fade-up"
          >
            Welcome to{" "}
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 text-5xl md:text-6xl">
              King Of Glory Covenant Chapel Int.
            </span>
          </h1>

          <div
            className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mt-6 mb-10 leading-relaxed"
            data-aos="fade-down"
          >
            Streamline your church operations — {prefix}{" "}
            <div className="flex justify-center items-center">
              <TextTransition
                springConfig={presets.wobbly}
                inline
                className="text-3xl font-bold"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 inline-block">
                  {words[wordIndex]}
                </span>
              </TextTransition>
            </div>
            and more from one powerful dashboard.
          </div>

          <Link to="/register">
            <button
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-lg transition-all duration-300"
            >
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Pastor Section */}
      <section className="py-20 px-6 relative z-10 bg-gradient-to-b from-white w-full to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Pastor Image */}
            <div className="w-full md:w-1/3" data-aos="fade-right">
              <div className="relative">
                <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-indigo-100 shadow-xl">
                  <img
                    src={Daddy}
                    alt="Prophet. Nelson Wiafe"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg">
                  General Overseer
                </div>
              </div>
            </div>

            {/* Pastor Info */}
            <div
              className="w-full md:w-2/3 text-center md:text-left"
              data-aos="fade-left"
            >
              <h2 className="text-3xl font-bold text-indigo-800 mb-4">
                Meet Our General Overseer
              </h2>
              <h3 className="text-2xl font-semibold text-indigo-600 mb-6">
                Prophet. Nelson Wiafe
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                With 8 years of dedicated service in ministry, Prophet. Nelson
                Wiafe has been leading King of Glory Covenant Chapel
                International since July 2017. His vision and commitment to
                spreading God's love, Jesus Christ, have transformed countless
                lives and built a strong, vibrant community of believers.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Under his leadership, our church has grown into a beacon of hope
                and spiritual guidance, reaching out to communities both locally
                and internationally. His teachings emphasize the importance of
                God's glory, faith, family, and God's love.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <FaFacebookF className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <FaLinkedinIn className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-6 relative z-10 w-full bg-gradient-to-b from-indigo-50 to-white"
      >
        <h2
          className="text-4xl font-bold text-center text-indigo-800 mb-4"
          data-aos="fade-left"
        >
          Powerful Features for Your Ministry
        </h2>
        <p
          className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          data-aos="fade-right"
        >
          Streamline your church operations and enhance community engagement
          with our comprehensive management tools
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {[
            {
              icon: <FaUsers className="text-indigo-600 w-8 h-8" />,
              title: "Member Management",
              desc: "Track attendance, manage member profiles, and maintain family relationships within your congregation.",
            },
            {
              icon: <FaCalendarAlt className="text-indigo-600 w-8 h-8" />,
              title: "Event & Service Planning",
              desc: "Schedule services, events, and meetings. Send automated reminders to members and volunteers.",
            },
            {
              icon: <FaChurch className="text-indigo-600 w-8 h-8" />,
              title: "Sermon & Media Library",
              desc: "Organize and share sermons, worship songs, and media content with your congregation.",
            },
            {
              icon: <FaUsers className="text-indigo-600 w-8 h-8" />,
              title: "Volunteer Management",
              desc: "Coordinate ministry teams, schedule volunteers, and track service hours efficiently.",
            },
            {
              icon: <FaCalendarAlt className="text-indigo-600 w-8 h-8" />,
              title: "Ministry Groups",
              desc: "Manage small groups, Bible studies, and ministry teams with dedicated communication tools.",
            },
            {
              icon: <FaChurch className="text-indigo-600 w-8 h-8" />,
              title: "Resource Management",
              desc: "Track church resources, equipment, and facilities with an easy-to-use inventory system.",
            },
          ].map((item, idx) => (
            // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-12">
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className="group relative overflow-hidden p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md text-center cursor-pointer border border-indigo-100 dark:border-gray-700 transition-all duration-500 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] hover:border-blue-600 "
            >
              <div className="absolute inset-0 bg-indigo-50 dark:bg-gray-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              <div className="relative">
                <div className="bg-indigo-100 dark:bg-indigo-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-700 animate-icon">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white px-6 py-16 md:px-20 w-full mt-auto">
        <div
          className="grid md:grid-cols-4 gap-12 max-w-7xl mx-auto"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Branding */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <FaChurch className="text-indigo-300 w-8 h-8 animate-pulse" />
              <div>
                <div className="text-2xl font-bold text-white">KGCCI</div>
                <div className="text-sm text-indigo-200">
                  King of Glory Covenant Chapel Int.
                </div>
              </div>
            </div>
            <p className="text-indigo-200 mt-4 leading-relaxed">
              Empowering churches with modern management solutions for effective
              ministry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">
              Quick Links
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-indigo-200 hover:text-white transition"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-indigo-200 hover:text-white transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-indigo-200 hover:text-white transition"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-indigo-200 hover:text-white transition"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Ministry */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">
              Ministry
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-indigo-200 hover:text-white transition"
                >
                  Worship Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-indigo-200 hover:text-white transition"
                >
                  Bible Study
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-indigo-200 hover:text-white transition"
                >
                  Youth Ministry
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-indigo-200 hover:text-white transition"
                >
                  Prayer Groups
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">
              Contact Us
            </h2>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li>Ofankor, Agya Herbal</li>
              <li>Accra, Ghana</li>
              <li>Phone: +233 591 783 838</li>
              <li>Email: info@kgcci.org</li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4 text-lg">
              <a
                href="#"
                className="hover:text-white transition transform hover:scale-125 duration-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="hover:text-white transition transform hover:scale-125 duration-300"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="hover:text-white transition transform hover:scale-125 duration-300"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="hover:text-white transition transform hover:scale-125 duration-300"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Marquee Section */}
        <div className="mt-10 border-t border-indigo-700 pt-6">
          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-marquee text-indigo-300 text-sm">
              ✨ "Let everything that has breath praise the Lord." — Psalm 150:6
              &nbsp;&nbsp;|&nbsp;&nbsp; 🙌 Welcome to a digital church
              experience that empowers ministry 🌍 &nbsp;&nbsp;|&nbsp;&nbsp; 💒
              Built with love for the Body of Christ.
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 text-center text-indigo-200 text-sm">
          <p>
            &copy; {new Date().getFullYear()} King of Glory Covenant Chapel
            International. All rights reserved.
          </p>
          <p className="mt-2 text-xs">Designed with ❤️ for the glory of God</p>
        </div>
      </footer>
    </div>
  );
}
