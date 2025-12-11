# LifeLens.ai

A premium emotional journey analyzer that captures life events, visualizes emotional history, and predicts future trends using both statistical models and AI intuition.

## 🎯 Features

- **Life Events Tracking**: Capture and store significant life moments with emotional scores
- **Dual Predictions**: Compare statistical forecasts with LLM-powered intuitive predictions
- **Premium Visualizations**: Interactive timeline graphs with Apple Health-inspired design
- **AI Insights**: Six dynamic insight cards analyzing patterns, trends, and personalized recommendations
- **Responsive Design**: Optimized for both web and mobile experiences

## 🏗️ Architecture

```
lifelens.ai/
├── backend/          # FastAPI + PostgreSQL
├── frontend/         # Next.js + React + TailwindCSS
└── docker/           # Docker configuration
```

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion, Recharts
- **Backend**: FastAPI, Python, PostgreSQL
- **ML/AI**: OpenAI API, ARIMA, Exponential Smoothing
- **DevOps**: Docker, GitHub Actions

## 📊 API Endpoints

- `POST /onboarding` - Create user profile
- `POST /life-events` - Store life events
- `POST /analyze` - Generate predictions and insights
- `GET /events/{user_id}` - Retrieve user events

## 🎨 Design Philosophy

Dark moody theme with glassmorphism effects, smooth animations, and premium user experience inspired by Apple Health.

