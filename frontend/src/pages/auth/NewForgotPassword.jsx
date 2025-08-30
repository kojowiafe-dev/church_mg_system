import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import video from "../../video/5949377-hd_1920_1080_24fps.mp4";
import { notifySuccess, notifyError } from "../../utils/toastHelpers";
import api from "../api";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formValidation = {
  username: {
    required: "Username is required",
    minLength: { value: 3, message: "Username must be at least 3 characters" },
  },
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
  },
  role: { required: "Role is required" },
};

const LoginForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative z-20 w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {step === 1
            ? "Forgot Password"
            : step === 2
            ? "Enter Verification Code"
            : "Reset Password"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300
                        ${
                          loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                        }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending Code...
                </div>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleSubmit(onSubmitVerification)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                {...register("code", {
                  required: "Verification code is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Please enter the 6-digit code",
                  },
                })}
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter 6-digit code"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300
                        ${
                          loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                        }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleSubmit(onSubmitNewPassword)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300
                        ${
                          loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                        }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {["username", "password", "role"].map((field, index) => (
          <div className="space-y-2" key={index}>
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {field === "password" ? (
              <div className="relative">
                <Input
                  {...register(field, formValidation[field])}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                  placeholder={`Enter your ${field}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            ) : field === "role" ? (
              <Controller
                name="role"
                control={control}
                rules={formValidation.role}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="pastor">Pastor</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input
                {...register(field, formValidation[field])}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                placeholder={`Enter your ${field}`}
              />
            )}
            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field].message}
              </p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <Input
              {...register("remember_me")}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer
          ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/new-register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register here
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

const NewForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const popup = localStorage.getItem("registerToken");
    if (popup) {
      notifySuccess("You've registered!", {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.removeItem("registerToken");
    }
  }, []);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const payload = {
        username: data.username,
        password: data.password,
        role: data.role,
      };

      const response = await api.post("/auth/login", payload, {
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Accept: "application/json",
        },
      });

      if (!response.data.access_token)
        throw new Error("No access token received");

      const { access_token, role } = response.data;
      const storage = data.remember_me ? localStorage : sessionStorage;

      storage.setItem("accessToken", access_token);
      storage.setItem("role", role);
      storage.setItem("username", data.username);

      login(access_token, role, data.username);
      localStorage.setItem("loginToken", "Welcome");
      navigate("/profile");
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        (error.response?.status === 401 && "Invalid username or password") ||
        (error.message === "No access token received" &&
          "Invalid response from server") ||
        (error.message === "Network Error" &&
          "Cannot connect to server. Please check your connection.") ||
        "Something went wrong";

      notifyError(message, {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="h-screen md:grid grid-cols-2 px-16 py-6 pt-18 hidden">
        <div className="bg-white dark:bg-slate-900 rounded-xl mt-6 shadow-md z-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <video
              className="w-full h-full object-cover rounded-xl"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag
            </video>
            {/* <div className="absolute inset-0 bg-black/60" /> */}
          </div>
        </div>
        <div className="flex items-center justify-center bg-white dark:bg-slate-900 px-20 py-15 rounded-xl mt-6 shadow-md z-20">
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>
      </div>
      <div className="h-screen md:hidden grid grid-cols-1 px-16 py-6 pt-18 items-center">
        <LoginForm onSubmit={handleLogin} loading={loading} />
      </div>
    </div>
  );
};

export default NewForgotPassword;
