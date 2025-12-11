from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.db.models import User, LifeEvent
from app.schemas.schemas import (
    LifeEventsRequest,
    LifeEventsResponse,
    UserEventsResponse,
    LifeEventResponse
)

router = APIRouter()


@router.post("/life-events", response_model=LifeEventsResponse)
async def create_life_events(request: LifeEventsRequest, db: Session = Depends(get_db)):
    """
    Store multiple life events for a user.
    Each event includes year, month, phase, score, and description.
    """
    # Verify user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Create life events
        events_created = []
        for event_data in request.events:
            event = LifeEvent(
                user_id=request.user_id,
                year=event_data.year,
                month=event_data.month,
                phase=event_data.phase,
                score=event_data.score,
                description=event_data.description
            )
            db.add(event)
            events_created.append(event)
        
        db.commit()
        
        return LifeEventsResponse(
            message="Life events saved successfully",
            events_count=len(events_created)
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving events: {str(e)}")


@router.get("/events/{user_id}", response_model=UserEventsResponse)
async def get_user_events(user_id: str, db: Session = Depends(get_db)):
    """
    Retrieve all life events for a specific user.
    Used for editing and displaying event history.
    """
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all events
    events = db.query(LifeEvent).filter(LifeEvent.user_id == user_id).order_by(LifeEvent.year, LifeEvent.month).all()
    
    return UserEventsResponse(
        user_id=user.id,
        name=user.name,
        dob=user.dob,
        events=[LifeEventResponse.from_orm(event) for event in events]
    )


@router.delete("/events/{event_id}")
async def delete_event(event_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific life event.
    """
    event = db.query(LifeEvent).filter(LifeEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    try:
        db.delete(event)
        db.commit()
        return {"message": "Event deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting event: {str(e)}")

