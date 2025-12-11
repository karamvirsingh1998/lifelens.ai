"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUserStore, useAnalysisStore } from "@/lib/store";
import { apiClient } from "@/lib/api";

const loadingTexts = [
  "Analyzing your life journey...",
  "Mapping emotional patterns...",
  "Consulting with AI intuition...",
  "Calculating statistical predictions...",
  "Preparing your LifeLens...",
];

export default function Analyzing() {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);
  const setAnalysis = useAnalysisStore((state) => state.setAnalysis);
  
  const [textIndex, setTextIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push("/onboarding");
      return;
    }

    // Animate text changes
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500);

    // Perform analysis
    const analyze = async () => {
      try {
        const result = await apiClient.analyze(userId);
        setAnalysis(result);
        
        // Wait a bit to show the animation
        setTimeout(() => {
          router.push("/results");
        }, 1000);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Analysis failed. Please try again.");
      }
    };

    analyze();

    return () => clearInterval(textInterval);
  }, [userId, router, setAnalysis]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="glass-card p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Analysis Failed</h2>
            <p className="text-white/60 mb-6">{error}</p>
            <button
              onClick={() => router.push("/events")}
              className="btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 text-center">
        {/* Glowing line animation */}
        <motion.div
          className="mb-12 mx-auto"
          style={{ width: "300px", height: "4px" }}
        >
          <svg width="300" height="4" viewBox="0 0 300 4">
            <motion.line
              x1="0"
              y1="2"
              x2="300"
              y2="2"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#ff6b6b" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Animated dots */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <motion.div
          key={textIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-medium text-white/90"
        >
          {loadingTexts[textIndex]}
        </motion.div>
      </div>
    </div>
  );
}

