"""
LLM Service
Handles OpenAI API calls for:
- Rephrasing event descriptions
- Generating intuitive predictions with reasoning
- Creating personalized insights and headings
"""
import json
from typing import List, Dict
from openai import AsyncOpenAI

from app.core.config import settings
from app.db.models import User, LifeEvent

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_llm_insights(user: User, events: List[LifeEvent]) -> Dict:
    """
    Generate comprehensive LLM-based insights including:
    - Hero heading and summary
    - Rephrased event descriptions
    - Intuitive future predictions with reasoning
    - Personalized improvement plan
    """
    # Build context about the user's journey
    events_context = []
    for event in events:
        events_context.append({
            "id": event.id,
            "year": event.year,
            "month": event.month,
            "phase": event.phase,
            "score": event.score,
            "description": event.description
        })
    
    user_age = 2024 - int(user.dob.split('-')[0])  # Approximate current age
    
    prompt = f"""Analyze {user.name}'s life events and generate practical, unique insights. Use simple, direct English.

User: {user.name}, Age {user_age}

Events:
{json.dumps(events_context, indent=2)}

Return JSON:

{{
  "hero_heading": "One clear sentence about their pattern (simple English)",
  "summary": "What stands out in plain language",
  
  "rephrased_events": {{
    "event_id": "Clear, simple rephrasing"
  }},
  
  "turning_points": [
    {{
      "event_id": "id",
      "year": 2020,
      "type": "first_dip" | "biggest_recovery" | "longest_stable" | "recent_change",
      "insight": "Why this mattered - be specific and practical"
    }}
  ],
  
  "what_shaped_journey": [
    {{
      "chain": "Work stress → emotional dip → withdrawal",
      "explanation": "Simple cause-effect in plain English"
    }}
  ],
  
  "emotional_cycle": {{
    "pattern_name": "The Overdrive Loop" | "The Steady Builder" | "The Phoenix" | "The Wave Rider",
    "cycle_description": "What keeps happening in simple terms",
    "visual_flow": "Build → Push → Dip → Recover"
  }},
  
  "llm_forecast": [
    {{
      "year": 2025,
      "score": 7.5,
      "phase": "High",
      "reasoning": "Simple, practical reasoning"
    }}
  ],
  
  "unique_insights": {{
    "pattern_name": "2-3 word name for their journey",
    "one_truth": "One practical truth about their life pattern",
    "hidden_rule": "A rule they follow without realizing it",
    "blind_spot": "Something they might miss about themselves",
    "strength_they_dont_see": "A strength they have but may not notice",
    "warning_sign": "A pattern that could cause problems if ignored",
    "opportunity": "A specific opportunity based on their pattern",
    "what_works": "What actually works for them (based on data)",
    "what_doesnt": "What doesn't work for them (based on data)",
    "future_self_note": "Practical note from 1 year ahead"
  }},
  
  "actionable_insights": [
    {{
      "title": "Specific action based on their pattern",
      "why": "Why this matters for them",
      "when": "When to do this"
    }}
  ]
}}

RULES:
- Use simple, direct English - no flowery language
- Be specific to THEIR data, not generic
- Focus on practical, useful insights
- Each insight should be unique and actionable
- If not enough data, say "Pattern still forming"

Map scores: 8-10=Very High, 4-7=High, 0-3=Moderate, -3-0=Low, -10--3=Very Low
"""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert emotional intelligence coach who provides deep, personalized insights. Always respond with valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Ensure llm_forecast has proper structure and 5 years
        if "llm_forecast" in result:
            forecast = result["llm_forecast"]
            if not isinstance(forecast, list):
                forecast = []
            # Ensure we have 5 years of forecast
            if len(forecast) < 5:
                last_year = max([e.year for e in events]) if events else 2024
                last_score = events[-1].score if events else 5
                for i in range(len(forecast), 5):
                    forecast.append({
                        "year": last_year + i + 1,
                        "score": last_score,
                        "phase": "Moderate",
                        "reasoning": "Pattern still forming"
                    })
            result["llm_forecast"] = forecast[:5]  # Ensure exactly 5
        
        return result
    
    except Exception as e:
        print(f"LLM Service Error: {e}")
        # Return fallback response
        return generate_fallback_insights(user, events)


def generate_fallback_insights(user: User, events: List[LifeEvent]) -> Dict:
    """
    Generate basic insights when LLM service fails.
    """
    last_event = events[-1] if events else None
    last_score = last_event.score if last_event else 5
    
    # Simple forecast based on last score
    forecast = []
    current_year = 2024
    for i in range(1, 6):
        # Slight upward trend
        score = min(last_score + i * 0.5, 10)
        phase = "High" if score >= 4 else "Moderate"
        forecast.append({
            "year": current_year + i,
            "score": round(score, 2),
            "phase": phase,
            "reasoning": "Based on your journey's trajectory and resilience."
        })
    
    # Rephrase events (simple version)
    rephrased = {}
    for event in events:
        rephrased[str(event.id)] = f"In {event.year}, you experienced: {event.description}"
    
    return {
        "hero_heading": f"{user.name}, Your Journey Shows Continuous Growth",
        "summary": "Here's your emotional timeline, mapped with care.",
        "rephrased_events": rephrased,
        "llm_forecast": forecast,
        "personalized_plan": [
            {
                "category": "high",
                "title": "Embrace New Challenges",
                "description": "Take on opportunities that push your boundaries."
            },
            {
                "category": "medium",
                "title": "Build Strong Relationships",
                "description": "Invest time in meaningful connections."
            },
            {
                "category": "gentle",
                "title": "Practice Daily Gratitude",
                "description": "Take 5 minutes each day to reflect on positive moments."
            }
        ]
    }

