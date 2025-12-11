"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TimelineEvent {
  year: number;
  month?: number;
  score: number;
  phase: string;
  event: string;
  rephrased?: string;
}

interface ForecastPoint {
  year: number;
  score: number;
  phase: string;
  reasoning?: string;
}

interface TimelineGraphProps {
  timeline: TimelineEvent[];
  statisticalForecast: ForecastPoint[];
  llmForecast: ForecastPoint[];
}

export default function TimelineGraph({
  timeline,
  statisticalForecast,
  llmForecast,
}: TimelineGraphProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Combine all data points
  const historicalData = timeline.map((event) => ({
    year: event.year,
    historical: event.score,
    event: event,
  }));

  const statData = statisticalForecast.map((point) => ({
    year: point.year,
    statistical: point.score,
  }));

  const llmData = llmForecast.map((point) => ({
    year: point.year,
    llm: point.score,
    reasoning: point.reasoning,
  }));

  // Merge all data
  const allYears = [
    ...new Set([
      ...historicalData.map((d) => d.year),
      ...statData.map((d) => d.year),
      ...llmData.map((d) => d.year),
    ]),
  ].sort((a, b) => a - b);

  const chartData = allYears.map((year) => {
    const hist = historicalData.find((d) => d.year === year);
    const stat = statData.find((d) => d.year === year);
    const llm = llmData.find((d) => d.year === year);

    return {
      year,
      historical: hist?.historical,
      statistical: stat?.statistical,
      llm: llm?.llm,
      event: hist?.event,
      reasoning: llm?.reasoning,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className="glass-card p-4 max-w-xs">
        <p className="font-bold text-white mb-2">Year {data.year}</p>
        {data.historical !== undefined && (
          <div className="mb-2">
            <p className="text-sm text-green-400">Historical: {data.historical.toFixed(1)}</p>
          </div>
        )}
        {data.statistical !== undefined && (
          <div className="mb-2">
            <p className="text-sm text-blue-400">Statistical: {data.statistical.toFixed(1)}</p>
          </div>
        )}
        {data.llm !== undefined && (
          <div className="mb-2">
            <p className="text-sm text-purple-400">LLM Intuition: {data.llm.toFixed(1)}</p>
            {data.reasoning && (
              <p className="text-xs text-white/60 mt-1">{data.reasoning}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Your Emotional Timeline</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-400" />
            <span className="text-white/70">Historical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-400 border-t-2 border-dashed" />
            <span className="text-white/70">Statistical Prediction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-purple-400 border-t-2 border-dashed" />
            <span className="text-white/70">LLM Intuition</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            domain={[-10, 10]}
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: "12px" }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Historical Line (Solid) */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#10b981"
            strokeWidth={3}
            dot={{
              fill: "#10b981",
              r: 6,
              cursor: "pointer",
              onClick: (_, index) => {
                const event = chartData[index].event;
                if (event) setSelectedEvent(event);
              },
            }}
            connectNulls={false}
          />

          {/* Statistical Forecast (Dotted Blue) */}
          <Line
            type="monotone"
            dataKey="statistical"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#3b82f6", r: 4 }}
            connectNulls={false}
          />

          {/* LLM Forecast (Dotted Purple) */}
          <Line
            type="monotone"
            dataKey="llm"
            stroke="#a78bfa"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#a78bfa", r: 4 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 max-w-md w-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary-400">
                      {selectedEvent.year}
                    </h3>
                    {selectedEvent.month && (
                      <p className="text-white/60">
                        {new Date(2000, selectedEvent.month - 1).toLocaleString("default", {
                          month: "long",
                        })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: getPhaseColor(selectedEvent.phase) + "20",
                        color: getPhaseColor(selectedEvent.phase),
                      }}
                    >
                      {selectedEvent.phase}
                    </span>
                    <span className="text-white/60">Score: {selectedEvent.score}</span>
                  </div>

                  {selectedEvent.rephrased && (
                    <div className="bg-white/5 rounded-lg p-4 mb-3">
                      <p className="text-white/90 italic">{selectedEvent.rephrased}</p>
                    </div>
                  )}

                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/60 mb-1">Original:</p>
                    <p className="text-white/80">{selectedEvent.event}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function getPhaseColor(phase: string): string {
  const colors: Record<string, string> = {
    "Very High": "#10b981",
    "High": "#3b82f6",
    "Moderate": "#f59e0b",
    "Low": "#ef4444",
    "Very Low": "#991b1b",
  };
  return colors[phase] || colors["Moderate"];
}

