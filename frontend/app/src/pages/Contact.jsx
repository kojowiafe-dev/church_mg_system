import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Meteors } from "../components/magicui/meteors";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Name, Email, and Message are required.");
      toast.error("Please fill all required fields.");
      return;
    }
    setError("");
    toast.success("Message sent successfully! We'll get back to you soon.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Side Panel / Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl p-8 bg-gradient-to-br from-blue-800 to-indigo-900 text-white shadow-xl overflow-hidden"
        >
          <Meteors number={25} className="absolute inset-0" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl font-bold">Reach Out to Us</h2>
            <p className="text-blue-100">
              We'd love to connect with you. Whether you're new, have questions,
              or need prayer, we're here for you.
            </p>
            <ul className="space-y-2 text-sm text-blue-200">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> 123 Faith Avenue, Accra, Ghana
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +233 123 456 789
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> info@kogchapel.org
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Sun: 9am & 11am • Wed: 7pm
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md"
        >
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name *
            </label>
            <Input
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address *
            </label>
            <Input
              name="email"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <Input
              name="phone"
              id="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+233..."
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="subject" className="block text-sm font-medium">
              Subject
            </label>
            <Input
              name="subject"
              id="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="How can we help?"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="message" className="block text-sm font-medium">
              Message *
            </label>
            <Textarea
              name="message"
              id="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="Your message..."
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </motion.form>
      </div>

      {/* Contact Info Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <MapPin className="h-5 w-5" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent>123 Faith Avenue, Accra, Ghana</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Clock className="h-5 w-5" /> Service Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            Sunday: 9am & 11am <br /> Wednesday: 7pm
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Mail className="h-5 w-5" /> Social Links
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 text-xl text-blue-600 dark:text-blue-400">
            <a href="#" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram />
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Embedded Map */}
      <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
        <iframe
          title="Church Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.3723313749044!2d-0.2748998251150366!3d5.6730388335829505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9fc37b69420f%3A0x156488beee9b2f!2sKing%20Of%20Glory%20Covenant%20Chapel%20International!5e0!3m2!1sen!2sgh!4v1720534567890!5m2!1sen!2sgh"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        ></iframe>
      </div>
    </div>
  );
}
