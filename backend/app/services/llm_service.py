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
    
    prompt = f"""You are an empathetic life coach analyzing {user.name}'s emotional journey.

User Information:
- Name: {user.name}
- Date of Birth: {user.dob}
- Current Age: ~{user_age} years

Life Events (chronological):
{json.dumps(events_context, indent=2)}

Please provide a comprehensive analysis in JSON format with the following structure:

{{
  "hero_heading": "A powerful, personalized heading summarizing their journey (one sentence)",
  "summary": "A warm, encouraging one-line summary of their emotional timeline",
  "rephrased_events": {{
    "event_id": "Rephrased description that's more poetic and insightful",
    ...
  }},
  "llm_forecast": [
    {{
      "year": 2025,
      "score": 7.5,
      "phase": "High",
      "reasoning": "Based on your resilience patterns and growth trajectory..."
    }},
    ... (5 years total)
  ],
  "personalized_plan": [
    {{
      "category": "high",
      "title": "Bold Action",
      "description": "A high-impact suggestion"
    }},
    {{
      "category": "medium",
      "title": "Steady Growth",
      "description": "A moderate-impact suggestion"
    }},
    {{
      "category": "gentle",
      "title": "Small Step",
      "description": "A gentle, easy suggestion"
    }}
  ]
}}

Guidelines:
1. Hero heading should be inspirational and personal
2. Rephrase descriptions to be more eloquent while preserving meaning
3. Predict scores based on emotional patterns, resilience, and growth trajectory
4. Reasoning should feel intuitive, not mathematical
5. Personalized plan should have 3 actionable items (high/medium/gentle impact)
6. Map scores to phases: 8-10=Very High, 4-7=High, 0-3=Moderate, -3-0=Low, -10--3=Very Low
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

