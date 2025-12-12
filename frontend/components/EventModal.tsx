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

const phases = ["Very Low", "Low", "Neutral", "Good", "Very Good"];
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

const phaseToScore: Record<string, number> = {
  "Very Low": -8,
  "Low": -4,
  "Neutral": 0,
  "Good": 6,
  "Very Good": 9,
};

export default function EventModal({ isOpen, onClose, onSave, event }: EventModalProps) {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState("Neutral");
  const [score, setScore] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setYear(event.year.toString());
      setMonth(event.month?.toString() || "");
      setScore(event.score);
      setSelectedPhase(event.phase);
      setDescription(event.description);
    } else {
      setYear("");
      setMonth("");
      setScore(0);
      setSelectedPhase("Neutral");
      setDescription("");
    }
    setError("");
  }, [event, isOpen]);

  const handlePhaseSelect = (phase: string) => {
    setSelectedPhase(phase);
    setScore(phaseToScore[phase]);
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    const phase = getPhaseFromScore(newScore);
    setSelectedPhase(phase);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!year) {
      setError("Please select a year");
      return;
    }

    if (!description.trim()) {
      setError("Please describe what happened");
      return;
    }

    const phase = getPhaseFromScore(score);

    onSave({
      year: parseInt(year),
      month: month ? parseInt(month) : undefined,
      phase: phase as any,
      score,
      description: description.trim(),
    });

    // Reset form
    setYear("");
    setMonth("");
    setScore(0);
    setSelectedPhase("Neutral");
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-dark-bg w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-dark-bg/95 backdrop-blur-lg border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {event ? "Edit" : "Add"} Life Event
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Year & Month */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Year <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      Month (optional)
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
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

                {/* Phase Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    How was this phase? <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {phases.map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        onClick={() => handlePhaseSelect(phase)}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all ${
                          selectedPhase === phase
                            ? "bg-white text-dark-bg border-2 border-white"
                            : "bg-transparent text-gray-400 border-2 border-white/20 hover:border-white/40"
                        }`}
                      >
                        {phase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score Slider */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-400">
                      Rating
                    </label>
                    <span className="text-xl font-bold text-white">
                      {score} : {selectedPhase}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={score}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="w-full h-2 bg-dark-lighter rounded-full appearance-none cursor-pointer accent-purple-500"
                    style={{
                      background: `linear-gradient(to right, #ef4444 0%, #f97316 25%, #6b7280 50%, #3b82f6 75%, #10b981 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>-10</span>
                    <span>0</span>
                    <span>+10</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    What happened? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field resize-none min-h-[120px]"
                    placeholder="Describe this phase of your life..."
                    required
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {event ? "Update" : "Add"} Event
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
