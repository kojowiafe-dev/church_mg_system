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
    <div className="h-full flex flex-col p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-6"
      >
        <div className="w-full flex items-center justify-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center justify-center">
              <div
                className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs md:text-sm font-bold md:font-semibold ${
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
                  className={`w-12 md:w-16 h-1 mx-2 ${
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
        className="px-6 md:px-1 w-[400px] md:w-[450px] h-[550px] md:h-[500px] flex items-center justify-center"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-[500px] md:h-full flex flex-col"
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
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("first_name", { required: true })}
                        type="text"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Enter your first name"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("last_name", {
                          required: "Last name is required",
                        })}
                        type="text"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Your last name"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>

                      <Controller
                        name="role"
                        control={control} // from useForm()
                        rules={{ required: "Role is required" }}
                        render={({ field, fieldState }) => (
                          <div className="space-y-1">
                            <Select
                              value={field.value || ""} // bind form value
                              onValueChange={field.onChange} // update form state
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-foreground">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="guest">Pastor</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <p className="text-red-500 text-sm">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>

                      <Controller
                        name="gender"
                        control={control} // from useForm()
                        rules={{ required: "Gender is required" }}
                        render={({ field, fieldState }) => (
                          <div className="space-y-1">
                            <Select
                              value={field.value || ""} // bind form value
                              onValueChange={field.onChange} // update form state
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-foreground">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <p className="text-red-500 text-sm">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div className="grid md:grid-cols-2 gap-6 bg-red-400"> */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="px-1">
                        Date of birth
                      </Label>

                      <Controller
                        name="date_of_birth"
                        control={control} // comes from useForm()
                        rules={{ required: "Date of birth is required" }}
                        render={({ field }) => (
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
                            {/* {fieldState.error && (
                                <p className="text-red-500 text-sm mt-1">
                                  {fieldState.error.message}
                                </p>
                              )} */}
                          </Popover>
                        )}
                      />
                    </div>
                    {/* </div> */}

                    <div className="space-y-2">
                      <Label htmlFor="marital_status">Marital Status</Label>

                      <Controller
                        name="marital_status"
                        control={control} // from useForm()
                        rules={{ required: "Marital status is required" }}
                        render={({ field, fieldState }) => (
                          <div className="space-y-1">
                            <Select
                              value={field.value || ""} // bind form value
                              onValueChange={field.onChange} // update form state
                            >
                              <SelectTrigger className="bg-white/10 border-white/20 text-foreground">
                                <SelectValue placeholder="Select marital status" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="divorced">
                                  Divorced
                                </SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <p className="text-red-500 text-sm">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
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
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...register("username", {
                          required: "Username is required",
                        })}
                        type="text"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Enter your username"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Your email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="house_address">House Address</Label>
                      <Input
                        id="house_address"
                        {...register("house_address", {
                          required: "House address is required",
                        })}
                        type="text"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Your house address"
                      />
                      {errors.house_address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.house_address.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                        type="tel"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="emergency_contact_name">
                        Emergency Contact Name
                      </Label>
                      <Input
                        id="emergency_contact_name"
                        {...register("emergency_contact_name")}
                        type="text"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Your emergency contact name"
                      />
                    </div>
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="emergency_contact_phone">
                        Emergency Contact Number
                      </Label>
                      <Input
                        id="emergency_contact_phone"
                        {...register("emergency_contact_phone")}
                        type="tel"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Your emergency contact phone"
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
                    <div className="space-y-2 w-[290px] md:w-full">
                      <Label htmlFor="firstName">Occupation</Label>
                      <Input
                        id="firstName"
                        {...register("occupation")}
                        type="text"
                        className="bg-white/10 border border-gray-300 text-foreground placeholder:text-gray-400"
                        placeholder="Enter your first name"
                      />
                    </div>

                    {/* <div className="grid md:grid-cols-2 gap-6"> */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="whitespace no-wrap">
                        Baptism Date
                      </Label>

                      <Controller
                        name="date_of_birth"
                        control={control} // from useForm()
                        rules={{ required: "Date of birth is required" }}
                        render={({ field }) => (
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
                                  field.onChange(date); // updates form state
                                  setOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </div>
                    {/* </div> */}
                  </div>
                </div>

                <div className="items-center grid md:grid-cols-1 gap-4">
                  <div className="flex justify-center items-center py-2 rounded-lg w-full">
                    <h2 className="text-lg font-semibold">Account Security</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative w-[290px] md:w-full">
                        <Input
                          type={showPassword ? "text" : "password"}
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
                          className="relative w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-0"
                          placeholder={`Enter your password`}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {/* {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )} */}
                    </div>
                    <div className="relative space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative w-[290px] md:w-full">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === password || "Passwords do not match",
                          })}
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
                      {/* {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword.message}
                        </p>
                      )} */}
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
      <div className="h-full md:grid grid-cols-2 px-16 py-6 pt-24 hidden">
        <div className="flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-md z-20 overflow-hidden">
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

      {/* Mobile Screens */}
      <div className="md:hidden flex items-center justify-center h-full pt-24">
        <RegisterForm />
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
