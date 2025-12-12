"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function Onboarding() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  
  const [step, setStep] = useState(1); // 1 = DOB, 2 = Name
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) {
      setError("Please enter your date of birth");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.onboarding({ name, dob });
      setUser(response.user_id, name, dob);
      router.push("/events");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-bg">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="icon-bg mx-auto mb-8 w-24 h-24"
              >
                <Calendar className="w-12 h-12 text-purple-400" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-3"
              >
                <span className="text-purple-400">Life</span>
                <span className="text-orange-400">Lens</span>
                <span className="text-white"> AI</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-lg mb-12"
              >
                Let's start with when your journey began
              </motion.p>

              {/* Form */}
              <form onSubmit={handleDobSubmit} className="space-y-6">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="input-field text-center text-lg"
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button type="submit" className="btn-primary text-lg">
                  Continue
                </button>
              </form>

              <p className="mt-8 text-gray-500 text-sm">
                Your data is secure and private
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <div className="text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="icon-bg mx-auto mb-8 w-24 h-24"
                >
                  <User className="w-12 h-12 text-purple-400" />
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                  What should we call you?
                </h1>

                <p className="text-gray-400 mb-12">
                  This will personalize your experience
                </p>

                {/* Form */}
                <form onSubmit={handleNameSubmit} className="space-y-6">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field text-lg"
                      placeholder="Enter your name"
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating your profile...
                      </>
                    ) : (
                      "Start Your Journey"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
