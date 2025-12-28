# Onboarding & Setup Flow Design

## Overview

The onboarding flow guides first-time users from app launch to a populated Dashboard with their cycle and goals. It stores data locally using Zustand with localStorage persistence, ready for backend integration later.

**Key principle:** Minimal friction, smart defaults, all context visible.

---

## Flow Structure

```
[Welcome] → [Cycle Setup] → [Goal Creation] → [Dashboard]
     ↓            ↓              ↓
  "Get Started"  "Looks good"   "Done" or
                               "Add another"
```

4 screens total. No auth, no reminders for MVP.

---

## Screen 1: Welcome

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│        Set 2-4 big goals                    │
│        for the next 12 weeks                │
│                                             │
│   Not habits. Not tasks.                    │
│   Meaningful goals with weekly actions.     │
│                                             │
│                                             │
│            [ Get Started ]                  │
│                                             │
└─────────────────────────────────────────────┘
```

**Content:**
- Headline sets expectations (goals, not habits)
- Subtext reinforces the weekly action model
- Single CTA button

**Visual Style:**
- Centered content, generous whitespace
- `font-display` for headline
- `accent-amber` for button

---

## Screen 2: Cycle Setup

```
┌─────────────────────────────────────────────┐
│  ← Back                                     │
├─────────────────────────────────────────────┤
│                                             │
│  Your 12-Week Cycle                         │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Q1 2025 Goals                        │  │
│  │  Jan 6 – Mar 30 • 12 weeks            │  │
│  │                                       │  │
│  │  [Change]                             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  (Expanded when "Change" tapped:)           │
│  ┌───────────────────────────────────────┐  │
│  │  Duration: [4] [8] [12•] weeks        │  │
│  │  Start: [Jan 6, 2025      ▼]          │  │
│  └───────────────────────────────────────┘  │
│                                             │
│           [ Looks Good ]                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Smart Defaults:**
- Duration: 12 weeks (recommended by 12 Week Year)
- Start date: Next Monday
- Name: Auto-generated from quarter/dates (e.g., "Q1 2025 Goals")

**Behavior:**
- "Change" reveals duration picker and date picker
- Name updates automatically when dates change
- "Looks Good" proceeds to goal creation

---

## Screen 3: Goal Creation

### Empty State (first goal)

```
┌─────────────────────────────────────────────┐
│  ← Back                                     │
├─────────────────────────────────────────────┤
│                                             │
│  Add Your First Goal                        │
│  Q1 2025 • 12 weeks                         │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │  What's your goal?                    │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │                                 │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │                                       │  │
│  │  Who are you becoming? (optional)     │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │ I am becoming...                │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │                                       │  │
│  │  ───────────────────────────────────  │  │
│  │                                       │  │
│  │  Weekly Actions                       │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │ + Add action                    │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │                                       │  │
│  │           [ Save Goal ]               │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### With Actions Added

```
│  Weekly Actions                       │
│  ┌─────────────────────────────────┐  │
│  │ Run 3 times                 [×] │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ Do one interval session     [×] │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ + Add action                    │  │
│  └─────────────────────────────────┘  │
```

**Fields:**
- Goal title (required)
- Identity statement (optional, placeholder: "I am becoming...")
- Weekly actions (recommended, not required)

**Behavior:**
- Actions are simple text for MVP (no target count)
- Remove action with × button
- Save adds goal to list, shows goals summary

---

## Screen 3b: Goals List (after first goal saved)

```
┌─────────────────────────────────────────────┐
│  ← Back                                     │
├─────────────────────────────────────────────┤
│                                             │
│  Your Goals                                 │
│  Q1 2025 • 12 weeks starting Jan 6          │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ ✓ Run a 5K                       [✎]  │  │
│  │   "I am becoming a runner"            │  │
│  │   2 weekly actions                    │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ ✓ Financial clarity              [✎]  │  │
│  │   "I am becoming financially literate"│  │
│  │   1 weekly action                     │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │       + Add another goal              │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  💡 2 goals set. Most people do best       │
│     with 2-4 goals per cycle.              │
│                                             │
│         [ Start Your Cycle ]               │
│                                             │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Edit button (✎) returns to goal form with data populated
- "Add another goal" opens fresh goal form
- Advisory message at 4+ goals (not blocking)
- "Start Your Cycle" requires minimum 1 goal
- Completes onboarding, navigates to Dashboard

---

## Data Store

### Zustand Store Structure

```typescript
interface AppStore {
  // Onboarding state
  hasCompletedOnboarding: boolean

  // Cycle (one active at a time for MVP)
  cycle: Cycle | null

  // Goals with embedded actions
  goals: Goal[]

  // Weekly reviews
  weekReviews: WeekReview[]

  // Actions
  setCycle: (cycle: Cycle) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateAction: (goalId: string, actionId: string, updates: Partial<Action>) => void
  completeOnboarding: () => void
  resetOnboarding: () => void  // For testing/dev
}
```

### Persistence

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      cycle: null,
      goals: [],
      weekReviews: [],
      // ... actions
    }),
    { name: 'resolve-storage' }
  )
)
```

### App Entry Logic

```typescript
// App.tsx
function App() {
  const { hasCompletedOnboarding } = useAppStore()

  if (!hasCompletedOnboarding) {
    return <Onboarding />
  }

  // Existing tab navigation
  return (
    <>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'today' && <Today />}
      {activeTab === 'settings' && <Settings />}
      <BottomNav ... />
    </>
  )
}
```

---

## Components

### New Components

| Component | Purpose |
|-----------|---------|
| `WelcomeScreen` | Intro headline with "Get Started" button |
| `CycleSetup` | Smart defaults card, expandable options |
| `GoalForm` | Form card with title, identity, actions |
| `GoalsList` | Summary of created goals with edit/complete |
| `ActionInput` | Text input with remove button for actions |

### New View

| View | Purpose |
|------|---------|
| `Onboarding` | Multi-step flow container with step state |

### Store

| File | Purpose |
|------|---------|
| `src/store/useAppStore.ts` | Zustand store with localStorage persistence |

### Modifications

| File | Change |
|------|--------|
| `App.tsx` | Check `hasCompletedOnboarding`, route to Onboarding or main app |
| `Dashboard` | Read cycle/goals from store instead of mock data |
| `Today` | Read goals/actions from store instead of mock data |

---

## Not in This MVP

- User authentication
- Reminder/notification preferences
- Target counts on actions (just text for now)
- Milestones during onboarding (add later via goal detail)
- Cycle name editing (auto-generated only)
- Backend API integration

---

## Navigation Flow

```
App Launch
    ↓
hasCompletedOnboarding?
    ↓ No              ↓ Yes
Onboarding         Dashboard
    ↓                  ↓
Welcome            (normal app)
    ↓
Cycle Setup
    ↓
Goal Form ←→ Goals List
    ↓
"Start Your Cycle"
    ↓
Dashboard (with real data)
```
