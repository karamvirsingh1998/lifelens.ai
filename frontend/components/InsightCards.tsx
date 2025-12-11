"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { TrendingUp, Users, Activity, Calendar, Lightbulb, Target } from "lucide-react";

interface InsightCard {
  title: string;
  description: string;
  data: any;
  visualization_type: string;
}

interface PersonalizedAction {
  category: string;
  title: string;
  description: string;
}

interface InsightCardsProps {
  insights: {
    [key: string]: InsightCard;
  };
  personalizedPlan: PersonalizedAction[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#991b1b"];

export default function InsightCards({ insights, personalizedPlan }: InsightCardsProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Your Journey Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Emotional Trajectory */}
        {insights.trajectory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary-400" />
              <h3 className="text-xl font-bold text-white">{insights.trajectory.title}</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">{insights.trajectory.description}</p>

            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={insights.trajectory.data.sparkline}>
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div>
                <p className="text-xs text-white/40">Average</p>
                <p className="text-lg font-bold text-primary-400">
                  {insights.trajectory.data.average}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Peak</p>
                <p className="text-lg font-bold text-green-400">
                  {insights.trajectory.data.peak.score}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Low</p>
                <p className="text-lg font-bold text-red-400">
                  {insights.trajectory.data.low.score}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Card 2: What Shaped Your Journey */}
        {insights.contributors && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-accent-violet" />
              <h3 className="text-xl font-bold text-white">{insights.contributors.title}</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">{insights.contributors.description}</p>

            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={insights.contributors.data.donut}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="count"
                  label={(entry) => `${entry.percentage}%`}
                >
                  {insights.contributors.data.donut.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              {insights.contributors.data.donut.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-white/70">{item.phase}</span>
                  </div>
                  <span className="text-white/90 font-semibold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Card 3: Patterns & Cycles */}
        {insights.patterns && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-accent-coral" />
              <h3 className="text-xl font-bold text-white">{insights.patterns.title}</h3>
            </div>
            <p className="text-white/60 text-sm mb-6">{insights.patterns.description}</p>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Pattern Type</span>
                <span className="text-white font-semibold capitalize">
                  {insights.patterns.data.pattern_type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Volatility</span>
                <span className="text-white font-semibold">
                  {insights.patterns.data.volatility}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Trend</span>
                <span className="text-white font-semibold capitalize">
                  {insights.patterns.data.trend}
                </span>
              </div>
            </div>

            <div className="mt-6 h-24 bg-gradient-to-r from-primary-500/20 via-accent-violet/20 to-accent-coral/20 rounded-lg flex items-center justify-center">
              <span className="text-4xl">
                {insights.patterns.data.pattern_type === "growth" && "📈"}
                {insights.patterns.data.pattern_type === "waves" && "〰️"}
                {insights.patterns.data.pattern_type === "stable" && "➡️"}
                {insights.patterns.data.pattern_type === "decline" && "📉"}
              </span>
            </div>
          </motion.div>
        )}

        {/* Card 4: Seasonal Trends */}
        {insights.seasonal_trends && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">{insights.seasonal_trends.title}</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">{insights.seasonal_trends.description}</p>

            <ResponsiveContainer width="100%" height={120}>
              <AreaChart
                data={insights.seasonal_trends.data.monthly_data.filter(
                  (d: any) => d.average !== null
                )}
              >
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorAvg)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-white/40">Best Month</p>
                <p className="text-sm font-semibold text-green-400">
                  {new Date(2000, insights.seasonal_trends.data.best_month - 1).toLocaleString(
                    "default",
                    { month: "long" }
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Challenging Month</p>
                <p className="text-sm font-semibold text-red-400">
                  {new Date(2000, insights.seasonal_trends.data.worst_month - 1).toLocaleString(
                    "default",
                    { month: "long" }
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Card 5: Future Predictions */}
        {insights.future_predictions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">{insights.future_predictions.title}</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">{insights.future_predictions.description}</p>

            <div className="space-y-3 max-h-48 overflow-y-auto">
              {insights.future_predictions.data.comparison.map((item: any, index: number) => (
                <div key={index} className="bg-white/5 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white">{item.year}</span>
                    <span className="text-xs text-white/40">Δ {item.difference}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-blue-400">Math: {item.statistical.score}</p>
                    </div>
                    <div>
                      <p className="text-purple-400">AI: {item.intuitive.score}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Card 6: Personalized Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 md:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-primary-400" />
            <h3 className="text-xl font-bold text-white">Your Action Plan</h3>
          </div>
          <p className="text-white/60 text-sm mb-4">Personalized recommendations for growth</p>

          <div className="space-y-3">
            {personalizedPlan.map((action, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  action.category === "high"
                    ? "bg-green-500/10 border-green-500"
                    : action.category === "medium"
                    ? "bg-blue-500/10 border-blue-500"
                    : "bg-purple-500/10 border-purple-500"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold uppercase ${
                      action.category === "high"
                        ? "text-green-400"
                        : action.category === "medium"
                        ? "text-blue-400"
                        : "text-purple-400"
                    }`}
                  >
                    {action.category} Impact
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-1">{action.title}</h4>
                <p className="text-sm text-white/70">{action.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

