"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Send } from "lucide-react";
import { useUserStore, useEventsStore } from "@/lib/store";
import { apiClient, LifeEvent } from "@/lib/api";
import EventModal from "@/components/EventModal";

export default function Events() {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);
  const userName = useUserStore((state) => state.userName);
  
  const events = useEventsStore((state) => state.events);
  const setEvents = useEventsStore((state) => state.setEvents);
  const addEvent = useEventsStore((state) => state.addEvent);
  const removeEvent = useEventsStore((state) => state.removeEvent);
  const updateEvent = useEventsStore((state) => state.updateEvent);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push("/onboarding");
    }
  }, [userId, router]);

  const handleAddEvent = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: LifeEvent) => {
    if (editingIndex !== null) {
      updateEvent(editingIndex, event);
    } else {
      addEvent(event);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (index: number) => {
    removeEvent(index);
  };

  const handleSubmit = async () => {
    if (events.length === 0) {
      setError("Please add at least one life event");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.saveEvents(userId!, events);
      router.push("/analyzing");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return (a.month || 0) - (b.month || 0);
  });

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-violet bg-clip-text text-transparent">
            Your Life Journey
          </h1>
          <p className="text-white/60 text-lg">
            Add the significant events that shaped your emotional landscape, {userName}
          </p>
        </motion.div>

        {/* Events List */}
        <div className="mb-8 space-y-4">
          <AnimatePresence>
            {sortedEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 flex items-start justify-between hover:bg-white/10"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary-400">
                      {event.year}
                    </span>
                    {event.month && (
                      <span className="text-white/60">
                        {new Date(2000, event.month - 1).toLocaleString("default", { month: "short" })}
                      </span>
                    )}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: getPhaseColor(event.phase) + "20",
                        color: getPhaseColor(event.phase),
                      }}
                    >
                      {event.phase}
                    </span>
                    <span className="text-white/40 text-sm">Score: {event.score}</span>
                  </div>
                  <p className="text-white/80">{event.description}</p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditEvent(index)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-white/60" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(index)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Event Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleAddEvent}
          className="btn-secondary w-full mb-8 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Life Event
        </motion.button>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-center mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSubmit}
          disabled={loading || events.length === 0}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          {loading ? "Saving..." : "Analyze My Journey"}
        </motion.button>

        <p className="text-center text-white/40 text-sm mt-4">
          {events.length} {events.length === 1 ? "event" : "events"} added
        </p>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        event={editingIndex !== null ? events[editingIndex] : undefined}
      />
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

