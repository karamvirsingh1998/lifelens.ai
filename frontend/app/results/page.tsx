"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Share2, Download, Sparkles } from "lucide-react";
import { useAnalysisStore, useUserStore } from "@/lib/store";
import TimelineGraph from "@/components/TimelineGraph";
import InsightCards from "@/components/InsightCards";

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
    return <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Analysis Complete Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-sm font-medium">Analysis Complete</span>
        </div>

        {/* Hero Section with Gradient Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">
              {analysis.hero_heading}
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8">
            {analysis.summary}
          </p>

          {/* Share & Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button className="btn-secondary flex items-center justify-center gap-2 text-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Timeline Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
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
          transition={{ delay: 0.4 }}
        >
          <InsightCards
            insights={analysis.insights}
            personalizedPlan={analysis.personalized_plan}
          />
        </motion.div>

        {/* Update Journey Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 max-w-md mx-auto"
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
