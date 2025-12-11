# LifeLens.ai Backend

FastAPI-based backend for emotional journey analysis with statistical predictions and LLM insights.

## Features

- RESTful API with FastAPI
- PostgreSQL database with SQLAlchemy ORM
- Statistical forecasting (ARIMA, Exponential Smoothing, Linear Regression)
- OpenAI GPT-4 integration for insights and natural language generation
- Pydantic validation for all inputs
- Async support for better performance

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/          # API route handlers
│   │       ├── onboarding.py
│   │       ├── events.py
│   │       └── analysis.py
│   ├── core/
│   │   └── config.py        # Configuration settings
│   ├── db/
│   │   ├── database.py      # Database connection
│   │   └── models.py        # SQLAlchemy models
│   ├── schemas/
│   │   └── schemas.py       # Pydantic schemas
│   └── services/
│       ├── prediction_service.py   # Statistical forecasting
│       ├── llm_service.py         # OpenAI integration
│       └── insights_service.py    # Insight card generation
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
└── Dockerfile              # Docker configuration
```

## API Endpoints

### Health Check
```
GET /health
Response: {"status": "healthy"}
```

### Onboarding
```
POST /api/onboarding
Body: {
  "name": "John Doe",
  "dob": "1990-01-01"
}
Response: {
  "user_id": "uuid",
  "message": "Welcome, John Doe! Your profile has been created."
}
```

### Save Life Events
```
POST /api/life-events
Body: {
  "user_id": "uuid",
  "events": [
    {
      "year": 2023,
      "month": 5,
      "phase": "High",
      "score": 8,
      "description": "Started new job"
    }
  ]
}
Response: {
  "message": "Life events saved successfully",
  "events_count": 1
}
```

### Get User Events
```
GET /api/events/{user_id}
Response: {
  "user_id": "uuid",
  "name": "John Doe",
  "dob": "1990-01-01",
  "events": [...]
}
```

### Analyze Journey
```
POST /api/analyze
Body: {
  "user_id": "uuid"
}
Response: {
  "hero_heading": "Your Journey Shows Strong Upward Growth",
  "summary": "Here's your emotional timeline...",
  "timeline": [...],
  "statistical_forecast": [...],
  "llm_forecast": [...],
  "insights": {...},
  "personalized_plan": [...]
}
```

## Database Models

### User
- id (UUID, primary key)
- name (String)
- dob (String, YYYY-MM-DD)
- created_at, updated_at (DateTime)

### LifeEvent
- id (Integer, primary key)
- user_id (Foreign key to User)
- year (Integer)
- month (Integer, optional)
- phase (String: Very Low, Low, Moderate, High, Very High)
- score (Float, -10 to 10)
- description (Text)
- rephrased_description (Text, LLM-generated)
- created_at, updated_at (DateTime)

### Analysis
- id (Integer, primary key)
- user_id (Foreign key to User)
- hero_heading (Text)
- summary (Text)
- insights_data (Text, JSON)
- created_at (DateTime)

## Services

### Prediction Service
- Statistical forecasting using ARIMA, Exponential Smoothing, and Linear Regression
- Averages multiple models for robust predictions
- Maps scores to emotional phases

### LLM Service
- OpenAI GPT-4 integration
- Generates rephrased event descriptions
- Creates intuitive predictions with reasoning
- Produces personalized action plans

### Insights Service
- Generates 6 insight cards:
  1. Emotional Trajectory (sparkline)
  2. What Shaped Your Journey (donut chart)
  3. Patterns & Cycles (circular graph)
  4. Seasonal Trends (sinusoid)
  5. Future Predictions (comparison table)
  6. Personalized Plan (action items)

## Development

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Run Development Server
```bash
uvicorn main:app --reload
```

### Environment Variables
Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/lifelens_db
OPENAI_API_KEY=sk-your-key-here
DEBUG=True
```

## Testing

Run tests with pytest:
```bash
pytest tests/
```

## Production

For production deployment:
1. Set `DEBUG=False`
2. Use production database
3. Enable HTTPS
4. Set up proper logging
5. Configure CORS properly
6. Use production-grade WSGI server (Gunicorn)

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

