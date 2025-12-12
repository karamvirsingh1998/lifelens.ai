"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Sparkles, Zap, Heart, LineChart } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Enhanced Background effects with floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent-coral/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <Brain className="w-20 h-20 md:w-24 md:h-24 text-primary-400 drop-shadow-2xl" />
              <motion.div
                className="absolute inset-0 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Brain className="w-20 h-20 md:w-24 md:h-24 text-primary-400" />
              </motion.div>
            </div>
          </motion.div>
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary-400 via-accent-violet to-accent-coral bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            LifeLens.ai
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent mx-auto max-w-md"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
            Analyze your emotional journey.
          </p>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
            Predict your future with <span className="text-primary-400 font-semibold">AI-powered insights</span>
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 max-w-5xl mx-auto"
        >
          {[
            { 
              icon: Heart, 
              title: "Track Your Journey", 
              desc: "Capture life events with emotional scores and detailed context",
              color: "text-red-400",
              gradient: "from-red-500/20 to-pink-500/20"
            },
            { 
              icon: Zap, 
              title: "Dual AI Predictions", 
              desc: "Compare statistical math with intuitive AI forecasts",
              color: "text-yellow-400",
              gradient: "from-yellow-500/20 to-orange-500/20"
            },
            { 
              icon: LineChart, 
              title: "Deep Insights", 
              desc: "Discover patterns, trends, and personalized recommendations",
              color: "text-green-400",
              gradient: "from-green-500/20 to-emerald-500/20"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="glass-card group cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {feature.desc}
              </p>
              <motion.div
                className="mt-4 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <motion.button
            onClick={() => router.push("/onboarding")}
            className="relative group overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-violet to-accent-coral opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-violet to-accent-coral blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="relative flex items-center gap-3 px-12 py-5 text-xl font-bold text-white">
              <Sparkles className="w-6 h-6" />
              Begin Your Journey
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-8"
        >
          {[
            { icon: "🔒", text: "Private & Secure" },
            { icon: "🤖", text: "AI-Powered" },
            { icon: "📊", text: "Data-Driven" },
          ].map((badge, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-2 text-white/60 text-sm"
            >
              <span className="text-2xl">{badge.icon}</span>
              <span>{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-white/40 text-sm max-w-md mx-auto leading-relaxed"
        >
          Your data is encrypted and private. We never share your personal information. 
          <span className="block mt-2 text-primary-400/60">Join thousands analyzing their emotional journey</span>
        </motion.p>
      </div>
    </div>
  );
}

