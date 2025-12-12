"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-dark-bg">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center space-y-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
            className="icon-bg mx-auto w-20 h-20 sm:w-24 sm:h-24"
          >
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
          </motion.div>

          {/* Logo Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="text-purple-400">Life</span>
              <span className="text-orange-400">Lens</span>
              <span className="text-white"> AI</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-sm mx-auto">
              Analyze your emotional journey. Predict your future with AI.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4 px-4"
          >
            {[
              "Track life events with emotional scores",
              "Dual AI predictions: Math vs Intuition",
              "Deep insights and personalized recommendations"
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm sm:text-base">{text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="pt-4"
          >
            <button
              onClick={() => router.push("/onboarding")}
              className="btn-primary text-base sm:text-lg font-semibold"
            >
              Begin Your Journey
            </button>
          </motion.div>

          {/* Privacy Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-gray-500 text-xs sm:text-sm"
          >
            🔒 Your data is secure and private
          </motion.p>
        </div>
      </div>
    </div>
  );
}
