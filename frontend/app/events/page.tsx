"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, Sparkles } from "lucide-react";
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
    if (a.year !== b.year) return b.year - a.year;
    return (b.month || 0) - (a.month || 0);
  });

  return (
    <div className="min-h-screen bg-dark-bg p-4 sm:p-6 md:p-8 pb-24">
      {/* Container for mobile/tablet/desktop */}
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/onboarding")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Hey <span className="text-orange-400">{userName}</span>, tell us your story
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Add the ups and downs of your life journey. The more detail, the better your insights.
          </p>
        </div>

        {/* Events List or Empty State */}
        {sortedEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-16 sm:py-20 mb-6"
          >
            <div className="icon-bg mx-auto mb-6 w-16 h-16 sm:w-20 sm:h-20">
              <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
              No events yet
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-sm mx-auto">
              Start adding significant moments from your life
            </p>
            <button
              onClick={handleAddEvent}
              className="btn-primary max-w-xs mx-auto text-sm sm:text-base"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Your First Event
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4 mb-6">
            <AnimatePresence>
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="event-card group cursor-pointer"
                  onClick={() => handleEditEvent(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-lg sm:text-xl font-bold text-white">
                          {event.year}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          event.phase === "Very High" ? "bg-green-500/20 text-green-400" :
                          event.phase === "High" ? "bg-blue-500/20 text-blue-400" :
                          event.phase === "Moderate" ? "bg-gray-500/20 text-gray-400" :
                          event.phase === "Low" ? "bg-orange-500/20 text-orange-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {event.phase}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">
                          {event.score > 0 ? "+" : ""}{event.score}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(index);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-lg border-t border-white/10 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={handleAddEvent}
              className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || events.length === 0}
              className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze My Journey
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm z-50"
          >
            {error}
          </motion.div>
        )}
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
