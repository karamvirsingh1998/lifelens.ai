"""
Insights Service
Generates the 6 insight cards with data for visualization:
1. Emotional Trajectory
2. What Shaped Your Journey
3. Patterns & Cycles
4. Seasonal Trends
5. Future Predictions
6. Personalized Improvement (handled by LLM)
"""
import numpy as np
from typing import List, Dict
from collections import Counter


def generate_insight_cards(events, statistical_forecast: List[Dict], llm_results: Dict) -> Dict:
    """
    Generate premium, narrative-driven insights (not generic metrics).
    """
    insights = {}
    
    # Use LLM-generated insights as primary source
    insights["turning_points"] = llm_results.get("turning_points", [])
    insights["what_shaped_journey"] = llm_results.get("what_shaped_journey", [])
    insights["emotional_cycle"] = llm_results.get("emotional_cycle", {})
    insights["deep_insights"] = llm_results.get("deep_insights", {})
    
    # Add prediction comparison
    insights["future_predictions"] = generate_comparison_insight(
        statistical_forecast,
        llm_results.get("llm_forecast", [])
    )
    
    return insights


def generate_trajectory_insight(events) -> Dict:
    """
    Card 1: Emotional Trajectory
    Visualization: Sparkline with peaks and average
    """
    scores = [event.score for event in events]
    years = [event.year for event in events]
    
    avg_score = np.mean(scores)
    peak_score = max(scores)
    low_score = min(scores)
    
    # Find peak event
    peak_event = events[scores.index(peak_score)]
    low_event = events[scores.index(low_score)]
    
    sparkline_data = [{"year": year, "score": score} for year, score in zip(years, scores)]
    
    return {
        "title": "Emotional Trajectory",
        "description": f"Your average emotional score is {avg_score:.1f}",
        "data": {
            "sparkline": sparkline_data,
            "average": round(avg_score, 2),
            "peak": {
                "score": peak_score,
                "year": peak_event.year,
                "description": peak_event.description
            },
            "low": {
                "score": low_score,
                "year": low_event.year,
                "description": low_event.description
            }
        },
        "visualization_type": "sparkline"
    }


def generate_contributors_insight(events) -> Dict:
    """
    Card 2: What Shaped Your Journey
    Visualization: Donut chart showing phase distribution
    """
    phases = [event.phase for event in events]
    phase_counts = Counter(phases)
    
    total = len(phases)
    donut_data = [
        {
            "phase": phase,
            "count": count,
            "percentage": round((count / total) * 100, 1)
        }
        for phase, count in phase_counts.items()
    ]
    
    # Sort by count
    donut_data.sort(key=lambda x: x["count"], reverse=True)
    
    dominant_phase = donut_data[0]["phase"] if donut_data else "Moderate"
    
    return {
        "title": "What Shaped Your Journey",
        "description": f"Your journey was predominantly {dominant_phase}",
        "data": {
            "donut": donut_data,
            "dominant_phase": dominant_phase
        },
        "visualization_type": "donut"
    }


def generate_patterns_insight(events) -> Dict:
    """
    Card 3: Patterns & Cycles
    Visualization: Circular graph showing growth, waves, or burnout patterns
    """
    scores = [event.score for event in events]
    
    # Analyze patterns
    if len(scores) < 3:
        pattern_type = "emerging"
    else:
        # Check for growth (increasing trend)
        differences = np.diff(scores)
        avg_diff = np.mean(differences)
        
        if avg_diff > 1:
            pattern_type = "growth"
        elif avg_diff < -1:
            pattern_type = "decline"
        elif np.std(differences) > 3:
            pattern_type = "waves"
        else:
            pattern_type = "stable"
    
    pattern_descriptions = {
        "growth": "Your journey shows consistent upward growth",
        "decline": "You've faced increasing challenges recently",
        "waves": "Your emotions cycle through highs and lows",
        "stable": "You maintain emotional stability",
        "emerging": "Your pattern is still emerging"
    }
    
    return {
        "title": "Patterns & Cycles",
        "description": pattern_descriptions[pattern_type],
        "data": {
            "pattern_type": pattern_type,
            "volatility": round(float(np.std(scores)), 2),
            "trend": "upward" if np.mean(np.diff(scores)) > 0 else "downward"
        },
        "visualization_type": "circular"
    }


def generate_seasonal_insight(events) -> Dict:
    """
    Card 4: Seasonal Trends
    Visualization: Sinusoid wave showing monthly patterns
    """
    # Analyze events with month data
    monthly_scores = {i: [] for i in range(1, 13)}
    
    for event in events:
        if event.month:
            monthly_scores[event.month].append(event.score)
    
    # Calculate average score per month
    monthly_averages = []
    for month in range(1, 13):
        if monthly_scores[month]:
            avg = np.mean(monthly_scores[month])
        else:
            avg = None
        monthly_averages.append({
            "month": month,
            "average": round(avg, 2) if avg is not None else None
        })
    
    # Identify best and worst months
    valid_months = [m for m in monthly_averages if m["average"] is not None]
    if valid_months:
        best_month = max(valid_months, key=lambda x: x["average"])
        worst_month = min(valid_months, key=lambda x: x["average"])
    else:
        best_month = {"month": 6, "average": 5}
        worst_month = {"month": 1, "average": 5}
    
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    return {
        "title": "Seasonal Trends",
        "description": f"You tend to feel best in {month_names[best_month['month']-1]}",
        "data": {
            "monthly_data": monthly_averages,
            "best_month": best_month['month'],
            "worst_month": worst_month['month']
        },
        "visualization_type": "sinusoid"
    }


def generate_comparison_insight(stat_forecast: List[Dict], llm_forecast: List[Dict]) -> Dict:
    """
    Card 5: Future Predictions Comparison
    Visualization: Table comparing statistical vs LLM predictions
    """
    comparison_data = []
    
    for stat, llm in zip(stat_forecast, llm_forecast):
        comparison_data.append({
            "year": stat["year"],
            "statistical": {
                "score": stat["score"],
                "phase": stat["phase"]
            },
            "intuitive": {
                "score": llm.get("score", stat["score"]),
                "phase": llm.get("phase", stat["phase"]),
                "reasoning": llm.get("reasoning", "")
            },
            "difference": round(abs(stat["score"] - llm.get("score", stat["score"])), 2)
        })
    
    return {
        "title": "Future Predictions",
        "description": "Math vs Intuition: Two perspectives on your future",
        "data": {
            "comparison": comparison_data
        },
        "visualization_type": "table"
    }

