# Resolve - Goal Achievement App Design

## Overview

**Resolve** is a goal achievement app that combines the urgency of 12 Week Year cycles, the behavioral science of Atomic Habits, and ADHD-friendly design patterns.

### What It Is
- A goal tracker with structured cycles (flexible 4/8/12-week periods)
- Hierarchical: Identity → Cycle Goals → Weekly Actions + Milestones
- Weekly reviews with flexible depth
- Trend-focused progress (no streak shame)

### What It's NOT
- A daily habit tracker (no "drink water" checkboxes)
- A todo list or task manager
- A calendar or scheduling app

### Core Differentiator
Most goal apps are either too simple (just a list) or too complex (project management). Resolve sits in the middle - structured enough to drive accountability, simple enough to not become a burden. The 4 Laws of Behavior Change (obvious, attractive, easy, satisfying) inform every UX decision.

### Target Users
- People who set ambitious goals but struggle with follow-through
- Those who've tried habit apps but found them tedious or shame-inducing
- ADHD individuals who need structure without rigidity

---

## Information Architecture

### The Goal Hierarchy

```
Identity Statement (top level)
  "I am becoming someone who..."
  └── Cycle Goal (12-week target)
        "Run a 5K under 30 minutes"
        ├── Weekly Actions (repeating)
        │     "Run 3x this week"
        │     "Do one interval session"
        └── Milestones (one-time checkpoints)
              "Complete Couch-to-5K Week 4"
              "Register for local 5K"
```

### Identity Statements
- Optional but encouraged
- Frame goals as who you're becoming, not just what you're doing
- Example: "I am becoming a runner" vs just tracking runs

### Cycle Goals
- The main unit of planning
- Tied to a cycle (default 12 weeks, but 4/8 available)
- Measurable outcome with clear success criteria
- Users should have 2-4 per cycle (forced constraint to prevent overwhelm)

### Weekly Actions
- Concrete things to do THIS week
- Can be recurring ("Run 3x") or one-time ("Buy running shoes")
- Checked off throughout the week
- Rolled up into weekly score percentage

### Milestones
- One-time checkpoints toward the goal
- Not tied to specific weeks
- Help visualize progress on longer goals

---

## Core User Flows

### Onboarding (First-Time Setup)
1. Sign up (social or email)
2. Brief intro: "This isn't a habit tracker. You'll set 2-4 big goals for the next 12 weeks."
3. Choose cycle length (12 weeks recommended, 4/8 available)
4. Set cycle start date (defaults to next Monday)
5. Add first goal with guided prompts:
   - "What do you want to accomplish?"
   - "Why does this matter?" (optional, for reflection)
   - "What does success look like?" (measurable outcome)
   - Optional: Frame as identity ("I am becoming...")
6. Add 1-2 weekly actions for that goal
7. Repeat for additional goals (soft cap at 4, warn if more)
8. Set reminder preferences (daily check-in time, weekly review day)

### Daily Interaction (Designed for 30 Seconds)
- Open app → see today's relevant actions
- Tap to mark complete (single tap, no friction)
- Optional: quick note on any item
- Done. Close app.

### Weekly Review (Flexible Depth)
- **Quick mode:** Checkboxes for each action → auto-score → "Plan next week?" → pick actions → done (60-90 seconds)
- **Deeper mode:** Same plus reflection prompts ("What worked? What got in the way? What will you do differently?")

---

## ADHD-Friendly UX Principles

These principles inform every design decision:

### 1. Reduce Starting Friction Ruthlessly
- One-tap interactions wherever possible
- Default to "quick mode" for everything
- Pre-populate smart defaults (e.g., "3x this week" for recurring actions)
- Large touch targets, minimal scrolling
- No multi-step wizards for daily use

### 2. Prevent Forgetting with Gentle Nudges
- Scheduled push notifications (user-controlled timing)
- Weekly review reminder with escalation (reminder → "still time" → "week ended, quick catch-up?")
- Home screen widget showing today's focus (future PWA enhancement)
- Email summary option for those who check email more than apps

### 3. Avoid Shame and All-or-Nothing Traps
- No streaks, ever
- Show rolling trends: "73% over the last 4 weeks" not "you missed 2 days"
- Missed week? Prompt to "restart this week" with no judgment
- Language is curious, not critical ("What got in the way?" not "Why didn't you?")

### 4. Reduce Overwhelm Through Constraints
- Soft cap of 4 goals per cycle (warning if exceeded)
- Only show this week's actions on daily view
- Future weeks are planned but hidden until relevant
- "Focus mode" option: pick ONE goal to highlight

---

## Technical Architecture

### Frontend
- React 18 with TypeScript
- Vite for build tooling (fast, modern)
- TailwindCSS for styling (rapid iteration)
- PWA setup: service worker, manifest, offline support
- State: Zustand or React Query (lightweight, less boilerplate than Redux)

### Backend
- Node.js + Express API
- Supabase for:
  - PostgreSQL database
  - Authentication (email + Google/Apple)
  - Row-level security for user data isolation
  - Realtime subscriptions (for future social features)

### Notifications
- Web Push API for PWA notifications
- Supabase Edge Functions or separate cron job to trigger scheduled reminders
- Email via Resend or SendGrid for weekly summaries

### Hosting
- Frontend: Vercel or Netlify (free tier works for MVP)
- Backend: Railway, Render, or Fly.io
- Database: Supabase managed Postgres

### Offline Support
- Service worker caches app shell
- Local storage for pending action completions
- Sync when back online (optimistic UI)

---

## Data Model

### Core Tables

```sql
users
  id, email, name, avatar_url, created_at
  notification_preferences (jsonb)
  role ('free' | 'premium' | 'beta_tester' | 'admin')
  premium_until (timestamp, nullable)

cycles
  id, user_id, name, start_date, end_date
  duration_weeks (4, 8, or 12)
  status (active, completed, abandoned)

goals
  id, user_id, cycle_id
  title, description, success_criteria
  identity_statement (nullable)
  status (active, completed, abandoned)
  created_at

weekly_actions
  id, goal_id, user_id
  title, is_recurring
  target_count (nullable, e.g., "3x this week")
  created_at

action_completions
  id, weekly_action_id, user_id
  week_start_date (which week this belongs to)
  completed_count, notes
  completed_at

milestones
  id, goal_id, user_id
  title, completed, completed_at

weekly_reviews
  id, user_id, cycle_id
  week_start_date
  score_percentage
  reflection_notes (nullable)
  created_at
```

### Key Relationships
- User → many Cycles → many Goals → many Weekly Actions + Milestones
- Weekly Reviews tie to a specific week within a cycle
- Action completions are per-week instances of recurring actions

---

## Access Control & Subscription Management

### User Roles
- `free` - Default, access to free tier only
- `premium` - Paid subscriber, check `premium_until` for expiry
- `beta_tester` - Invited tester, full premium access, no payment required
- `admin` - Developer/team, full access + admin capabilities

### Feature Gating Logic
```javascript
function hasPremiumAccess(user) {
  if (user.role === 'admin' || user.role === 'beta_tester') {
    return true;
  }
  if (user.role === 'premium' && user.premium_until > Date.now()) {
    return true;
  }
  return false;
}
```

### Payment Integration (Future)
- Stripe Checkout for subscriptions
- Webhook updates `role` to `premium` and sets `premium_until`
- On expiry/cancellation, role reverts to `free`
- Promo codes via Stripe coupons for discounts

### Admin Capabilities (Future)
- View user stats (anonymized)
- Grant/revoke beta_tester role
- System health dashboard

---

## MVP vs Future Features

### MVP (Launch With)
- User auth (email + Google)
- Create/edit cycles with flexible duration
- Create goals with optional identity framing
- Add weekly actions (recurring + one-time)
- Milestones within goals
- Daily view: see and complete today's actions
- Weekly review: quick mode with auto-scoring
- Trend display: rolling 4-week completion percentage
- Scheduled push notifications (daily + weekly review)
- Basic mobile-responsive PWA (installable)
- Simple dashboard: current cycle overview, this week's focus
- Role-based access for dev/testers

### V2 (Post-Launch)
- Deeper weekly review with reflection prompts
- Email summaries
- Analytics: patterns over time, best days, goal completion rates
- Cycle retrospective (end-of-cycle review)

### V3 (Future)
- Accountability partners (invite someone to see your progress)
- Groups/communities
- Theming and customization
- Calendar integration
- Home screen widgets (when PWA support improves)
- Smart notification timing (learn from usage patterns)

---

## Freemium Model

### Free Tier
- 1 active cycle at a time
- Up to 3 goals per cycle
- Weekly actions + milestones
- Daily view + weekly review (quick mode)
- Trend tracking
- Push notifications
- Full PWA functionality

### Premium Tier ($6-8/month or $50-60/year)
- Unlimited active cycles (run personal + work cycles simultaneously)
- Up to 8 goals per cycle
- Deeper weekly review with reflection prompts + history
- Full analytics dashboard (patterns, trends over time, completion rates by goal type)
- Cycle retrospectives with insights
- Email summaries
- Priority support
- Early access to new features (accountability partners, etc.)

### Philosophy
Free tier is fully functional for someone with focused goals. Premium unlocks power-user features, analytics depth, and running multiple life areas in parallel.

---

## Design Principles Summary

1. **Reduce friction ruthlessly** - One-tap everything
2. **Prevent forgetting with gentle nudges** - Smart, scheduled reminders
3. **Avoid shame, show trends not streaks** - No punishment for misses
4. **Constrain to reduce overwhelm** - Less is more
