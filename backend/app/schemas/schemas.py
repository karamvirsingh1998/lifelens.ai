from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import date


# ===== Onboarding Schemas =====
class OnboardingRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    dob: str = Field(..., description="Date of birth in YYYY-MM-DD format")
    
    @validator('dob')
    def validate_dob(cls, v):
        try:
            date.fromisoformat(v)
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
        return v


class OnboardingResponse(BaseModel):
    user_id: str
    message: str


# ===== Life Events Schemas =====
class LifeEventCreate(BaseModel):
    year: int = Field(..., ge=1900, le=2100)
    month: Optional[int] = Field(None, ge=1, le=12)
    phase: str = Field(..., description="Very Low, Low, Moderate, High, Very High")
    score: float = Field(..., ge=-10, le=10)
    description: str = Field(..., min_length=1)
    
    @validator('phase')
    def validate_phase(cls, v):
        valid_phases = ["Very Low", "Low", "Moderate", "High", "Very High"]
        if v not in valid_phases:
            raise ValueError(f'Phase must be one of: {", ".join(valid_phases)}')
        return v


class LifeEventResponse(BaseModel):
    id: int
    year: int
    month: Optional[int]
    phase: str
    score: float
    description: str
    rephrased_description: Optional[str]
    
    class Config:
        from_attributes = True


class LifeEventsRequest(BaseModel):
    user_id: str
    events: List[LifeEventCreate]


class LifeEventsResponse(BaseModel):
    message: str
    events_count: int


# ===== Analysis Schemas =====
class TimelineEvent(BaseModel):
    year: int
    month: Optional[int]
    score: float
    phase: str
    event: str
    rephrased: Optional[str]


class ForecastPoint(BaseModel):
    year: int
    score: float
    phase: str
    reasoning: Optional[str] = None


class InsightCard(BaseModel):
    title: str
    description: str
    data: Dict[str, Any]
    visualization_type: str  # sparkline, donut, circular, sinusoid, table, cards


class PersonalizedAction(BaseModel):
    title: str
    why: Optional[str] = None
    when: Optional[str] = None
    description: Optional[str] = None  # For backward compatibility
    category: Optional[str] = None  # For backward compatibility
    
    class Config:
        extra = "allow"  # Allow extra fields


class AnalysisResponse(BaseModel):
    hero_heading: str
    summary: str
    timeline: List[TimelineEvent]
    statistical_forecast: List[ForecastPoint]
    llm_forecast: List[ForecastPoint]
    insights: Dict[str, Any]  # Flexible - can contain any structure
    personalized_plan: List[PersonalizedAction]


class AnalysisRequest(BaseModel):
    user_id: str


# ===== User Events Retrieval =====
class UserEventsResponse(BaseModel):
    user_id: str
    name: str
    dob: str
    events: List[LifeEventResponse]

