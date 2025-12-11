# LifeLens.ai Architecture

## System Overview

LifeLens.ai is a full-stack emotional journey analyzer built with a modern, scalable architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Next.js Frontend (React + TypeScript)         │   │
│  │  • Responsive UI with TailwindCSS                    │   │
│  │  • Framer Motion animations                          │   │
│  │  • Recharts visualizations                           │   │
│  │  • Zustand state management                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                       Application Layer                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              FastAPI Backend (Python)                │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │          API Routes Layer                    │   │   │
│  │  │  • /onboarding   • /events   • /analyze     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         Business Logic Services              │   │   │
│  │  │  • Prediction Service (ARIMA, ES, LR)       │   │   │
│  │  │  • LLM Service (OpenAI GPT-4)               │   │   │
│  │  │  • Insights Service (Analytics)             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ SQLAlchemy ORM
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                     │   │
│  │  • Users table                                       │   │
│  │  • LifeEvents table                                  │   │
│  │  • Analysis table                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ API Calls
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              OpenAI API (GPT-4)                      │   │
│  │  • Event description rephrasing                      │   │
│  │  • Intuitive predictions with reasoning              │   │
│  │  • Personalized insights generation                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Onboarding
```
User Input (Name, DOB)
    ↓
Frontend validates input
    ↓
POST /api/onboarding
    ↓
Backend creates User record
    ↓
Returns user_id
    ↓
Frontend stores in Zustand + localStorage
```

### 2. Life Events Entry
```
User adds/edits events
    ↓
Frontend stores temporarily in state
    ↓
User submits
    ↓
POST /api/life-events
    ↓
Backend saves to LifeEvents table
    ↓
Confirmation returned
```

### 3. Analysis Generation
```
User requests analysis
    ↓
POST /api/analyze
    ↓
Backend fetches all user events
    ↓
┌─────────────────────────────────┐
│  Statistical Prediction Service │
│  • ARIMA model                  │
│  • Exponential Smoothing        │
│  • Linear Regression            │
│  • Average predictions          │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│       LLM Service               │
│  • Build context prompt         │
│  • Call OpenAI GPT-4            │
│  • Parse JSON response          │
│  • Extract predictions +        │
│    rephrased descriptions +     │
│    personalized plan            │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│     Insights Service            │
│  • Generate 6 insight cards     │
│  • Calculate statistics         │
│  • Build visualizations data    │
└─────────────────────────────────┘
    ↓
Combine all results
    ↓
Save Analysis record
    ↓
Return complete analysis
    ↓
Frontend displays results
```

## Component Architecture

### Frontend Components

```
App
├── Layout
│   ├── Navigation
│   └── Footer
├── Pages
│   ├── Home (Landing)
│   ├── Onboarding
│   ├── Events
│   │   └── EventModal
│   ├── Analyzing (Loading)
│   └── Results
│       ├── TimelineGraph
│       └── InsightCards
└── Shared Components
    ├── Button
    ├── Input
    └── Modal
```

### Backend Structure

```
FastAPI App
├── Main Application
│   ├── CORS Middleware
│   ├── Lifespan Events
│   └── Router Registration
├── API Routes
│   ├── Onboarding Router
│   ├── Events Router
│   └── Analysis Router
├── Services
│   ├── Prediction Service
│   ├── LLM Service
│   └── Insights Service
└── Database
    ├── Models (SQLAlchemy)
    ├── Schemas (Pydantic)
    └── Connection Management
```

## Technology Choices

### Why Next.js?
- Server-side rendering for better SEO
- File-based routing
- API routes for future expansion
- Built-in optimization
- Great developer experience

### Why FastAPI?
- High performance (async support)
- Automatic API documentation
- Pydantic validation
- Type hints and modern Python
- Easy integration with ML libraries

### Why PostgreSQL?
- Reliable relational database
- ACID compliance
- JSON support for flexible schemas
- Wide ecosystem support
- Production-ready

### Why Recharts?
- Built for React
- Responsive by default
- Customizable
- Good performance
- Active maintenance

### Why Zustand?
- Simple API
- No boilerplate
- TypeScript support
- Persistence middleware
- Small bundle size

## Prediction Models

### Statistical Predictions ("What Math Says")

**1. ARIMA (AutoRegressive Integrated Moving Average)**
- Time series forecasting
- Captures trends and patterns
- Good for sequential data

**2. Exponential Smoothing**
- Weighted averages
- More recent data has more weight
- Handles trends well

**3. Linear Regression**
- Simple trend line
- Fallback for insufficient data
- Easy to interpret

**Result**: Average of all three models for robustness

### LLM Predictions ("What Intuition Says")

**Approach**: Contextual understanding
- Analyzes emotional patterns
- Considers life events narrative
- Provides reasoning for predictions
- More human-like interpretation

**Model**: OpenAI GPT-4
- Strong reasoning capabilities
- JSON mode for structured output
- Consistent formatting
- Fallback handling

## Scaling Considerations

### Current Architecture
- Monolithic (Backend + Frontend)
- Suitable for < 10,000 users
- Easy to develop and deploy

### Future Scaling Options

**1. Microservices**
```
API Gateway
├── User Service
├── Events Service
├── Analysis Service
├── Prediction Service
└── LLM Service
```

**2. Caching Layer**
- Redis for session data
- Cache analysis results
- Reduce database load

**3. Database Optimization**
- Read replicas
- Connection pooling
- Indexing strategies
- Partitioning by user_id

**4. Frontend Optimization**
- CDN for static assets
- Edge caching
- Progressive loading
- Service workers

**5. Background Jobs**
- Celery for async tasks
- Queue analysis requests
- Batch processing
- Scheduled insights

## Security

### Current Measures
- Input validation (Pydantic)
- CORS configuration
- No authentication (MVP)
- PostgreSQL injection prevention

### Production Requirements
- JWT authentication
- Rate limiting
- HTTPS only
- API key management
- User data encryption
- GDPR compliance
- Audit logging

## Monitoring & Observability

### Recommended Tools
- **Logging**: Structured logging with context
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Error Tracking**: Sentry
- **Uptime**: Pingdom / UptimeRobot

### Key Metrics
- API response times
- Database query performance
- LLM API latency
- Error rates
- User journey completion rates

## Deployment

### Development
```
Docker Compose
├── PostgreSQL container
├── Backend container
└── Frontend container
```

### Production Options

**1. Cloud Platform (AWS/GCP/Azure)**
```
├── RDS/CloudSQL (Database)
├── ECS/Cloud Run (Backend)
├── Vercel/Netlify (Frontend)
└── S3/Cloud Storage (Static assets)
```

**2. Kubernetes**
```
├── PostgreSQL StatefulSet
├── Backend Deployment
├── Frontend Deployment
└── Ingress Controller
```

**3. Platform as a Service**
- Heroku
- Railway
- Render

## Future Enhancements

### Phase 2
- User authentication
- Data export (PDF/CSV)
- Social sharing
- Email reports

### Phase 3
- Mobile app (React Native)
- Collaborative journaling
- Group insights
- Therapist integration

### Phase 4
- Machine learning improvements
- Custom prediction models per user
- Real-time insights
- Voice journaling
- Wearable integration

## Performance Targets

| Metric | Target |
|--------|--------|
| Homepage load | < 2s |
| API response time | < 500ms |
| Analysis generation | < 10s |
| Database queries | < 100ms |
| LLM API call | < 5s |

## Conclusion

LifeLens.ai is built with a modern, scalable architecture that balances simplicity with future growth potential. The monorepo structure makes it easy to develop and deploy, while the clear separation of concerns allows for future microservices migration if needed.

