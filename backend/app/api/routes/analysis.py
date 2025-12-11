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
    # Verify user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch all events
    events = db.query(LifeEvent).filter(
        LifeEvent.user_id == request.user_id
    ).order_by(LifeEvent.year, LifeEvent.month).all()
    
    if not events:
        raise HTTPException(status_code=400, detail="No life events found for analysis")
    
    try:
        # Generate statistical forecast
        statistical_forecast = generate_statistical_forecast(events)
        
        # Generate LLM insights (includes rephrased descriptions, predictions, insights)
        llm_results = await generate_llm_insights(user, events)
        
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
        insights = generate_insight_cards(events, statistical_forecast, llm_results)
        
        # Store analysis
        analysis = Analysis(
            user_id=request.user_id,
            hero_heading=llm_results.get("hero_heading", "Your Emotional Journey"),
            summary=llm_results.get("summary", "Here's your life timeline."),
            insights_data=str(insights)  # Store as JSON string
        )
        db.add(analysis)
        db.commit()
        
        return AnalysisResponse(
            hero_heading=llm_results.get("hero_heading", "Your Emotional Journey"),
            summary=llm_results.get("summary", "Here's your emotional timeline from birth till today."),
            timeline=timeline,
            statistical_forecast=statistical_forecast,
            llm_forecast=llm_results.get("llm_forecast", []),
            insights=insights,
            personalized_plan=llm_results.get("personalized_plan", [])
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during analysis: {str(e)}")

