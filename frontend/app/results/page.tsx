"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAnalysisStore, useUserStore } from "@/lib/store";
import TimelineGraph from "@/components/TimelineGraph";
import InsightCards from "@/components/InsightCards";
import { Download, Share2 } from "lucide-react";

export default function Results() {
  const router = useRouter();
  const analysis = useAnalysisStore((state) => state.analysis);
  const userName = useUserStore((state) => state.userName);

  useEffect(() => {
    if (!analysis) {
      router.push("/events");
    }
  }, [analysis, router]);

  if (!analysis) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-400 via-accent-violet to-accent-coral bg-clip-text text-transparent">
            {analysis.hero_heading}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {analysis.summary}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <button className="btn-secondary flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Timeline Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <TimelineGraph
            timeline={analysis.timeline}
            statisticalForecast={analysis.statistical_forecast}
            llmForecast={analysis.llm_forecast}
          />
        </motion.div>

        {/* Insight Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <InsightCards
            insights={analysis.insights}
            personalizedPlan={analysis.personalized_plan}
          />
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => router.push("/events")}
            className="btn-primary"
          >
            Update My Journey
          </button>
        </motion.div>
      </div>
    </div>
  );
}

