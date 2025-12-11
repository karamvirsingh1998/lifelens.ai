"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-16 h-16 text-primary-400" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary-400 via-accent-violet to-accent-coral bg-clip-text text-transparent">
            LifeLens.ai
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto"
        >
          Analyze your emotional journey. Predict your future with AI.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass-card">
            <TrendingUp className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Track Your Journey</h3>
            <p className="text-white/60 text-sm">Capture life events with emotional scores</p>
          </div>
          
          <div className="glass-card">
            <Brain className="w-8 h-8 text-accent-violet mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">AI Predictions</h3>
            <p className="text-white/60 text-sm">Compare statistical vs intuitive forecasts</p>
          </div>
          
          <div className="glass-card">
            <Sparkles className="w-8 h-8 text-accent-coral mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Get Insights</h3>
            <p className="text-white/60 text-sm">Personalized patterns and recommendations</p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <button
            onClick={() => router.push("/onboarding")}
            className="btn-primary text-lg px-12 py-4 group"
          >
            Begin Your Journey
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 text-white/40 text-sm"
        >
          Your data is private and secure. We never share your personal information.
        </motion.p>
      </div>
    </div>
  );
}

