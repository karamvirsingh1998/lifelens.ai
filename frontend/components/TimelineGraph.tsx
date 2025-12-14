"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

  // Prepare chart data
  const historicalData = timeline.map((event) => ({
    year: event.year,
    historical: event.score,
    event: event,
  }));

  const allYears = [
    ...new Set([
      ...timeline.map((e) => e.year),
      ...statisticalForecast.map((f) => f.year),
      ...llmForecast.map((f) => f.year),
    ]),
  ].sort((a, b) => a - b);

  const chartData = allYears.map((year) => {
    const hist = historicalData.find((d) => d.year === year);
    const stat = statisticalForecast.find((f) => f.year === year);
    const llm = llmForecast.find((f) => f.year === year);

    return {
      year,
      historical: hist?.historical,
      statistical: stat?.score,
      llm: llm?.score,
      event: hist?.event,
      reasoning: llm?.reasoning,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="card p-4 max-w-xs">
        <p className="font-bold text-white mb-2">Year {data.year}</p>
        {data.historical !== undefined && (
          <p className="text-sm text-green-400 mb-1">Historical: {data.historical.toFixed(1)}</p>
        )}
        {data.statistical !== undefined && (
          <p className="text-sm text-blue-400 mb-1">Statistical: {data.statistical.toFixed(1)}</p>
        )}
        {data.llm !== undefined && (
          <div>
            <p className="text-sm text-purple-400 mb-1">LLM: {data.llm.toFixed(1)}</p>
            {data.reasoning && (
              <p className="text-xs text-gray-400 mt-2">{data.reasoning}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold text-white mb-2">Your Emotional Timeline</h2>
      <p className="text-gray-400 text-sm mb-6">Click on any point to see details</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-400" />
          <span className="text-gray-400">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-400 border-t-2 border-dashed" />
          <span className="text-gray-400">Statistical Prediction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-purple-400 border-t-2 border-dashed" />
          <span className="text-gray-400">LLM Intuition</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: "12px" }}
            tickLine={false}
          />
          <YAxis
            domain={[-10, 10]}
            stroke="rgba(255,255,255,0.3)"
            style={{ fontSize: "12px" }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Historical Line */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#10b981"
            strokeWidth={3}
            dot={{
              fill: "#10b981",
              r: 6,
              cursor: "pointer",
              onClick: (data: any) => {
                if (data.payload.event) {
                  setSelectedEvent(data.payload.event);
                }
              },
            }}
            activeDot={{ r: 8 }}
            connectNulls={false}
          />

          {/* Statistical Forecast */}
          <Line
            type="monotone"
            dataKey="statistical"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={{ fill: "#3b82f6", r: 5 }}
            connectNulls={false}
          />

          {/* LLM Forecast */}
          <Line
            type="monotone"
            dataKey="llm"
            stroke="#a78bfa"
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={{ fill: "#a78bfa", r: 5 }}
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
              className="fixed inset-0 bg-black/70 z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card p-6 max-w-md w-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-400">{selectedEvent.year}</h3>
                    {selectedEvent.month && (
                      <p className="text-gray-400">
                        {new Date(2000, selectedEvent.month - 1).toLocaleString("default", { month: "long" })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`phase-badge ${
                      selectedEvent.phase === "Very High" ? "very-high" :
                      selectedEvent.phase === "High" ? "high" :
                      selectedEvent.phase === "Moderate" ? "moderate" :
                      selectedEvent.phase === "Low" ? "low" : "very-low"
                    }`}>
                      {selectedEvent.phase}
                    </span>
                    <span className="text-gray-400">Score: {selectedEvent.score}</span>
                  </div>

                  {selectedEvent.rephrased && (
                    <div className="bg-white/5 rounded-2xl p-4">
                      <p className="text-white italic text-sm">{selectedEvent.rephrased}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500 mb-2">Original:</p>
                    <p className="text-gray-300 text-sm">{selectedEvent.event}</p>
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
