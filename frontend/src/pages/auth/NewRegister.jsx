import React, { useState, useCallback } from "react";
import video from "../../video/5949377-hd_1920_1080_24fps.mp4";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import api from "../api";

const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    industry: "",
    companySize: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
    features: [],
    agreeToTerms: false,
  });

  const features = [
    { id: "ai-agents", label: "AI Automation Agents", icon: Sparkles },
    { id: "web-systems", label: "Web Systems", icon: Zap },
    { id: "data-analytics", label: "Data Analytics", icon: Users },
    { id: "security", label: "Security Solutions", icon: Shield },
    { id: "team-collaboration", label: "Team Collaboration", icon: Users },
  ];

  const handleFeatureToggle = useCallback((featureId) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((id) => id !== featureId)
        : [...prev.features, featureId],
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/get-started", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data && response.data.submission_id) {
        setSubmissionId(response.data.submission_id);
        setShowSavePrompt(true);
      }
      setCurrentStep(4);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep
                    ? "bg-cyan-500 text-white"
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
                    step < currentStep ? "bg-purple-600" : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-400">
          Step {currentStep} of 4
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {currentStep === 1 && "Tell us about your company"}
              {currentStep === 2 && "What are your goals?"}
              {currentStep === 3 && "Let's discuss your project"}
              {currentStep === 4 && "You're All Set!"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {currentStep === 1 && "Help us understand your business better"}
              {currentStep === 2 &&
                "Choose the features that matter most to you"}
              {currentStep === 3 && "Share details about your specific needs"}
              {currentStep === 4 && "Thank you for choosing Eventus 🚀"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="your.email@company.com"
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
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          handleInputChange("industry", value)
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) =>
                          handleInputChange("companySize", value)
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">
                            51-200 employees
                          </SelectItem>
                          <SelectItem value="201-1000">
                            201-1000 employees
                          </SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Features Selection */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      Select the features you're interested in:
                    </Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {features.map((feature) => (
                        <FeatureCard
                          key={feature.id}
                          feature={feature}
                          selected={formData.features.includes(feature.id)}
                          onToggle={handleFeatureToggle}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Project Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                      placeholder="Tell us about your project goals, challenges, and what you hope to achieve..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked)
                      }
                      className="border-white/20"
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-300"
                    >
                      I agree to the terms and conditions and consent to being
                      contacted about this project.
                    </Label>
                  </div>
                </motion.div>
              )}
              {/* Success Step */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                    <CheckCircle className="text-green-400 w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Success!
                  </h2>
                  <p className="text-lg text-gray-300 max-w-md text-center">
                    We'll be in touch shortly. Your journey with{" "}
                    <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Eventus
                    </span>{" "}
                    starts now 🚀
                  </p>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between items-center pt-8 border-t border-white/20">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="text-white hover:bg-white/10"
                    >
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}
                  {currentStep === 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Submit Application
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-cyan-500 hover:bg-cyan-700 text-white cursor-pointer"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const NewRegister = () => {
  return (
    <div>
      <div className="h-screen grid grid-cols-2 px-16 py-6 pt-18">
        <div className="flex items-center justify-center bg-white dark:bg-slate-900 px-20 py-15 rounded-xl mt-6 shadow-md z-20"></div>
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
    </div>
  );
};

export default NewRegister;
