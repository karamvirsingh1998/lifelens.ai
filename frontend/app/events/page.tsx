"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { storeLifeEvents } from "../../lib/api";

type LifeEvent = {
  id: string;
  year: string;
  month?: string;
  phase: string;
  rating: number;
  description: string;
};

export default function EventsPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load from localStorage only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem("userName") || "User");
      setUserId(localStorage.getItem("userId") || "");
    }
  }, []);
  
  // Form state
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [phase, setPhase] = useState("Moderate");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  const phases = ["Very Low", "Low", "Moderate", "High", "Very High"];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleAddEvent = () => {
    if (!year || !description) return;
    
    const newEvent: LifeEvent = {
      id: Date.now().toString(),
      year,
      month,
      phase,
      rating,
      description
    };
    
    setEvents([...events, newEvent]);
    
    // Reset form
    setYear("");
    setMonth("");
    setPhase("Moderate");
    setRating(0);
    setDescription("");
    setShowModal(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating < -5) return "#ef4444"; // red
    if (rating < 0) return "#f97316"; // orange
    if (rating === 0) return "#6b7280"; // gray
    if (rating <= 5) return "#3b82f6"; // blue
    return "#10b981"; // green
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(to bottom right, #2d2347, #1e1a2e, #1a1625)',
        padding: '40px 20px'
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push("/onboarding")}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '40px',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
      >
        <ArrowLeft style={{ width: '20px', height: '20px' }} />
        Back
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>
          Hey <span style={{ color: '#a78bfa' }}>{userName}</span>, tell us your story
        </h1>
        <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '40px' }}>
          Add the ups and downs of your life journey. The more detail, the better your insights.
        </p>

        {/* Events Display */}
        {events.length === 0 ? (
          // Empty State
          <div
            style={{
              background: 'rgba(30, 26, 46, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '80px 40px',
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                background: '#2d2640',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}
            >
              <Plus style={{ width: '40px', height: '40px', color: '#6b7280' }} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              No events yet
            </h2>
            <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '32px' }}>
              Start adding significant moments from your life
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                padding: '14px 32px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus style={{ width: '20px', height: '20px' }} />
              Add Your First Event
            </button>
          </div>
        ) : (
          // Events List
          <>
            <div style={{ marginBottom: '24px' }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: 'rgba(30, 26, 46, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getRatingColor(event.rating),
                      marginTop: '6px',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '16px' }}>
                        {event.month ? `${event.month.slice(0, 3)} ${event.year}` : event.year}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '16px' }}>{event.phase}</span>
                      <span style={{ color: '#9ca3af', fontSize: '16px' }}>{event.rating}</span>
                    </div>
                    <p style={{ color: '#d1d5db', fontSize: '15px' }}>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: '#2d2640',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                  justifyContent: 'center',
                  minWidth: '200px'
                }}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                Add Event
              </button>
              <button
                  onClick={async () => {
                  setIsAnalyzing(true);
                  try {
                    // Convert events to API format
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const apiEvents = events.map(e => ({
                      year: parseInt(e.year),
                      month: e.month ? monthNames.indexOf(e.month) + 1 : undefined,
                      phase: e.phase,
                      score: e.rating,
                      description: e.description
                    }));
                    
                    // Store events in backend
                    await storeLifeEvents(userId, apiEvents);
                    
                    // Navigate to analyzing page
                    router.push("/analyzing");
                  } catch (error) {
                    console.error("Failed to store events:", error);
                    alert("Failed to store events. Please try again.");
                  } finally {
                    setIsAnalyzing(false);
                  }
                }}
                disabled={isAnalyzing}
                style={{
                  background: isAnalyzing ? '#4a4563' : 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isAnalyzing ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 2,
                  justifyContent: 'center',
                  minWidth: '200px'
                }}
              >
                <Sparkles style={{ width: '20px', height: '20px' }} />
                {isAnalyzing ? 'Saving...' : 'Analyze My Journey'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1e1a2e',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X style={{ width: '24px', height: '24px' }} />
            </button>

            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '32px' }}>
              Add Life Event
            </h2>

            {/* Year and Month */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                  Year *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#252036',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                  Month (optional)
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#252036',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select month</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phase Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>
                How was this phase? *
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {phases.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPhase(p)}
                    style={{
                      background: phase === p ? '#4a4563' : '#252036',
                      border: phase === p ? '2px solid #6b7280' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: phase === p ? '600' : '400'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Slider */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: '#9ca3af', fontSize: '14px' }}>Rating</label>
                <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                  {rating} · {phase}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(to right, 
                    #ef4444 0%, 
                    #f97316 25%, 
                    #6b7280 50%, 
                    #3b82f6 75%, 
                    #10b981 100%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>-10</span>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>0</span>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>+10</span>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                What happened? *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this phase of your life..."
                style={{
                  width: '100%',
                  background: '#252036',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  minHeight: '120px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '14px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!year || !description}
                style={{
                  flex: 1,
                  background: year && description ? 'linear-gradient(to right, #8b5cf6, #7c3aed)' : '#4a4563',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: year && description ? 'pointer' : 'not-allowed',
                  opacity: year && description ? 1 : 0.5
                }}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
