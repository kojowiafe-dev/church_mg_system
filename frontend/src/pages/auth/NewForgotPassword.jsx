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

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Verification Code, 3: New Password
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  useEffect(() => {
    let timer;
    if (showSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (showSuccess && countdown === 0) {
      navigate("/login");
    }
    return () => clearTimeout(timer);
  }, [showSuccess, countdown, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Sending forgot password request with data:", {
        email: data.email,
      });

      const response = await api.post("/auth/forgot-password", {
        email: data.email,
      });

      console.log("Forgot password response:", response.data);

      if (response.data.message) {
        notifySuccess(response.data.message, {
          style: { background: "#000", color: "#fff" },
        });
        setEmail(data.email);
        setStep(2);
      } else {
        throw new Error("No success message received");
      }
    } catch (error) {
      console.error("Forgot password error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      let errorMessage = "Something went wrong";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Email not found";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.detail || "Invalid request";
        } else {
          errorMessage =
            error.response.data.detail || "Failed to process request";
        }
      } else if (error.message === "No success message received") {
        errorMessage = "Invalid response from server";
      } else if (error.message === "Network Error") {
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      notifyError(errorMessage, {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVerification = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/verify-code", {
        email,
        code: data.code,
      });
      setStep(3);
      notifySuccess("Code verified successfully!", {
        style: { background: "#000", color: "#fff" },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Invalid verification code";
      notifyError(errorMessage, {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitNewPassword = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        password: data.password,
      });

      setShowSuccess(true);
      notifySuccess(
        <div>
          <h4 className="font-bold mb-2">Password Reset Successful!</h4>
          <p>You can now login with your new password.</p>
        </div>,
        {
          style: { background: "#000", color: "#fff" },
          autoClose: false,
          closeOnClick: false,
        }
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Failed to reset password";
      notifyError(errorMessage, {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = () => {
    navigate("/login");
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Background Image */}
        {/* <BackgroundImage
          src={bgImage}
          className="absolute inset-0"
          fallbackColor="#222"
          style={{ opacity: 0.5 }}
        />
        <div className="absolute inset-0 bg-black opacity-40" />

        {/* Success Message */}
        <div className="relative z-20 w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            You can now login with your new password.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Redirecting to login page in {countdown} seconds...
            </p>

            <button
              onClick={handleManualLogin}
              className="w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* <div className="relative z-20 w-full max-w-md bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8"> */}
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
            <Input
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
                Sending Code...
              </div>
            ) : (
              "Send Verification Code"
            )}
          </Button>
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
            <Input
              {...register("code", {
                required: "Verification code is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Please enter the 6-digit code",
                },
              })}
              type="text"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter 6-digit code"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
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
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>
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
                Resetting...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
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
      {/* </div> */}
    </motion.div>
  );
};

const NewForgotPassword = () => {
  return (
    <div>
      <div className="h-screen md:grid grid-cols-2 px-16 py-6 pt-18 hidden">
        <div className="flex items-center justify-center bg-white dark:bg-slate-900 px-20 py-15 rounded-xl mt-6 shadow-md z-20">
          <ForgotPasswordForm />
        </div>
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
      </div>
      <div className="h-screen md:hidden grid grid-cols-1 px-16 py-6 pt-8 items-center">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default NewForgotPassword;
