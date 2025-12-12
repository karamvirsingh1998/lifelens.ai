"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Calendar } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useUserStore } from "@/lib/store";

export default function Onboarding() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !dob) {
      setError("Please fill in all fields");
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-violet/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div 
          className="glass-card p-8 md:p-10"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500/20 to-accent-violet/20 rounded-full flex items-center justify-center"
            >
              <User className="w-10 h-10 text-primary-400" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary-400 via-accent-violet to-accent-coral bg-clip-text text-transparent"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to LifeLens
            </motion.h1>
            <motion.p 
              className="text-white/70 text-lg"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Let's start by getting to know you
            </motion.p>
            <motion.div
              className="mt-4 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Name Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="name" className="block text-sm font-semibold text-white/90 mb-3">
                Your Name <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary-400 transition-colors" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all duration-300"
                  placeholder="e.g., Sarah Johnson"
                  required
                />
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-primary-400/0 group-focus-within:border-primary-400/50 transition-all pointer-events-none"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Date of Birth Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="dob" className="block text-sm font-semibold text-white/90 mb-3">
                Date of Birth <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary-400 transition-colors" />
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all duration-300"
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-primary-400/0 group-focus-within:border-primary-400/50 transition-all pointer-events-none"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 text-red-300 text-sm flex items-start gap-3"
              >
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-violet to-primary-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-violet to-primary-600 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              {loading ? (
                <span className="relative flex items-center justify-center py-4 text-white font-bold text-lg">
                  <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating your profile...
                </span>
              ) : (
                <span className="relative flex items-center justify-center py-4 text-white font-bold text-lg gap-2">
                  Continue
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              )}
            </motion.button>
          </form>

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
              <span className="text-lg">🔒</span>
              <span>Your information is encrypted and private</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

