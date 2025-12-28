# Goal Detail View Design

## Overview

The Goal Detail View is a unified hub for viewing and editing everything about a goal. Users can tap any goal card (from Dashboard or Today) to access full details, edit inline, and manage both weekly actions and milestones.

**Key principle:** Tap to edit anything, no mode switching.

---

## Layout Structure

```
┌─────────────────────────────────────────────┐
│  ← Back                                     │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────┐  Run a 5K              [trash]   │
│  │ 73%  │  "I am becoming a runner"         │
│  └──────┘                                   │
│                                             │
│  ○ ○ ● ●   Week history                     │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Weekly Actions                             │
│  ┌─────────────────────────────────────┐    │
│  │ Run 3 times              2/3   [×]  │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ Do interval training     0/1   [×]  │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ + Add action                        │    │
│  └─────────────────────────────────────┘    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  Milestones                                 │
│  ┌─────────────────────────────────────┐    │
│  │ ✓ Complete Couch-to-5K Week 4       │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ ○ Register for local 5K        [×]  │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ + Add milestone                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Header Section

**Content:**
- Back button (← Back)
- Progress ring with percentage
- Goal title (tappable to edit)
- Identity statement (tappable to edit)
- Delete button (trash icon)
- Week history dots

**Visual Style:**
- Title in `font-display`, large
- Identity in `text-secondary`, quoted
- Delete button in `text-disabled`, hover `accent-coral`

---

## Weekly Actions Section

**Each action row shows:**
- Action title (tappable to edit)
- Progress indicator (current/target, tappable to increment)
- Delete button (×)

**Add action:**
- "+ Add action" input at bottom
- Enter key or blur with content adds action
- New actions default to target: 1

---

## Milestones Section

**Each milestone row shows:**
- Checkbox (tappable to toggle complete)
- Milestone title (tappable to edit)
- Delete button (×)

**Completed milestones:**
- Show checkmark, muted text style
- Record `completedAt` timestamp

**Add milestone:**
- "+ Add milestone" input at bottom
- Enter key or blur with content adds milestone

---

## Inline Editing Behavior

**Title & Identity:**
- Tap → text input appears, auto-focused
- Blur or Enter → saves to store
- Empty identity → removes it (optional field)

**Actions:**
- Tap title → edit inline
- Tap progress → increment current (capped at target)
- Tap × → confirm dialog → delete

**Milestones:**
- Tap checkbox → toggle complete, set/clear `completedAt`
- Tap title → edit inline
- Tap × → confirm dialog → delete

**Delete Goal:**
- Tap trash icon → confirm: "Delete this goal and all its actions?"
- Confirmed → delete from store, return to previous view

---

## Navigation

**Access from:**
- Dashboard: tap DashboardGoalCard
- Today: tap GoalCard

**State management:**
```typescript
// App.tsx
const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
const [returnTo, setReturnTo] = useState<NavTab>('dashboard')

const handleSelectGoal = (goalId: string, from: NavTab) => {
  setSelectedGoalId(goalId)
  setReturnTo(from)
}

const handleBack = () => {
  setSelectedGoalId(null)
}

// Render logic
if (!hasCompletedOnboarding) {
  return <Onboarding />
}

if (selectedGoalId) {
  return <GoalDetail goalId={selectedGoalId} onBack={handleBack} />
}

// Normal tab rendering...
```

**Back behavior:**
- Returns to the tab user came from
- BottomNav not shown on Goal Detail (focused experience)

---

## Components

### New Components

| Component | Purpose |
|-----------|---------|
| `GoalDetail` | Main view: header, actions section, milestones section |
| `EditableText` | Tap-to-edit text field, saves on blur/enter |
| `ActionRow` | Action with editable title, tappable progress, delete |
| `MilestoneRow` | Milestone with checkbox, editable title, delete |
| `AddItemInput` | "+ Add action/milestone" inline input |

### Store Additions

```typescript
// New actions in useAppStore
addAction: (goalId: string, action: Action) => void
deleteAction: (goalId: string, actionId: string) => void
addMilestone: (goalId: string, milestone: Milestone) => void
updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void
deleteMilestone: (goalId: string, milestoneId: string) => void
```

### Modifications

| File | Change |
|------|--------|
| `App.tsx` | Add selectedGoalId/returnTo state, GoalDetail routing |
| `DashboardGoalCard` | Wire up onTap with goal ID |
| `GoalCard` | Add onTap prop, wire up for Today view |
| `useAppStore` | Add action/milestone CRUD operations |
| `types/index.ts` | Ensure Goal has optional milestones array |

---

## Data Flow

1. User taps goal card → App sets selectedGoalId
2. GoalDetail renders, reads goal from store by ID
3. User edits field → immediate update to store
4. Store persists to localStorage
5. User taps back → App clears selectedGoalId
6. Previous view re-renders with updated data

---

## Not in MVP

- Reordering actions/milestones
- Action target editing (always 1 for now)
- Archiving completed goals
- Goal duplication
- Milestone due dates
