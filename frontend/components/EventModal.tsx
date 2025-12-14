"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { LifeEvent } from "@/lib/api";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: LifeEvent) => void;
  event?: LifeEvent;
}

const phases = [
  { label: "Very Low", value: "Very Low", score: -8 },
  { label: "Low", value: "Low", score: -4 },
  { label: "Neutral", value: "Moderate", score: 0 },
  { label: "Good", value: "High", score: 6 },
  { label: "Very Good", value: "Very High", score: 9 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getPhaseFromScore(score: number): string {
  if (score >= 8) return "Very High";
  if (score >= 4) return "High";
  if (score >= 0) return "Moderate";
  if (score >= -4) return "Low";
  return "Very Low";
}

function getPhaseLabel(phase: string): string {
  const map: Record<string, string> = {
    "Very High": "Very Good",
    "High": "Good",
    "Moderate": "Neutral",
    "Low": "Low",
    "Very Low": "Very Low",
  };
  return map[phase] || phase;
}

export default function EventModal({ isOpen, onClose, onSave, event }: EventModalProps) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("Moderate");
  const [score, setScore] = useState(0);
  const [description, setDescription] = useState("");

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
      setSelectedPhase("Moderate");
      setDescription("");
    }
  }, [event, isOpen]);

  const handlePhaseSelect = (phase: string, defaultScore: number) => {
    setSelectedPhase(phase);
    setScore(defaultScore);
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    const phase = getPhaseFromScore(newScore);
    setSelectedPhase(phase);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      year: parseInt(year),
      month: month ? parseInt(month) : undefined,
      phase: selectedPhase as any,
      score,
      description: description.trim(),
    });

    // Reset
    setYear("");
    setMonth("");
    setScore(0);
    setSelectedPhase("Moderate");
    setDescription("");
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
            className="fixed inset-0 bg-black/70 z-50"
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
              {/* Header */}
              <div className="sticky top-0 bg-dark-bg border-b border-white/10 p-6 flex items-center justify-between z-10">
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

              {/* Form */}
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
                        <option key={y} value={y}>{y}</option>
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
                      {months.map((m, i) => (
                        <option key={i} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phase Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    How was this phase? <span className="text-red-400">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {phases.map((phase) => {
                      const phaseLabel = getPhaseLabel(phase.value);
                      const currentPhaseLabel = getPhaseLabel(selectedPhase);
                      return (
                        <button
                          key={phase.value}
                          type="button"
                          onClick={() => handlePhaseSelect(phase.value, phase.score)}
                          className={`phase-btn ${phaseLabel === currentPhaseLabel ? "active" : ""}`}
                        >
                          {phase.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Score Slider */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-400">
                      Rating
                    </label>
                    <span className="text-lg font-bold text-white">
                      {score} : {getPhaseLabel(selectedPhase)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={score}
                    onChange={(e) => handleScoreChange(Number(e.target.value))}
                    className="w-full"
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
                    className="input-field"
                    placeholder="Describe this phase of your life..."
                    required
                    rows={4}
                  />
                </div>

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
