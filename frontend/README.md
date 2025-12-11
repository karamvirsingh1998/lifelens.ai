# LifeLens.ai Frontend

Modern, responsive Next.js frontend for emotional journey visualization with premium Apple Health-inspired design.

## Features

- Premium dark theme with glassmorphism effects
- Smooth animations with Framer Motion
- Interactive charts with Recharts
- Responsive design for mobile and desktop
- State management with Zustand
- TypeScript for type safety

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── onboarding/
│   │   └── page.tsx            # Onboarding flow
│   ├── events/
│   │   └── page.tsx            # Life events editor
│   ├── analyzing/
│   │   └── page.tsx            # Loading animation
│   └── results/
│       └── page.tsx            # Results with graphs
├── components/
│   ├── EventModal.tsx          # Event add/edit modal
│   ├── TimelineGraph.tsx       # Main timeline visualization
│   └── InsightCards.tsx        # 6 insight cards
├── lib/
│   ├── api.ts                  # API client
│   ├── store.ts                # Zustand state management
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Pages

### Landing Page (`/`)
- Hero section with animated background
- Feature highlights
- CTA button to start journey

### Onboarding (`/onboarding`)
- Name and date of birth input
- Validation and error handling
- Smooth transitions

### Events Editor (`/events`)
- Add/edit/delete life events
- Event modal with year, month, score slider
- Phase auto-calculation from score
- Events sorted chronologically

### Analyzing (`/analyzing`)
- Fullscreen loading animation
- Glowing line with animated dots
- Rotating text messages
- Smooth transition to results

### Results (`/results`)
- Hero heading (LLM-generated)
- Interactive timeline graph with:
  - Historical events (solid line)
  - Statistical predictions (blue dotted)
  - LLM predictions (purple dotted)
  - Clickable event nodes
- 6 insight cards with visualizations
- Personalized action plan

## Components

### TimelineGraph
- Dual-axis chart with Recharts
- Three data series (historical, statistical, LLM)
- Interactive tooltips
- Event detail modal on click
- Responsive design

### InsightCards
Six cards with unique visualizations:
1. **Trajectory**: Sparkline with average, peak, low
2. **Contributors**: Donut chart with phase distribution
3. **Patterns**: Pattern type and volatility metrics
4. **Seasonal**: Area chart showing monthly trends
5. **Predictions**: Comparison table (Math vs AI)
6. **Action Plan**: Personalized recommendations

### EventModal
- Add or edit events
- Year/month selectors
- Score slider (-10 to 10)
- Phase auto-update based on score
- Description textarea
- Validation

## Styling

### Theme
- Dark moody background (navy → violet → coral gradient)
- Glassmorphism cards
- Primary colors: indigo, violet, coral
- Smooth animations and transitions

### Custom Classes
```css
.glass - Glassmorphism effect
.glass-card - Glass card with hover effect
.btn-primary - Primary button style
.btn-secondary - Secondary button style
.input-field - Styled input field
```

### Animations
- Fade in
- Slide up
- Pulse slow
- Glow effect
- Loading shimmer

## State Management

### useUserStore
- userId, userName, userDob
- setUser, clearUser

### useEventsStore
- events array
- addEvent, updateEvent, removeEvent, setEvents, clearEvents

### useAnalysisStore
- analysis results
- setAnalysis, clearAnalysis

## API Integration

All API calls in `lib/api.ts`:
- `onboarding()` - Create user
- `saveEvents()` - Save life events
- `getEvents()` - Fetch user events
- `deleteEvent()` - Delete event
- `analyze()` - Generate analysis

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Responsive Design

The application is fully responsive:
- **Mobile (< 768px)**: Single column layout, touch-optimized
- **Tablet (768-1024px)**: 2-column grid for cards
- **Desktop (> 1024px)**: 3-column grid, optimized spacing

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Next.js 14 with App Router
- Client-side navigation
- Optimized bundle size
- Lazy loading for heavy components
- Efficient state updates

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

## Future Enhancements

- [ ] Export to PDF
- [ ] Social sharing
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Offline support with PWA
- [ ] Email reports
- [ ] Comparison with others (anonymized)

