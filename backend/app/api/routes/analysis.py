from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User, LifeEvent, Analysis
from app.schemas.schemas import AnalysisRequest, AnalysisResponse
from app.services.prediction_service import generate_statistical_forecast
from app.services.llm_service import generate_llm_insights
from app.services.insights_service import generate_insight_cards

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_life_journey(request: AnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyze user's life journey and generate:
    - Statistical predictions (ARIMA/Exponential Smoothing)
    - LLM-based predictions with reasoning
    - Rephrased event descriptions
    - Personalized insights and recommendations
    """
    print("=" * 80)
    print("🔵 BACKEND: Starting analysis")
    print(f"🔵 BACKEND: User ID: {request.user_id}")
    
    # Verify user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    print(f"🔵 BACKEND: Found user: {user.name}, DOB: {user.dob}")
    
    # Fetch all events
    events = db.query(LifeEvent).filter(
        LifeEvent.user_id == request.user_id
    ).order_by(LifeEvent.year, LifeEvent.month).all()
    
    if not events:
        raise HTTPException(status_code=400, detail="No life events found for analysis")
    
    print(f"🔵 BACKEND: Found {len(events)} events")
    for i, event in enumerate(events, 1):
        print(f"🔵 BACKEND:   Event {i}: {event.year}/{event.month} - Score: {event.score} - {event.description[:50]}...")
    
    try:
        # Generate statistical forecast
        print("🔵 BACKEND: Generating statistical forecast...")
        statistical_forecast_raw = generate_statistical_forecast(events)
        # Format to match ForecastPoint schema (remove month if present)
        statistical_forecast = []
        for f in statistical_forecast_raw:
            statistical_forecast.append({
                "year": f.get("year", 2025),
                "score": f.get("score", 5.0),
                "phase": f.get("phase", "Moderate"),
                "reasoning": None
            })
        print(f"🔵 BACKEND: Statistical forecast generated: {len(statistical_forecast)} points")
        print(f"🔵 BACKEND: First prediction: {statistical_forecast[0] if statistical_forecast else 'None'}")
        
        # Generate LLM insights (includes rephrased descriptions, predictions, insights)
        print("🔵 BACKEND: Calling OpenAI for LLM insights...")
        llm_results = await generate_llm_insights(user, events)
        print(f"🔵 BACKEND: LLM results received!")
        print(f"🔵 BACKEND: Hero heading: {llm_results.get('hero_heading', 'N/A')[:100]}")
        print(f"🔵 BACKEND: LLM forecast points: {len(llm_results.get('llm_forecast', []))}")
        print(f"🔵 BACKEND: Actionable insights: {len(llm_results.get('actionable_insights', []))}")
        print(f"🔵 BACKEND: Personalized plan items: {len(llm_results.get('personalized_plan', []))}")
        
        # Ensure llm_forecast is properly formatted
        llm_forecast = llm_results.get("llm_forecast", [])
        if llm_forecast:
            # Ensure each forecast point has required fields
            formatted_forecast = []
            for f in llm_forecast:
                if isinstance(f, dict):
                    formatted_forecast.append({
                        "year": f.get("year", 2025),
                        "score": f.get("score", 5.0),
                        "phase": f.get("phase", "Moderate"),
                        "reasoning": f.get("reasoning", "")
                    })
            llm_results["llm_forecast"] = formatted_forecast
        
        # Update events with rephrased descriptions
        for event in events:
            if str(event.id) in llm_results.get("rephrased_events", {}):
                event.rephrased_description = llm_results["rephrased_events"][str(event.id)]
        db.commit()
        
        # Build timeline
        timeline = []
        for event in events:
            timeline.append({
                "year": event.year,
                "month": event.month,
                "score": event.score,
                "phase": event.phase,
                "event": event.description,
                "rephrased": event.rephrased_description
            })
        
        # Generate insight cards
        print("🔵 BACKEND: Generating insight cards...")
        insights = generate_insight_cards(events, statistical_forecast, llm_results)
        print(f"🔵 BACKEND: Generated {len(insights)} insight cards")
        print(f"🔵 BACKEND: Insight keys: {list(insights.keys())}")
        
        # Format personalized plan
        actionable_insights = llm_results.get("actionable_insights", [])
        personalized_plan = llm_results.get("personalized_plan", [])
        
        # Combine and format
        plan_items = []
        if actionable_insights:
            plan_items = actionable_insights
        elif personalized_plan:
            plan_items = personalized_plan
        
        print(f"🔵 BACKEND: Plan items: {len(plan_items)}")
        
        # Store analysis
        analysis = Analysis(
            user_id=request.user_id,
            hero_heading=llm_results.get("hero_heading", "Your Emotional Journey"),
            summary=llm_results.get("summary", "Here's your life timeline."),
            insights_data=str(insights)  # Store as JSON string
        )
        db.add(analysis)
        db.commit()
        
        response_data = AnalysisResponse(
            hero_heading=llm_results.get("hero_heading", "Your Emotional Journey"),
            summary=llm_results.get("summary", "Here's your emotional timeline."),
            timeline=timeline,
            statistical_forecast=statistical_forecast,
            llm_forecast=llm_results.get("llm_forecast", []),
            insights=insights,
            personalized_plan=plan_items
        )
        
        print("🔵 BACKEND: Final response ready!")
        print(f"🔵 BACKEND: Timeline events: {len(timeline)}")
        print(f"🔵 BACKEND: Statistical forecast: {len(statistical_forecast)}")
        print(f"🔵 BACKEND: LLM forecast: {len(llm_results.get('llm_forecast', []))}")
        print(f"🔵 BACKEND: Insights cards: {len(insights)}")
        print(f"🔵 BACKEND: Personalized plan: {len(llm_results.get('personalized_plan', []))}")
        print("=" * 80)
        
        return response_data
    
    except Exception as e:
        import traceback
        print("=" * 80)
        print("🔵 BACKEND: ❌ ERROR OCCURRED!")
        print(f"🔵 BACKEND: Error type: {type(e).__name__}")
        print(f"🔵 BACKEND: Error message: {str(e)}")
        print("🔵 BACKEND: Full traceback:")
        traceback.print_exc()
        print("=" * 80)
        raise HTTPException(status_code=500, detail=f"Error during analysis: {str(e)}")

