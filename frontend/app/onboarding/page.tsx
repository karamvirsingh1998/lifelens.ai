"use client";

import { useState } from "react";
import { Calendar, User, ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [name, setName] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Date of Birth:", dateOfBirth);
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Complete data:", { dateOfBirth, name });
    
    try {
      // Store user data in backend
      const response = await fetch('http://localhost:8000/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dob: dateOfBirth }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }
      
      const data = await response.json();
      
      // Store user ID and name in localStorage
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("userName", name);
      
      // Navigate to events page
      window.location.href = "/events";
    } catch (error) {
      console.error("Failed to create profile:", error);
      // Continue anyway with local storage
      localStorage.setItem("userId", Date.now().toString());
      localStorage.setItem("userName", name);
      window.location.href = "/events";
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #2d2347, #1e1a2e, #1a1625)',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Back Button - Only show on step 2 */}
      {step === 2 && (
        <button
          onClick={() => setStep(1)}
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
          Back
        </button>
      )}

      <div style={{ width: '100%', maxWidth: '440px' }}>
        {step === 1 ? (
          // STEP 1: Date of Birth
          <>
            {/* Icon with glow effect */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ position: 'relative' }}>
                {/* Glow effect */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(139, 92, 246, 0.2)',
                    filter: 'blur(40px)',
                    borderRadius: '50%'
                  }}
                ></div>
                {/* Icon container */}
                <div 
                  style={{
                    position: 'relative',
                    background: '#2d2640',
                    borderRadius: '20px',
                    width: '72px',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Calendar style={{ width: '32px', height: '32px', color: '#a78bfa' }} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 
              style={{
                fontSize: '40px',
                lineHeight: '1.2',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '12px'
              }}
            >
              <span 
                style={{
                  background: 'linear-gradient(to right, #a78bfa, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                LifeLens
              </span>
              <span style={{ color: 'white' }}> AI</span>
            </h1>

            {/* Subtitle */}
            <p 
              style={{
                color: '#9ca3af',
                fontSize: '16px',
                textAlign: 'center',
                marginBottom: '40px'
              }}
            >
              Let's start with when your journey began
            </p>

            {/* Form */}
            <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Date of Birth Field */}
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#9ca3af',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e1a2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Continue
              </button>

              {/* Privacy Note */}
              <p 
                style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '14px'
                }}
              >
                Your data is secure and private
              </p>
            </form>
          </>
        ) : (
          // STEP 2: Name Input
          <>
            {/* Icon with glow effect */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ position: 'relative' }}>
                {/* Glow effect */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(139, 92, 246, 0.2)',
                    filter: 'blur(40px)',
                    borderRadius: '50%'
                  }}
                ></div>
                {/* Icon container */}
                <div 
                  style={{
                    position: 'relative',
                    background: '#2d2640',
                    borderRadius: '20px',
                    width: '72px',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <User style={{ width: '32px', height: '32px', color: '#a78bfa' }} />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 
              style={{
                fontSize: '40px',
                lineHeight: '1.2',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '12px',
                color: 'white'
              }}
            >
              What should we call you?
            </h1>

            {/* Subtitle */}
            <p 
              style={{
                color: '#9ca3af',
                fontSize: '16px',
                textAlign: 'center',
                marginBottom: '40px'
              }}
            >
              This will personalize your experience
            </p>

            {/* Form */}
            <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Name Field */}
              <div>
                <label 
                  style={{
                    display: 'block',
                    color: '#9ca3af',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    background: '#1e1a2e',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Start Journey Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Start Your Journey
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
