# Dashboard Design

## Overview

The Dashboard is the app's "home base" showing cycle progress and all goals at a glance. Users land here to see the big picture, then navigate to Today for daily actions.

**Key principle:** Dashboard = overview, Today = action.

---

## Layout Structure

```
┌─────────────────────────────────────────────┐
│  [Cycle Progress Header]                    │
│  Week 4 of 12 • 56 days remaining           │
│  ████████░░░░░░░░░░░░░░░░ 33%               │
├─────────────────────────────────────────────┤
│                                             │
│  [Goal Card 1]                              │
│  [Goal Card 2]                              │
│  [Goal Card 3]                              │
│  ...scrollable...                           │
│                                             │
├─────────────────────────────────────────────┤
│  [Dashboard]    [Today]    [Settings]       │
│     ●             ○           ○             │
└─────────────────────────────────────────────┘
```

---

## Cycle Progress Header

```
┌─────────────────────────────────────────────┐
│  Q1 2025 Goals                              │
│  Week 4 of 12 • 56 days remaining           │
│                                             │
│  ████████████░░░░░░░░░░░░░░░░░░░░ 33%       │
│  Jan 6 ─────────────────────────── Mar 30   │
└─────────────────────────────────────────────┘
```

**Content:**
- Cycle name (user-defined or auto-generated)
- Week indicator: "Week 4 of 12"
- Days remaining countdown
- Progress bar showing time elapsed (not completion)
- Start and end date range

**Visual Style:**
- Dark surface card (`bg-bg-surface`)
- Week number in `font-display` (Outfit), bold
- Progress bar: `accent-amber` for filled, `bg-bg-base` for empty
- Dates in `text-secondary`, smaller text

---

## Dashboard Goal Cards

Adapted from existing GoalCard, optimized for Dashboard context:

```
┌─────────────────────────────────────────────┐
│  ┌──────┐                                   │
│  │  73% │  Get Fit                          │
│  │  ○   │  "I am becoming a runner"         │
│  └──────┘                                   │
│                                             │
│  ○ ○ ● ●   Week history                     │
│                                             │
│  ✓ Complete Couch-to-5K Week 4              │
│  → Next: Register for local 5K              │
└─────────────────────────────────────────────┘
```

**Differences from Today view GoalCard:**
- No action list (actions live in Today view)
- Milestones shown (completed + next upcoming)
- Slightly more breathing room
- Tappable for future goal detail view

**Content per card:**
- Progress ring with percentage
- Goal title + identity statement
- WeekDots (last 4 weeks history)
- Milestone section: recent completed (✓) + next (→)

**Visual Style:**
- `bg-bg-surface` card with hover state
- Milestones in smaller text, `text-secondary`
- Completed milestone: `accent-amber` checkmark
- Next milestone: `accent-coral` arrow

---

## Bottom Tab Bar

```
┌─────────────────────────────────────────────┐
│   [Dashboard]      [Today]      [Settings]  │
│      🏠              ✓             ⚙        │
│      ●               ○             ○        │
└─────────────────────────────────────────────┘
```

**Tabs:**

| Tab | Icon | Destination |
|-----|------|-------------|
| Dashboard | Home/grid | Cycle overview |
| Today | Checkmark | Daily actions view |
| Settings | Gear | User preferences (stub) |

**Behavior:**
- Fixed at bottom, always visible
- Active tab: `accent-amber` icon + dot indicator
- Inactive tabs: `text-secondary`
- Tap switches view instantly

**Visual Style:**
- Background: `bg-bg-surface`
- Height: ~60px with safe area padding
- Icons: 24px, line style
- Labels: 12px, optional on small screens

---

## Components

**Reusable (already built):**
- `ProgressRing` — goal percentage
- `WeekDots` — week history
- `Card` — container styling

**New Components:**

| Component | Purpose |
|-----------|---------|
| `CycleHeader` | Cycle name, week indicator, progress bar |
| `DashboardGoalCard` | Goal card with milestones, no actions |
| `MilestoneItem` | Completed/upcoming milestone row |
| `BottomNav` | Tab bar navigation |
| `Dashboard` | Parent view |

---

## Data Types

```typescript
interface Cycle {
  id: string
  name: string
  startDate: string
  endDate: string
  durationWeeks: number
  status: 'active' | 'completed' | 'abandoned'
}

interface Milestone {
  id: string
  goalId: string
  title: string
  completed: boolean
  completedAt: string | null
}
```

---

## Navigation Flow

- App opens to Dashboard (new default)
- Bottom tabs switch between Dashboard/Today/Settings
- ReviewPrompt appears on Dashboard when week review is pending
- Goal cards tappable (future: goal detail view)

---

## Not in MVP

- Goal detail view
- Cycle editing
- Settings content (stub page only)
- Analytics/trends section
- Filtered Today view by goal
