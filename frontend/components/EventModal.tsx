"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LifeEvent } from "@/lib/api";
import { getPhaseFromScore } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: LifeEvent) => void;
  event?: LifeEvent;
}

const phases = ["Very Low", "Low", "Moderate", "High", "Very High"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function EventModal({ isOpen, onClose, onSave, event }: EventModalProps) {
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState<number | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setYear(event.year);
      setMonth(event.month);
      setScore(event.score);
      setDescription(event.description);
    } else {
      // Reset for new event
      setYear(currentYear);
      setMonth(undefined);
      setScore(0);
      setDescription("");
    }
    setError("");
  }, [event, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }

    const phase = getPhaseFromScore(score);

    onSave({
      year,
      month: month || undefined,
      phase: phase as any,
      score,
      description: description.trim(),
    });

    // Reset form
    setYear(currentYear);
    setMonth(undefined);
    setScore(0);
    setDescription("");
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {event ? "Edit Event" : "Add Life Event"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Year & Month */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Year <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="input-field"
                      required
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Month (Optional)
                    </label>
                    <select
                      value={month || ""}
                      onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : undefined)}
                      className="input-field"
                    >
                      <option value="">Select month</option>
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Score Slider */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Emotional Score: {score} ({getPhaseFromScore(score)})
                  </label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>-10 (Very Low)</span>
                    <span>10 (Very High)</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field resize-none"
                    rows={4}
                    placeholder="Describe what happened and how you felt..."
                    required
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {event ? "Update Event" : "Add Event"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

