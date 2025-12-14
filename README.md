# LifeLens.ai

A premium emotional journey analyzer that captures life events, visualizes emotional history, and predicts future trends using both statistical models and AI intuition.

## 🎯 Features

- **Life Events Tracking**: Capture and store significant life moments with emotional scores
- **Dual Predictions**: Compare statistical forecasts (ARIMA/Exponential Smoothing) with LLM-powered intuitive predictions
- **Premium Visualizations**: Interactive timeline graphs with solid lines for history and dashed lines for predictions
- **Deep AI Insights**: Personalized insights including pattern names, turning points, emotional cycles, and actionable recommendations
- **Responsive Design**: Optimized for both web and mobile experiences

## 🏗️ Architecture

```
lifelens.ai/
├── backend/          # FastAPI + SQLite
├── frontend/         # Next.js + React + TailwindCSS
└── docker-compose.yml
```

## 🚀 Setup & Installation

### Prerequisites

- Python 3.12+
- Node.js 18+ and Yarn
- OpenAI API Key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables:**
   
   Copy the example file and add your API key:
   ```bash
   cp .env.example .env
   # Then edit .env and add your OPENAI_API_KEY
   ```
   
   Or create a `.env` file manually:
   ```bash
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional (defaults shown)
   DATABASE_URL=sqlite:///./lifelens.db
   DEBUG=True
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```
   
   **Or export directly:**
   ```bash
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

5. **Run the backend:**
   ```bash
   uvicorn main:app --reload
   ```
   
   Backend will run on `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set environment variables (optional):**
   ```bash
   cp .env.local.example .env.local
   # Edit if you need to change the API URL
   ```

4. **Run the frontend:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

## 📊 API Endpoints

- `POST /api/onboarding` - Create user profile
- `POST /api/life-events` - Store life events
- `POST /api/analyze` - Generate predictions and insights
- `GET /api/events/{user_id}` - Retrieve user events

## 🗄️ Database

- Uses **SQLite** for local development
- Database file: `backend/lifelens.db` (auto-created)
- No manual database setup required

## 🔐 Environment Variables

### Backend (.env file)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `DATABASE_URL` | No | `sqlite:///./lifelens.db` | Database connection string |
| `DEBUG` | No | `True` | Enable debug mode |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000,http://localhost:3001` | CORS allowed origins |

### Frontend (.env.local file)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000/api` | Backend API URL |

## 🧪 Testing the Application

1. **Start both servers:**
   - Backend: `http://127.0.0.1:8000`
   - Frontend: `http://localhost:3000`

2. **Complete the flow:**
   - Enter date of birth → Continue
   - Enter name → Start Your Journey
   - Add 2-3 life events with emotional scores
   - Click "Analyze My Journey"
   - View personalized insights and predictions

3. **Check browser console (F12):**
   - Network tab should show API calls to `localhost:8000`
   - Console shows detailed logging of data flow

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: FastAPI, Python, SQLite
- **ML/AI**: OpenAI GPT-4, ARIMA, Exponential Smoothing
- **Database**: SQLite (local), PostgreSQL (production-ready)

## 🐛 Troubleshooting

### Backend Issues

**500 Internal Server Error:**
- Check backend terminal for detailed error logs
- Verify `OPENAI_API_KEY` is set correctly
- Ensure database file is not locked (restart backend)

**Database errors:**
- Delete `backend/lifelens.db` and restart (will auto-create)

### Frontend Issues

**API calls failing:**
- Verify backend is running on port 8000
- Check CORS settings in backend
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**localStorage errors:**
- These are normal during server-side rendering
- Should resolve automatically in browser

## 📝 Development Notes

- Backend uses hot reload (`--reload` flag)
- Frontend uses Next.js hot reload
- Database auto-creates on first run
- All sensitive data should be in `.env` files (never commit these!)

## 🚢 Production Deployment

For production:
1. Use PostgreSQL instead of SQLite
2. Set `DEBUG=False`
3. Configure proper CORS origins
4. Use environment variables from your hosting platform
5. Never commit `.env` files to git

## 📄 License

See LICENSE file for details.
