from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.db.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=False)  # Date of birth as string (YYYY-MM-DD)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    events = relationship("LifeEvent", back_populates="user", cascade="all, delete-orphan")


class LifeEvent(Base):
    __tablename__ = "life_events"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=True)  # Optional
    phase = Column(String, nullable=False)  # Very Low, Low, Moderate, High, Very High
    score = Column(Float, nullable=False)  # -10 to 10
    description = Column(Text, nullable=False)
    rephrased_description = Column(Text, nullable=True)  # LLM-generated
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="events")


class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    hero_heading = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    insights_data = Column(Text, nullable=True)  # JSON stored as text
    created_at = Column(DateTime, default=datetime.utcnow)

