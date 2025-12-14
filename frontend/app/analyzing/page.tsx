"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, TrendingUp, Lightbulb, Calendar, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

type TimelinePoint = {
  year: number;
  month?: number;
  score: number;
  phase: string;
  description: string;
  rephrased?: string;
  isPrediction?: boolean;
  predictionType?: "math" | "intuition";
  reasoning?: string;
};

export default function AnalyzingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Gathering your life events...");
  const [isComplete, setIsComplete] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Show progress while making real API call
    const steps = [
      { progress: 15, step: "Reading your timeline...", delay: 500 },
      { progress: 30, step: "Finding patterns you haven't seen...", delay: 800 },
      { progress: 50, step: "Connecting the dots...", delay: 1000 },
      { progress: 70, step: "Understanding what shaped you...", delay: 1500 },
      { progress: 90, step: "Discovering your path forward...", delay: 800 },
      { progress: 100, step: "Your journey revealed.", delay: 300 },
    ];

    let currentIndex = 0;
    let analysisStarted = false;
    
    const runStep = () => {
      if (currentIndex < steps.length) {
        const { progress: prog, step, delay } = steps[currentIndex];
        setTimeout(() => {
          setProgress(prog);
          setCurrentStep(step);
          currentIndex++;
          
          // Start API call early (at 30% progress)
          if (currentIndex === 2 && !analysisStarted) {
            analysisStarted = true;
            console.log("🎯 Starting real API call...");
            loadAnalysisData();
          }
          
          if (currentIndex < steps.length) {
            runStep();
          } else {
            // Wait a bit for API to finish if not already done
            setTimeout(() => {
              setIsComplete(true);
            }, 500);
          }
        }, delay);
      }
    };
    runStep();
  }, []);

  const loadAnalysisData = async () => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") || "" : "";
    
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    try {
      console.log("=" + "=".repeat(79));
      console.log("🟢 FRONTEND: Starting API call");
      console.log("🟢 FRONTEND: User ID:", userId);
      console.log("🟢 FRONTEND: Calling http://localhost:8000/api/analyze");
      
      // Make actual API call to backend
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      
      console.log("🟢 FRONTEND: Response status:", response.status);
      console.log("🟢 FRONTEND: Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🟢 FRONTEND: Backend error:", errorText);
        throw new Error(`Failed to analyze journey: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log("=" + "=".repeat(79));
      console.log("🟢 FRONTEND: ✅ DATA RECEIVED FROM BACKEND");
      console.log("=" + "=".repeat(79));
      console.log("🟢 FRONTEND: Full response object:", JSON.stringify(data, null, 2));
      console.log("=" + "=".repeat(79));
      console.log("🟢 FRONTEND: Hero Heading:", data.hero_heading);
      console.log("🟢 FRONTEND: Summary:", data.summary);
      console.log("🟢 FRONTEND: Timeline events:", data.timeline?.length);
      console.log("🟢 FRONTEND: Statistical forecast:", data.statistical_forecast?.length);
      console.log("🟢 FRONTEND: LLM forecast:", data.llm_forecast?.length);
      console.log("🟢 FRONTEND: Insights keys:", Object.keys(data.insights || {}));
      console.log("🟢 FRONTEND: Personalized plan:", data.personalized_plan?.length);
      console.log("=" + "=".repeat(79));
      
      if (data.llm_forecast && data.llm_forecast.length > 0) {
        console.log("🟢 FRONTEND: First LLM prediction:", data.llm_forecast[0]);
      }
      
      if (data.personalized_plan && data.personalized_plan.length > 0) {
        console.log("🟢 FRONTEND: First plan item:", data.personalized_plan[0]);
      }
      
      if (data.insights) {
        console.log("🟢 FRONTEND: Insights breakdown:");
        Object.keys(data.insights).forEach(key => {
          console.log(`🟢 FRONTEND:   - ${key}:`, data.insights[key]?.title || 'N/A');
        });
      }
      
      console.log("=" + "=".repeat(79));
      console.log("🟢 FRONTEND: Setting analysis data in state...");
      
      setAnalysisData(data);
      setIsComplete(true); // Show results immediately
      setProgress(100);
      
      console.log("🟢 FRONTEND: ✅ Analysis data set successfully!");
      console.log("=" + "=".repeat(79));
    } catch (error) {
      console.error("=" + "=".repeat(79));
      console.error("🟢 FRONTEND: ❌ ERROR:", error);
      // Fallback to mock data if API fails
      const mockData = {
        hero_heading: "Your journey is still emerging",
        summary: "We're analyzing your emotional patterns.",
        timeline: [
          { year: 2020, month: 3, score: 0, phase: "Moderate", description: "Beginning", rephrased: "The beginning of your journey" }
        ],
        statistical_forecast: [
          { year: 2025, score: 2, phase: "Moderate" },
          { year: 2026, score: 3, phase: "Moderate" },
          { year: 2027, score: 3, phase: "Moderate" },
          { year: 2028, score: 4, phase: "High" },
          { year: 2029, score: 4, phase: "High" },
        ],
        llm_forecast: [
          { year: 2025, score: 3, phase: "Moderate", reasoning: "Your pattern is still forming" },
          { year: 2026, score: 4, phase: "High", reasoning: "Growth potential ahead" },
          { year: 2027, score: 4, phase: "High", reasoning: "Continued development" },
          { year: 2028, score: 5, phase: "High", reasoning: "Building momentum" },
          { year: 2029, score: 5, phase: "High", reasoning: "Sustained progress" },
        ],
        insights: {
          deep_insights: {
            pattern_name: "The Emerging Path",
            one_sentence: "Your story is just beginning to take shape.",
            unspoken_rule: "More data needed to identify your core pattern.",
            blind_spot: "Early observations suggest steady progress.",
            personal_quote: "Every journey begins with a single step, but the pattern emerges over time.",
            future_self_message: "Trust the process. The dots will connect."
          },
          turning_points: [],
          what_shaped_journey: [],
          emotional_cycle: {
            pattern_type: "emerging",
            cycle_description: "Your pattern needs more time to reveal itself.",
            visual_flow: "Just Beginning"
          }
        },
        personalized_plan: [
          { title: "Continue adding life events", why: "More data will reveal deeper patterns" }
        ]
      };
      setAnalysisData(mockData);
    }
  };

  const getPhaseColor = (score: number) => {
    if (score >= 6) return "#10b981"; // green
    if (score >= 3) return "#3b82f6"; // blue
    if (score >= 0) return "#6b7280"; // gray
    if (score >= -3) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  if (!isComplete || !analysisData) {
    // Loading state
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'linear-gradient(to bottom right, #2d2347, #1e1a2e, #1a1625)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <Sparkles style={{ width: '40px', height: '40px', color: 'white' }} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Analyzing Your Journey
            </h2>
            <p style={{ fontSize: '16px', color: '#9ca3af' }}>
              {currentStep}
            </p>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              background: '#2d2640',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                borderRadius: '4px',
                width: `${progress}%`,
                transition: 'width 0.5s ease-out'
              }}
            />
          </div>
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginTop: '12px' }}>
            {progress}% complete
          </p>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
        `}</style>
      </div>
    );
  }

  // Prepare timeline data
  const pastEvents: TimelinePoint[] = analysisData.timeline.map((t: any) => ({
    ...t,
    isPrediction: false
  }));
  
  const statForecast: TimelinePoint[] = analysisData.statistical_forecast.map((f: any) => ({
    ...f,
    month: f.month || 6,
    isPrediction: true,
    predictionType: "math" as const,
    description: "Statistical prediction"
  }));
  
  const llmForecast: TimelinePoint[] = analysisData.llm_forecast.map((f: any) => ({
    ...f,
    month: f.month || 6,
    isPrediction: true,
    predictionType: "intuition" as const,
    description: f.reasoning
  }));
  
  // Combine for tooltip purposes
  const allPoints: TimelinePoint[] = [...pastEvents, ...statForecast, ...llmForecast];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(to bottom right, #2d2347, #1e1a2e, #1a1625)',
        padding: '40px 20px',
        position: 'relative'
      }}
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
    >
      {/* Back Button */}
      <button
        onClick={() => router.push("/events")}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft style={{ width: '20px', height: '20px' }} />
        Back
      </button>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Analysis Complete Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '8px 16px',
            marginBottom: '24px'
          }}
        >
          <Sparkles style={{ width: '16px', height: '16px', color: '#f97316' }} />
          <span style={{ color: '#f97316', fontSize: '14px', fontWeight: '600' }}>
            Analysis Complete
          </span>
        </div>

        {/* Hero Heading - Premium Typography */}
        <div style={{ marginBottom: '64px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              marginBottom: '24px',
              lineHeight: '1.1',
              color: 'white',
              letterSpacing: '-0.02em'
            }}
          >
            {analysisData.hero_heading}
          </h1>
          <p style={{ fontSize: '20px', color: '#9ca3af', lineHeight: '1.6', maxWidth: '800px' }}>
            {analysisData.summary}
          </p>
        </div>

        {/* Timeline Graph */}
        <div
          style={{
            background: 'rgba(30, 26, 46, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '32px',
            position: 'relative'
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
              Your Emotional Timeline
            </h2>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>
              Click on any point to see details
            </p>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '3px', background: '#a78bfa' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>Past</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '3px', background: '#f97316', borderTop: '2px dashed #f97316' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>What Math has to say</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '3px', background: '#3b82f6', borderTop: '2px dashed #3b82f6' }} />
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>What Intuition has to say</span>
            </div>
          </div>

          {/* Timeline Visualization with Lines */}
          <div style={{ height: '300px', position: 'relative', background: '#1a1625', borderRadius: '16px', padding: '20px' }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 260" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
              {/* Y-axis labels */}
              {[-10, -5, 0, 5, 10].map((val, i) => (
                <text
                  key={i}
                  x="20"
                  y={250 - ((val + 10) / 20) * 220}
                  fill="#6b7280"
                  fontSize="12"
                >
                  {val}
                </text>
              ))}
              
              {/* Helper function to get X position based on year/month */}
              {(() => {
                const getX = (year: number, month: number) => {
                  const allYears = [
                    ...pastEvents.map(e => e.year + (e.month || 6) / 12),
                    ...statForecast.map(e => e.year + (e.month || 6) / 12),
                  ];
                  const minYear = Math.min(...allYears);
                  const maxYear = Math.max(...allYears);
                  const yearDecimal = year + (month || 6) / 12;
                  return 60 + ((yearDecimal - minYear) / (maxYear - minYear)) * 880;
                };
                
                const getY = (score: number) => {
                  return 250 - ((score + 10) / 20) * 220;
                };
                
                // 1. SOLID LINE for Past Events
                const pastPath = pastEvents.map((point, i) => {
                  const x = getX(point.year, point.month || 6);
                  const y = getY(point.score);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');
                
                // 2. DASHED LINE for Statistical Forecast (starts from last past event)
                const lastPastEvent = pastEvents[pastEvents.length - 1];
                const statPath = [
                  `M ${getX(lastPastEvent.year, lastPastEvent.month || 6)} ${getY(lastPastEvent.score)}`,
                  ...statForecast.map(point => {
                    const x = getX(point.year, point.month || 6);
                    const y = getY(point.score);
                    return `L ${x} ${y}`;
                  })
                ].join(' ');
                
                // 3. DASHED LINE for LLM Forecast (starts from last past event)
                const llmPath = [
                  `M ${getX(lastPastEvent.year, lastPastEvent.month || 6)} ${getY(lastPastEvent.score)}`,
                  ...llmForecast.map(point => {
                    const x = getX(point.year, point.month || 6);
                    const y = getY(point.score);
                    return `L ${x} ${y}`;
                  })
                ].join(' ');
                
                return (
                  <>
                    {/* Past Events - SOLID LINE */}
                    <path
                      d={pastPath}
                      stroke="#a78bfa"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Statistical Forecast - DASHED LINE */}
                    <path
                      d={statPath}
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* LLM Forecast - DASHED LINE */}
                    <path
                      d={llmPath}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Points for Past Events */}
                    {pastEvents.map((point, index) => {
                      const x = getX(point.year, point.month || 6);
                      const y = getY(point.score);
                      return (
                        <circle
                          key={`past-${index}`}
                          cx={x}
                          cy={y}
                          r="6"
                          fill="#a78bfa"
                          stroke="white"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                    
                    {/* Points for Statistical Forecast */}
                    {statForecast.map((point, index) => {
                      const x = getX(point.year, point.month || 6);
                      const y = getY(point.score);
                      return (
                        <circle
                          key={`stat-${index}`}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#f97316"
                          stroke="white"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                    
                    {/* Points for LLM Forecast */}
                    {llmForecast.map((point, index) => {
                      const x = getX(point.year, point.month || 6);
                      const y = getY(point.score);
                      return (
                        <circle
                          key={`llm-${index}`}
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Tooltip */}
          {hoveredPoint && (
            <div
              style={{
                position: 'fixed',
                left: mousePosition.x + 20,
                top: mousePosition.y - 50,
                background: '#1e1a2e',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                minWidth: '200px',
                zIndex: 1000,
                pointerEvents: 'none'
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                {hoveredPoint.month ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][hoveredPoint.month - 1]} ${hoveredPoint.year}` : hoveredPoint.year}
              </div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
                Phase: {hoveredPoint.phase}
              </div>
              <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                {hoveredPoint.rephrased || hoveredPoint.description || hoveredPoint.reasoning}
              </div>
            </div>
          )}
        </div>

        {/* Pattern Name - Simple & Clear */}
        {analysisData.insights?.unique_insights?.pattern_name && (
          <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '20px', padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#a78bfa', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              Your Pattern
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              {analysisData.insights.unique_insights.pattern_name}
            </h2>
            {analysisData.insights.unique_insights.one_truth && (
              <p style={{ fontSize: '16px', color: '#d1d5db', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
                {analysisData.insights.unique_insights.one_truth}
              </p>
            )}
          </div>
        )}

        {/* Turning Points - Simplified */}
        {analysisData.insights?.turning_points && analysisData.insights.turning_points.length > 0 && (
          <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
              Key Moments
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysisData.insights.turning_points.map((point: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: '50px', textAlign: 'center', paddingTop: '4px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#a78bfa' }}>{point.year}</div>
                  </div>
                  <div style={{ flex: 1, background: '#2d2640', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#f97316', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {point.type.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: '15px', color: 'white', lineHeight: '1.5' }}>
                      {point.insight}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What Shaped Your Journey - Simplified */}
        {analysisData.insights?.what_shaped_journey && analysisData.insights.what_shaped_journey.length > 0 && (
          <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
              What Shaped You
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysisData.insights.what_shaped_journey.map((item: any, i: number) => (
                <div key={i} style={{ background: '#2d2640', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontSize: '15px', color: '#a78bfa', fontWeight: '600', marginBottom: '10px' }}>
                    {item.chain}
                  </div>
                  <div style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.5' }}>
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emotional Cycle - Simplified */}
        {analysisData.insights?.emotional_cycle && (
          <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
              Your Cycle
            </h3>
            <div style={{ background: '#2d2640', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', color: '#ec4899', fontWeight: '600', marginBottom: '16px' }}>
                {analysisData.insights.emotional_cycle.visual_flow}
              </div>
              <div style={{ fontSize: '15px', color: '#d1d5db', lineHeight: '1.5' }}>
                {analysisData.insights.emotional_cycle.cycle_description}
              </div>
            </div>
          </div>
        )}

        {/* Unique Practical Insights - Grid */}
        {analysisData.insights?.unique_insights && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {analysisData.insights.unique_insights.hidden_rule && (
              <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#a78bfa', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Your Hidden Rule
                </div>
                <div style={{ fontSize: '16px', color: 'white', lineHeight: '1.5' }}>
                  {analysisData.insights.unique_insights.hidden_rule}
                </div>
              </div>
            )}

            {analysisData.insights.unique_insights.strength_they_dont_see && (
              <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Strength You Don't See
                </div>
                <div style={{ fontSize: '16px', color: 'white', lineHeight: '1.5' }}>
                  {analysisData.insights.unique_insights.strength_they_dont_see}
                </div>
              </div>
            )}

            {analysisData.insights.unique_insights.warning_sign && (
              <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#f97316', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Watch For This
                </div>
                <div style={{ fontSize: '16px', color: 'white', lineHeight: '1.5' }}>
                  {analysisData.insights.unique_insights.warning_sign}
                </div>
              </div>
            )}

            {analysisData.insights.unique_insights.opportunity && (
              <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                  Opportunity
                </div>
                <div style={{ fontSize: '16px', color: 'white', lineHeight: '1.5' }}>
                  {analysisData.insights.unique_insights.opportunity}
                </div>
              </div>
            )}

            {analysisData.insights.unique_insights.what_works && (
              <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                  What Works For You
                </div>
                <div style={{ fontSize: '16px', color: 'white', lineHeight: '1.5' }}>
                  {analysisData.insights.unique_insights.what_works}
                </div>
              </div>
            )}

            {analysisData.insights.unique_insights.what_doesnt && (
              <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                  What Doesn't Work
                </div>
                <div style={{ fontSize: '16px', color: 'white', lineHeight: '1.5' }}>
                  {analysisData.insights.unique_insights.what_doesnt}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Message From Future Self */}
        {analysisData.insights?.unique_insights?.future_self_note && (
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '32px', marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase' }}>
              From Your Future Self
            </div>
            <div style={{ fontSize: '18px', color: 'white', lineHeight: '1.6' }}>
              {analysisData.insights.unique_insights.future_self_note}
            </div>
          </div>
        )}

        {/* Future View - Simplified */}
        {analysisData.statistical_forecast && analysisData.llm_forecast && (
          <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
              What's Ahead
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: '#2d2640', borderRadius: '12px', padding: '18px', borderLeft: '3px solid #f97316' }}>
                <div style={{ fontSize: '12px', color: '#f97316', fontWeight: '600', marginBottom: '10px' }}>
                  Math Says
                </div>
                <div style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.5' }}>
                  {analysisData.statistical_forecast[0]?.phase} states ahead
                </div>
              </div>
              <div style={{ background: '#2d2640', borderRadius: '12px', padding: '18px', borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600', marginBottom: '10px' }}>
                  Intuition Says
                </div>
                <div style={{ fontSize: '14px', color: '#d1d5db', lineHeight: '1.5' }}>
                  {analysisData.llm_forecast[0]?.reasoning || "Continued growth ahead"}
                </div>
              </div>
            </div>
            {(() => {
              const mathAvg = analysisData.statistical_forecast.reduce((sum: number, f: any) => sum + f.score, 0) / analysisData.statistical_forecast.length;
              const llmAvg = analysisData.llm_forecast.reduce((sum: number, f: any) => sum + f.score, 0) / analysisData.llm_forecast.length;
              const diff = Math.abs(mathAvg - llmAvg);
              return (
                <div style={{ background: '#1a1625', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: diff < 1 ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                    {diff < 1 ? '✓ Both agree' : '⚡ They differ'}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Actionable Insights */}
        {analysisData.insights?.actionable_insights && analysisData.insights.actionable_insights.length > 0 && (
          <div style={{ background: 'rgba(30, 26, 46, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>
              What To Do
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analysisData.insights.actionable_insights.map((action: any, index: number) => (
                <div
                  key={index}
                  style={{
                    background: '#2d2640',
                    borderLeft: '3px solid #a78bfa',
                    borderRadius: '12px',
                    padding: '20px'
                  }}
                >
                  <div style={{ fontSize: '16px', color: 'white', fontWeight: '600', marginBottom: '8px' }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>
                    {action.why}
                  </div>
                  {action.when && (
                    <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                      When: {action.when}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
