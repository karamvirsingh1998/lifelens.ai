from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.schemas.schemas import OnboardingRequest, OnboardingResponse

router = APIRouter()


@router.post("/onboarding", response_model=OnboardingResponse)
async def create_user(request: OnboardingRequest, db: Session = Depends(get_db)):
    """
    Create a new user profile with name and date of birth.
    Returns user_id for subsequent API calls.
    """
    try:
        # Create new user
        new_user = User(
            name=request.name,
            dob=request.dob
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return OnboardingResponse(
            user_id=new_user.id,
            message=f"Welcome, {request.name}! Your profile has been created."
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

