# Weekly Review Design

## Overview

A 4-step weekly review flow optimized for 90-second completion. Helps users close out the week, see their score, and set up next week.

**Entry Points:**
- Push notification on review day (configurable, default Sunday 6pm)
- Contextual prompt card in Today view when week ends
- Always accessible via nav/settings

---

## The 4-Step Flow

```
┌─────────────────────────────────────────────┐
│  Step 1: Review This Week                   │
│  - Show each goal with its actions          │
│  - Checkboxes for incomplete items          │
│  - "Forgot to log it" catch-up opportunity  │
│  → "Next" button                            │
├─────────────────────────────────────────────┤
│  Step 2: Your Score                         │
│  - Big percentage number (e.g., "73%")      │
│  - Warm message based on score tier         │
│  - ProgressRing visual                      │
│  → "Continue" button                        │
├─────────────────────────────────────────────┤
│  Step 3: Plan Next Week                     │
│  - Pre-filled with recurring actions        │
│  - Toggle switch to skip any action         │
│  - "+ Add one-time action" option           │
│  → "Looks Good" button                      │
├─────────────────────────────────────────────┤
│  Step 4: Done                               │
│  - Celebration moment                       │
│  - "See you next week" message              │
│  → Returns to Today view                    │
└─────────────────────────────────────────────┘
```

**Progress indicator:** 4 dots at top showing current step.

---

## Step 1: Review This Week

**Layout:**
- Header: "Week 4 Review" with progress dots (● ○ ○ ○)
- Subheader: "Dec 22 – Dec 28" (week date range)

**Content:**
- Goals displayed as cards (similar to GoalCard but simplified)
- Each goal shows:
  - Goal title + identity statement (if set)
  - List of actions with checkboxes
  - Actions already logged show filled checkbox + count (e.g., "✓ Run 3x — 2/3")
  - Incomplete actions can be tapped to add completions now

**Interaction:**
- Tapping an incomplete action opens inline +/- controls
- This is the "forgot to log it" catch-up
- Changes save immediately (optimistic UI)

**Visual style:**
- Same dark surface cards as Today view
- Completed actions: amber checkmark, slightly muted text
- Incomplete actions: coral accent, full opacity
- Goal cards stack vertically, scroll if needed

**Bottom:**
- Fixed "Next" button (coral accent, full width)

---

## Step 2: Your Score

**Layout:**
- Header: "Week 4" with progress dots (● ● ○ ○)
- Centered, focused design

**Content:**
- Large ProgressRing (~120px diameter)
- Percentage inside the ring, bold: "73%"
- Below ring: warm message based on tier

**Scoring:**
- Simple percentage: total completed / total target across all actions
- Example: 8 of 11 actions = 73%

**Message Tiers:**

| Score | Message |
|-------|---------|
| 90-100% | "Exceptional week. You crushed it." |
| 75-89% | "Strong week. You showed up." |
| 50-74% | "Solid progress. Every action counts." |
| 25-49% | "Tough week — but you're still here." |
| 1-24% | "Not your week. Tomorrow's a fresh start." |
| 0% | "Life happens. Ready to reset?" |

**Secondary info:**
- "8 of 11 actions completed" (subtle, below message)

**Animation:**
- Ring fills up on enter
- Number counts up from 0 to final score

**Bottom:**
- "Continue" button (amber accent)

---

## Step 3: Plan Next Week

**Layout:**
- Header: "Next Week" with progress dots (● ● ● ○)
- Subheader: "Dec 29 – Jan 4" (upcoming week date range)

**Content:**
- List of actions pre-filled from recurring actions
- Each action shown as a row:
  - Action title
  - Target indicator (e.g., "3x")
  - Toggle switch on the right (on by default)
- Grouped by goal (goal title as section header)

**Interaction:**
- Toggle off = skip this action next week
- Shows subtle text: "Skipped for this week"
- Can toggle back on anytime before completing

**Add One-Time Action:**
- At bottom of each goal section: "+ Add action for this week"
- Tapping opens minimal inline form:
  - Text input for title
  - Optional target (defaults to 1)
  - "Add" button

**Visual Style:**
- Cards per goal (consistent with Step 1)
- Active actions: full opacity
- Skipped actions: 50% opacity, toggle off
- Add action link: text-secondary color, coral on hover

**Bottom:**
- "Looks Good" button (amber accent)

---

## Step 4: Done

**Layout:**
- Header: Progress dots all filled (● ● ● ●)
- Centered, minimal

**Content:**
- Celebration icon (checkmark in amber circle)
- Primary message: "You're all set for Week 5"
- Secondary message: "See you next week"

**Animation:**
- Icon scales in with spring animation
- Matches TodayFocus celebration pattern

**Bottom:**
- "Back to Today" button

**State Changes:**
- Week review marked complete
- Contextual prompt in Today view disappears
- Week history updates based on score

**Edge Case:**
- If user skipped all actions for next week: "Heads up — you've skipped all actions for next week. Sure?" with "Go Back" / "Continue Anyway"

---

## Today View Integration

**Review Prompt Card:**
- Appears at top of Today view when week has ended and review is pending
- Positioned above TodayFocus (highest priority)

```
┌─────────────────────────────────────────────┐
│  Week 4 ended                               │
│                                             │
│  Ready to review and plan next week?        │
│                                             │
│  [Review Now]              [Later]          │
└─────────────────────────────────────────────┘
```

- Coral accent border to draw attention
- "Review Now" button (coral, primary)
- "Later" dismisses for the session (returns next app open)
- After 3 days: "Week 4 still needs a review. Quick catch-up?"

**Notification:**
- Sent on configured day/time (default: Sunday 6pm)
- Title: "Ready to review Week 4?"
- Body: "Take 90 seconds to close out your week."
- Tapping opens app directly to Weekly Review flow

---

## Components

**Reusable (already built):**
- `Card` — container for goal sections
- `ProgressRing` — score visualization
- Celebration animation pattern from `TodayFocus`

**New Components:**

| Component | Purpose |
|-----------|---------|
| `ReviewPrompt` | "Week ended, review?" card for Today view |
| `StepIndicator` | 4 dots showing progress through flow |
| `ReviewActionItem` | Action row with checkbox + count for Step 1 |
| `PlanActionItem` | Action row with toggle switch for Step 3 |
| `ScoreDisplay` | Large ring + percentage + message |
| `AddActionInline` | Minimal form for one-time action |
| `WeeklyReview` | Parent view orchestrating the 4 steps |

---

## State Shape

```typescript
interface WeekReview {
  weekNumber: number
  weekStart: string  // ISO date
  score: number
  completedAt: string | null
  actionSnapshots: ActionSnapshot[]
  skippedActionIds: string[]
  addedActions: Action[]
}
```

---

## Not in MVP

- Deeper reflection prompts (V2)
- Week-over-week comparison charts (V2)
- Per-goal score breakdown (V2)
- Accountability partner sharing (V3)
