import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Name, Email, and Message are required.");
      return;
    }
    setError("");
    setSubmitted(true);
    // Send data to backend or email service here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center py-16 px-6"
    >
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 md:p-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-blue-900 flex justify-center items-center gap-2">
            <Sparkles className="text-yellow-500" /> Contact Us
          </h2>
          <p className="mt-2 text-gray-600">
            We'd love to hear from you! Fill the form and we’ll reach out soon.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 space-y-5"
          >
            <div>
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                <MapPin className="text-blue-700" /> Church Address
              </h3>
              <p>123 Faith Avenue, Accra, Ghana</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                <Phone className="text-blue-700" /> Phone
              </h3>
              <p>+233 123 456 789</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                <Mail className="text-blue-700" /> Email
              </h3>
              <p>info@kogchapel.org</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Service Times</h3>
              <ul className="list-disc ml-5 text-gray-700">
                <li>Sunday: 9:00 AM & 11:00 AM</li>
                <li>Wednesday: 7:00 PM</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Follow Us</h3>
              <div className="flex gap-4 text-2xl text-blue-600">
                <a href="#" className="hover:text-blue-800">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="hover:text-blue-500">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="hover:text-pink-600">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 space-y-4"
          >
            <Input
              placeholder="Name *"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Email *"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              placeholder="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
            />
            <Textarea
              placeholder="Your Message *"
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {submitted && (
              <div className="text-green-600 text-sm">
                Thank you! We'll be in touch shortly.
              </div>
            )}
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </motion.form>
        </div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <iframe
            title="Church Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.3723313749044!2d-0.2748998251150366!3d5.6730388335829505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9fc37b69420f%3A0x156488beee9b2f!2sKing%20Of%20Glory%20Covenant%20Chapel%20International!5e0!3m2!1sen!2sgh!4v1720534567890!5m2!1sen!2sgh"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl shadow-md"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
