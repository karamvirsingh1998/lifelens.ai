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
    
    prompt = f"""You are analyzing {user.name}'s emotional journey with the depth and sensitivity of a master therapist.

User: {user.name}, Age {user_age}, Born {user.dob}

Life Events:
{json.dumps(events_context, indent=2)}

Generate deeply personalized insights in JSON format:

{{
  "hero_heading": "A single profound sentence about their journey (not motivational, just true)",
  "summary": "One reflective line about what their timeline reveals",
  
  "rephrased_events": {{
    "event_id": "Transform into a narrative moment, not just description"
  }},
  
  "turning_points": [
    {{
      "event_id": "id_of_event",
      "age": {user_age},
      "year": 2020,
      "type": "first_major_dip" | "strongest_recovery" | "longest_stable" | "recent_momentum",
      "insight": "One line explaining why this moment mattered"
    }}
  ],
  
  "what_shaped_journey": [
    {{
      "chain": "Cause → Effect → Consequence",
      "explanation": "Natural language reasoning connecting dots"
    }}
  ],
  
  "emotional_cycle": {{
    "pattern_type": "phoenix" | "builder" | "overdrive" | "steady",
    "cycle_description": "Their recurring loop in one sentence",
    "visual_flow": "Build → Overextend → Dip → Recover"
  }},
  
  "llm_forecast": [
    {{
      "year": 2025,
      "score": 7.5,
      "phase": "High",
      "reasoning": "Intuitive, pattern-based reasoning"
    }}
  ],
  
  "deep_insights": {{
    "unspoken_rule": "A hidden rule they live by",
    "pattern_name": "Give their journey a 2-3 word name",
    "one_sentence": "One sentence that explains their entire life",
    "blind_spot": "Gentle observation they may not see",
    "personal_quote": "A quote derived FROM their data, signed — LifeLens",
    "future_self_message": "2-3 sentences as if from 1 year ahead"
  }},
  
  "personalized_plan": [
    {{
      "title": "Not generic advice - specific to THEIR pattern",
      "why": "Why this matters for THEM specifically"
    }}
  ]
}}

CRITICAL RULES:
- NO generic self-help language
- NO clichés or motivational fluff  
- BE SPECIFIC to their timeline
- Use calm, reflective tone
- Assume intelligence and maturity
- Every insight must be screenshot-worthy
- If you don't have enough data for an insight, be honest: "Your pattern is still emerging"

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

