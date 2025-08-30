import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import video from "../../video/5949377-hd_1920_1080_24fps.mp4";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import api from "../api";

const RegisterForm = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Format dates properly
      const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      // Create user and member profile in a single request
      const registrationData = {
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
          phone: data.phone,
          house_address: data.house_address,
          role: data.role,
        },
        member: {
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: formatDate(data.date_of_birth),
          gender: data.gender,
          marital_status: data.marital_status,
          occupation: data.occupation || null,
          emergency_contact: data.emergency_contact || null,
          emergency_contact_phone: data.emergency_contact_phone || null,
          baptism_date: formatDate(data.baptism_date),
          membership_date: new Date().toISOString().split("T")[0],
          notes: data.notes || null,
        },
      };

      console.log("Registration data:", registrationData); // Debug log

      const response = await api.post("/auth/register", registrationData);

      if (response.status === 200) {
        localStorage.setItem("registerToken", "Welcome");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.detail || "Registration failed";
      toast.error(errorMessage, {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="w-full flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    step < currentStep ? "bg-blue-600" : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        {/* <div className="text-center text-sm text-gray-400 flex items-center justify-center">
          Step {currentStep} of 4
        </div> */}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-[450px] h-[500px] flex items-center justify-center"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col"
        >
          <div className="flex-1">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="items-center grid md:grid-cols-1 gap-4">
                  <div className="flex justify-center items-center py-2 rounded-lg w-full">
                    <h2 className="text-lg font-semibold">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("first_name", { required: true })}
                        type="text"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your first name"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("last_name", {
                          required: "Last name is required",
                        })}
                        type="text"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Your last name"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Controller
                        name="role"
                        control={control}
                        // rules={formValidation.role}
                        render={({ field }) => (
                          <Select
                            {...register("role", {
                              required: "Role is required",
                            })}
                            onValueChange={field.onChange}
                            // value={field.value}
                          >
                            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              {/* <SelectItem value="admin">Admin</SelectItem> */}
                              <SelectItem value="pastor">Pastor</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="date" className="px-1">
                          Date of birth
                        </Label>

                        <Controller
                          name="date_of_birth"
                          control={control} // comes from useForm()
                          rules={{ required: "Date of birth is required" }}
                          render={({ field, fieldState }) => (
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className="w-48 justify-between font-normal"
                                >
                                  {field.value
                                    ? new Date(field.value).toLocaleDateString()
                                    : "Select date"}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  captionLayout="dropdown"
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setOpen(false);
                                  }}
                                />
                              </PopoverContent>
                              {fieldState.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {fieldState.error.message}
                                </p>
                              )}
                            </Popover>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marital_status">Marital Status</Label>
                      <Select
                        // value={formData.companySize}
                        onValueChange={(value) =>
                          handleInputChange("marital_status", value)
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="2widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Step 2: Features Selection */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="items-center grid md:grid-cols-1 gap-4">
                  <div className="flex justify-center items-center py-2 rounded-lg w-full">
                    <h2 className="text-lg font-semibold">
                      Contact Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="house_address">House Address</Label>
                      <Input
                        id="house_address"
                        value={formData.house_address}
                        onChange={(e) =>
                          handleInputChange("house_address", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Your house address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_name">
                        Emergency Contact Name
                      </Label>
                      <Input
                        id="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) =>
                          handleInputChange(
                            "emergency_contact_name",
                            e.target.value
                          )
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Your emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_phone">
                        Emergency Contact Number
                      </Label>
                      <Input
                        id="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={(e) =>
                          handleInputChange(
                            "emergency_contact_phone",
                            e.target.value
                          )
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Step 3: Project Details */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="items-center grid md:grid-cols-1 gap-4">
                  <div className="flex justify-center items-center py-2 rounded-lg w-full">
                    <h2 className="text-lg font-semibold">
                      Additional Information
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Occupation</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="date" className="whitespace no-wrap">
                          Baptism Date
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-48 justify-between font-normal"
                            >
                              {date ? date.toLocaleDateString() : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="items-center grid md:grid-cols-1 gap-4">
                  <div className="flex justify-center items-center py-2 rounded-lg w-full">
                    <h2 className="text-lg font-semibold">Account Security</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="relative w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                          placeholder={`Enter your password`}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="relative space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="relative w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                          placeholder={`Confirm your password`}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Success Step */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full w-full flex flex-col items-center justify-center space-y-4"
              >
                {/* <div className="flex items-center justify-center rounded-full bg-green-500/10 p-4">
                  <CheckCircle className="text-green-400 w-16 h-16" />
                </div> */}
                <div className="w-full max-w-sm mx-auto text-center">
                  <h2 className="text-lg font-semibold text-black/60 mb-2">
                    Registration Successful!
                  </h2>
                  <p className="text-sm text-gray-600 mb-8">
                    Welcome to{" "}
                    <span className="text-gradient text-blue-600 font-semibold">
                      Church Management System
                    </span>
                    . Your account has been created successfully! 🚀
                  </p>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Continue to Login
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between items-center pt-8 border-t border-white/20">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="text-black hover:bg-white/70 cursor-pointer"
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}
              {currentStep === 3 ? (
                <Button
                  type="submit"
                  onClick={nextStep}
                  disabled={loading}
                  className={` py-3 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer
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
                      Registering...
                    </div>
                  ) : (
                    "Register"
                  )}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </form>

        {/* </CardContent>
      </Card> */}
      </motion.div>
    </div>
  );
};

const NewRegister = () => {
  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full grid grid-cols-2 px-16 py-6 pt-24">
        <div className="flex items-center justify-center dark:bg-slate-900 rounded-xl shadow-md z-20 overflow-hidden">
          {/* <div className="w-full h-full overflow-y-auto"> */}
          <RegisterForm />
          {/* </div> */}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md z-20 relative overflow-hidden">
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="bg-slate-800 text-white px-6 py-4 rounded-xl shadow-lg"
        bodyClassName="text-sm font-medium"
      />
    </div>
  );
};

export default NewRegister;
