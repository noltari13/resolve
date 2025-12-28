# Onboarding & Setup Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete onboarding flow that guides users from app launch through cycle setup and goal creation, storing data in Zustand with localStorage persistence.

**Architecture:** Zustand store manages app state with localStorage persistence. App.tsx checks `hasCompletedOnboarding` to route between Onboarding view and main app. Onboarding is a multi-step flow with internal state. Dashboard and Today views read from the store instead of mock data.

**Tech Stack:** React 18, TypeScript, Zustand (with persist middleware), Tailwind CSS

---

## Task 1: Install Zustand

**Files:**
- Modify: `package.json`

**Step 1: Install zustand**

Run: `npm install zustand`

**Step 2: Verify installation**

Run: `npm ls zustand`
Expected: Shows zustand version installed

**Step 3: Commit**

Run: `git add package.json package-lock.json && git commit -m "chore: add zustand for state management"`

---

## Task 2: Create App Store

**Files:**
- Create: `src/store/useAppStore.ts`

**Step 1: Create the store**

Create `src/store/useAppStore.ts`:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cycle, Goal } from '../types'

interface AppState {
  // Onboarding
  hasCompletedOnboarding: boolean

  // Data
  cycle: Cycle | null
  goals: Goal[]

  // Actions
  setCycle: (cycle: Cycle) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateAction: (goalId: string, actionId: string, current: number) => void
  completeOnboarding: () => void
  resetStore: () => void
}

const initialState = {
  hasCompletedOnboarding: false,
  cycle: null,
  goals: [],
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setCycle: (cycle) => set({ cycle }),

      addGoal: (goal) =>
        set((state) => ({ goals: [...state.goals, goal] })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      updateAction: (goalId, actionId, current) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal
            const updatedActions = goal.actions.map((action) =>
              action.id === actionId ? { ...action, current } : action
            )
            const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
            const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
            const percentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
            return { ...goal, actions: updatedActions, percentage }
          }),
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      resetStore: () => set(initialState),
    }),
    { name: 'resolve-storage' }
  )
)
```

**Step 2: Verify build passes**

Run: `npm run build`

**Step 3: Commit**

Run: `git add src/store && git commit -m "feat: add Zustand app store with persistence"`

---

## Task 3: Create WelcomeScreen Component

**Files:**
- Create: `src/components/WelcomeScreen/WelcomeScreen.tsx`
- Create: `src/components/WelcomeScreen/WelcomeScreen.stories.tsx`
- Create: `src/components/WelcomeScreen/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/WelcomeScreen/WelcomeScreen.tsx`:

```tsx
interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Set 2-4 big goals
          <br />
          for the next 12 weeks
        </h1>
        <p className="text-text-secondary mt-4 text-lg">
          Not habits. Not tasks.
          <br />
          Meaningful goals with weekly actions.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-8 w-full bg-accent-amber text-bg-base font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-accent-amber/90"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Create barrel export**

Create `src/components/WelcomeScreen/index.ts`:

```typescript
export { WelcomeScreen } from './WelcomeScreen'
```

**Step 3: Create stories**

Create `src/components/WelcomeScreen/WelcomeScreen.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { WelcomeScreen } from './WelcomeScreen'

const meta: Meta<typeof WelcomeScreen> = {
  title: 'Onboarding/WelcomeScreen',
  component: WelcomeScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof WelcomeScreen>

export const Default: Story = {
  args: {
    onGetStarted: () => console.log('Get started clicked'),
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { WelcomeScreen } from './WelcomeScreen'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/WelcomeScreen src/components/index.ts && git commit -m "feat: add WelcomeScreen component"`

---

## Task 4: Create CycleSetup Component

**Files:**
- Create: `src/components/CycleSetup/CycleSetup.tsx`
- Create: `src/components/CycleSetup/CycleSetup.stories.tsx`
- Create: `src/components/CycleSetup/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/CycleSetup/CycleSetup.tsx`:

```tsx
import { useState, useMemo } from 'react'
import type { Cycle } from '../../types'

interface CycleSetupProps {
  onComplete: (cycle: Cycle) => void
  onBack: () => void
}

function getNextMonday(): Date {
  const today = new Date()
  const day = today.getDay()
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + daysUntilMonday)
  nextMonday.setHours(0, 0, 0, 0)
  return nextMonday
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getCycleName(startDate: string): string {
  const date = new Date(startDate + 'T00:00:00')
  const quarter = Math.ceil((date.getMonth() + 1) / 3)
  const year = date.getFullYear()
  return `Q${quarter} ${year} Goals`
}

function getEndDate(startDate: string, weeks: number): string {
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(start)
  end.setDate(start.getDate() + weeks * 7 - 1)
  return formatDateForInput(end)
}

export function CycleSetup({ onComplete, onBack }: CycleSetupProps) {
  const defaultStart = formatDateForInput(getNextMonday())
  const [durationWeeks, setDurationWeeks] = useState(12)
  const [startDate, setStartDate] = useState(defaultStart)
  const [showOptions, setShowOptions] = useState(false)

  const endDate = useMemo(() => getEndDate(startDate, durationWeeks), [startDate, durationWeeks])
  const cycleName = useMemo(() => getCycleName(startDate), [startDate])

  const handleComplete = () => {
    const cycle: Cycle = {
      id: crypto.randomUUID(),
      name: cycleName,
      startDate,
      endDate,
      durationWeeks,
      currentWeek: 1,
      status: 'active',
    }
    onComplete(cycle)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <button
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back
        </button>

        <h1 className="font-display font-bold text-2xl text-text-primary mt-6">
          Your {durationWeeks}-Week Cycle
        </h1>

        {/* Cycle Card */}
        <div className="bg-bg-surface rounded-card p-4 mt-6">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            {cycleName}
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {formatDateDisplay(startDate)} – {formatDateDisplay(endDate)} • {durationWeeks} weeks
          </p>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-accent-amber text-sm mt-3 hover:underline"
          >
            {showOptions ? 'Hide options' : 'Change'}
          </button>

          {showOptions && (
            <div className="mt-4 pt-4 border-t border-text-disabled/20 space-y-4">
              {/* Duration picker */}
              <div>
                <label className="text-text-secondary text-sm">Duration</label>
                <div className="flex gap-2 mt-2">
                  {[4, 8, 12].map((weeks) => (
                    <button
                      key={weeks}
                      onClick={() => setDurationWeeks(weeks)}
                      className={`
                        flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                        ${durationWeeks === weeks
                          ? 'bg-accent-amber text-bg-base'
                          : 'bg-bg-base text-text-secondary hover:text-text-primary'
                        }
                      `}
                    >
                      {weeks} weeks
                    </button>
                  ))}
                </div>
              </div>

              {/* Start date picker */}
              <div>
                <label className="text-text-secondary text-sm">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber"
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleComplete}
          className="mt-8 w-full bg-accent-amber text-bg-base font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-accent-amber/90"
        >
          Looks Good
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Create barrel export**

Create `src/components/CycleSetup/index.ts`:

```typescript
export { CycleSetup } from './CycleSetup'
```

**Step 3: Create stories**

Create `src/components/CycleSetup/CycleSetup.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CycleSetup } from './CycleSetup'

const meta: Meta<typeof CycleSetup> = {
  title: 'Onboarding/CycleSetup',
  component: CycleSetup,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof CycleSetup>

export const Default: Story = {
  args: {
    onComplete: (cycle) => console.log('Cycle created:', cycle),
    onBack: () => console.log('Back clicked'),
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { CycleSetup } from './CycleSetup'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/CycleSetup src/components/index.ts && git commit -m "feat: add CycleSetup component"`

---

## Task 5: Create GoalForm Component

**Files:**
- Create: `src/components/GoalForm/GoalForm.tsx`
- Create: `src/components/GoalForm/GoalForm.stories.tsx`
- Create: `src/components/GoalForm/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/GoalForm/GoalForm.tsx`:

```tsx
import { useState } from 'react'
import type { Goal, Action } from '../../types'

interface GoalFormProps {
  goalNumber: number
  initialGoal?: Goal
  onSave: (goal: Goal) => void
  onCancel: () => void
}

export function GoalForm({ goalNumber, initialGoal, onSave, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(initialGoal?.title ?? '')
  const [identityStatement, setIdentityStatement] = useState(initialGoal?.identityStatement ?? '')
  const [actions, setActions] = useState<Action[]>(initialGoal?.actions ?? [])
  const [newAction, setNewAction] = useState('')

  const handleAddAction = () => {
    if (!newAction.trim()) return
    const action: Action = {
      id: crypto.randomUUID(),
      title: newAction.trim(),
      current: 0,
      target: 1,
    }
    setActions([...actions, action])
    setNewAction('')
  }

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id))
  }

  const handleSave = () => {
    if (!title.trim()) return
    const goal: Goal = {
      id: initialGoal?.id ?? crypto.randomUUID(),
      title: title.trim(),
      identityStatement: identityStatement.trim() || undefined,
      percentage: 0,
      weekHistory: [],
      actions,
    }
    onSave(goal)
  }

  const isValid = title.trim().length > 0

  return (
    <div className="bg-bg-surface rounded-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-secondary text-sm">Goal {goalNumber}</span>
        <button
          onClick={onCancel}
          className="text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="text-text-secondary text-sm">What's your goal?</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Run a 5K"
          className="mt-2 w-full bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber placeholder:text-text-disabled"
        />
      </div>

      {/* Identity Statement */}
      <div className="mt-4">
        <label className="text-text-secondary text-sm">Who are you becoming? (optional)</label>
        <input
          type="text"
          value={identityStatement}
          onChange={(e) => setIdentityStatement(e.target.value)}
          placeholder="I am becoming a runner"
          className="mt-2 w-full bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber placeholder:text-text-disabled"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-text-disabled/20 my-4" />

      {/* Weekly Actions */}
      <div>
        <label className="text-text-secondary text-sm">Weekly Actions</label>

        <div className="mt-2 space-y-2">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center gap-2 bg-bg-base rounded-lg px-3 py-2"
            >
              <span className="flex-1 text-text-primary text-sm truncate">
                {action.title}
              </span>
              <button
                onClick={() => handleRemoveAction(action.id)}
                className="text-text-disabled hover:text-accent-coral transition-colors"
                aria-label={`Remove ${action.title}`}
              >
                ×
              </button>
            </div>
          ))}

          {/* Add action input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
              placeholder="+ Add action"
              className="flex-1 bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber placeholder:text-text-disabled text-sm"
            />
            {newAction.trim() && (
              <button
                onClick={handleAddAction}
                className="bg-accent-amber text-bg-base px-3 py-2 rounded-lg text-sm font-medium"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!isValid}
        className={`
          mt-6 w-full font-semibold py-3 px-6 rounded-lg transition-colors
          ${isValid
            ? 'bg-accent-amber text-bg-base hover:bg-accent-amber/90'
            : 'bg-text-disabled/20 text-text-disabled cursor-not-allowed'
          }
        `}
      >
        Save Goal
      </button>
    </div>
  )
}
```

**Step 2: Create barrel export**

Create `src/components/GoalForm/index.ts`:

```typescript
export { GoalForm } from './GoalForm'
```

**Step 3: Create stories**

Create `src/components/GoalForm/GoalForm.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GoalForm } from './GoalForm'

const meta: Meta<typeof GoalForm> = {
  title: 'Onboarding/GoalForm',
  component: GoalForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GoalForm>

export const Empty: Story = {
  args: {
    goalNumber: 1,
    onSave: (goal) => console.log('Saved:', goal),
    onCancel: () => console.log('Cancelled'),
  },
}

export const Editing: Story = {
  args: {
    goalNumber: 1,
    initialGoal: {
      id: 'g1',
      title: 'Run a 5K',
      identityStatement: 'I am becoming a runner',
      percentage: 0,
      weekHistory: [],
      actions: [
        { id: 'a1', title: 'Run 3 times', current: 0, target: 1 },
        { id: 'a2', title: 'Do interval training', current: 0, target: 1 },
      ],
    },
    onSave: (goal) => console.log('Saved:', goal),
    onCancel: () => console.log('Cancelled'),
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { GoalForm } from './GoalForm'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/GoalForm src/components/index.ts && git commit -m "feat: add GoalForm component"`

---

## Task 6: Create GoalsList Component

**Files:**
- Create: `src/components/GoalsList/GoalsList.tsx`
- Create: `src/components/GoalsList/GoalsList.stories.tsx`
- Create: `src/components/GoalsList/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/GoalsList/GoalsList.tsx`:

```tsx
import type { Goal } from '../../types'

interface GoalsListProps {
  cycleName: string
  cycleInfo: string
  goals: Goal[]
  onEditGoal: (goal: Goal) => void
  onAddGoal: () => void
  onComplete: () => void
}

export function GoalsList({
  cycleName,
  cycleInfo,
  goals,
  onEditGoal,
  onAddGoal,
  onComplete,
}: GoalsListProps) {
  const canComplete = goals.length > 0

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Your Goals
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {cycleName} • {cycleInfo}
        </p>

        {/* Goals */}
        <div className="mt-6 space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-bg-surface rounded-card p-4 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-accent-amber/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-accent-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary truncate">
                  {goal.title}
                </h3>
                {goal.identityStatement && (
                  <p className="text-text-secondary text-sm truncate">
                    "{goal.identityStatement}"
                  </p>
                )}
                <p className="text-text-disabled text-xs mt-1">
                  {goal.actions.length} weekly action{goal.actions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => onEditGoal(goal)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
                aria-label={`Edit ${goal.title}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          ))}

          {/* Add Goal Button */}
          <button
            onClick={onAddGoal}
            className="w-full bg-bg-surface rounded-card p-4 text-text-secondary hover:text-text-primary hover:bg-bg-surface/80 transition-colors text-center"
          >
            + Add another goal
          </button>
        </div>

        {/* Advisory */}
        <p className="text-text-secondary text-sm mt-6 text-center">
          {goals.length === 0 && '👆 Add at least one goal to continue'}
          {goals.length >= 1 && goals.length <= 3 && `💡 ${goals.length} goal${goals.length !== 1 ? 's' : ''} set. Most people do best with 2-4 goals per cycle.`}
          {goals.length >= 4 && `⚠️ ${goals.length} goals set. Consider focusing on fewer for better results.`}
        </p>

        {/* Complete Button */}
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`
            mt-6 w-full font-semibold py-3 px-6 rounded-lg transition-colors
            ${canComplete
              ? 'bg-accent-amber text-bg-base hover:bg-accent-amber/90'
              : 'bg-text-disabled/20 text-text-disabled cursor-not-allowed'
            }
          `}
        >
          Start Your Cycle
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Create barrel export**

Create `src/components/GoalsList/index.ts`:

```typescript
export { GoalsList } from './GoalsList'
```

**Step 3: Create stories**

Create `src/components/GoalsList/GoalsList.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GoalsList } from './GoalsList'

const meta: Meta<typeof GoalsList> = {
  title: 'Onboarding/GoalsList',
  component: GoalsList,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof GoalsList>

export const Empty: Story = {
  args: {
    cycleName: 'Q1 2025 Goals',
    cycleInfo: '12 weeks starting Jan 6',
    goals: [],
    onEditGoal: () => {},
    onAddGoal: () => console.log('Add goal'),
    onComplete: () => {},
  },
}

export const WithGoals: Story = {
  args: {
    cycleName: 'Q1 2025 Goals',
    cycleInfo: '12 weeks starting Jan 6',
    goals: [
      {
        id: 'g1',
        title: 'Run a 5K',
        identityStatement: 'I am becoming a runner',
        percentage: 0,
        weekHistory: [],
        actions: [
          { id: 'a1', title: 'Run 3 times', current: 0, target: 1 },
          { id: 'a2', title: 'Do interval training', current: 0, target: 1 },
        ],
      },
      {
        id: 'g2',
        title: 'Financial clarity',
        identityStatement: 'I am becoming financially literate',
        percentage: 0,
        weekHistory: [],
        actions: [
          { id: 'a3', title: 'Review budget weekly', current: 0, target: 1 },
        ],
      },
    ],
    onEditGoal: (goal) => console.log('Edit:', goal),
    onAddGoal: () => console.log('Add goal'),
    onComplete: () => console.log('Complete'),
  },
}

export const ManyGoals: Story = {
  args: {
    cycleName: 'Q1 2025 Goals',
    cycleInfo: '12 weeks starting Jan 6',
    goals: [
      { id: 'g1', title: 'Goal 1', percentage: 0, weekHistory: [], actions: [] },
      { id: 'g2', title: 'Goal 2', percentage: 0, weekHistory: [], actions: [] },
      { id: 'g3', title: 'Goal 3', percentage: 0, weekHistory: [], actions: [] },
      { id: 'g4', title: 'Goal 4', percentage: 0, weekHistory: [], actions: [] },
      { id: 'g5', title: 'Goal 5', percentage: 0, weekHistory: [], actions: [] },
    ],
    onEditGoal: () => {},
    onAddGoal: () => {},
    onComplete: () => {},
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { GoalsList } from './GoalsList'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/GoalsList src/components/index.ts && git commit -m "feat: add GoalsList component"`

---

## Task 7: Create Onboarding View

**Files:**
- Create: `src/views/Onboarding/Onboarding.tsx`
- Create: `src/views/Onboarding/index.ts`

**Step 1: Create the view**

Create `src/views/Onboarding/Onboarding.tsx`:

```tsx
import { useState } from 'react'
import { WelcomeScreen } from '../../components/WelcomeScreen'
import { CycleSetup } from '../../components/CycleSetup'
import { GoalForm } from '../../components/GoalForm'
import { GoalsList } from '../../components/GoalsList'
import { useAppStore } from '../../store/useAppStore'
import type { Cycle, Goal } from '../../types'

type OnboardingStep = 'welcome' | 'cycle' | 'goal-form' | 'goals-list'

export function Onboarding() {
  const { setCycle, addGoal, updateGoal, deleteGoal, completeOnboarding, cycle, goals } = useAppStore()

  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const handleCycleComplete = (newCycle: Cycle) => {
    setCycle(newCycle)
    setStep('goal-form')
  }

  const handleGoalSave = (goal: Goal) => {
    if (editingGoal) {
      updateGoal(goal.id, goal)
    } else {
      addGoal(goal)
    }
    setEditingGoal(null)
    setStep('goals-list')
  }

  const handleGoalCancel = () => {
    setEditingGoal(null)
    if (goals.length > 0) {
      setStep('goals-list')
    } else {
      setStep('cycle')
    }
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setStep('goal-form')
  }

  const handleAddGoal = () => {
    setEditingGoal(null)
    setStep('goal-form')
  }

  const handleComplete = () => {
    completeOnboarding()
  }

  const formatCycleInfo = () => {
    if (!cycle) return ''
    const start = new Date(cycle.startDate + 'T00:00:00')
    return `${cycle.durationWeeks} weeks starting ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  switch (step) {
    case 'welcome':
      return <WelcomeScreen onGetStarted={() => setStep('cycle')} />

    case 'cycle':
      return (
        <CycleSetup
          onComplete={handleCycleComplete}
          onBack={() => setStep('welcome')}
        />
      )

    case 'goal-form':
      return (
        <div className="min-h-screen bg-bg-base">
          <div className="max-w-lg mx-auto px-4 py-6">
            <button
              onClick={handleGoalCancel}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back
            </button>
            <h1 className="font-display font-bold text-2xl text-text-primary mt-6 mb-6">
              {editingGoal ? 'Edit Goal' : goals.length === 0 ? 'Add Your First Goal' : 'Add Another Goal'}
            </h1>
            <GoalForm
              goalNumber={editingGoal ? goals.findIndex(g => g.id === editingGoal.id) + 1 : goals.length + 1}
              initialGoal={editingGoal ?? undefined}
              onSave={handleGoalSave}
              onCancel={handleGoalCancel}
            />
          </div>
        </div>
      )

    case 'goals-list':
      return (
        <GoalsList
          cycleName={cycle?.name ?? ''}
          cycleInfo={formatCycleInfo()}
          goals={goals}
          onEditGoal={handleEditGoal}
          onAddGoal={handleAddGoal}
          onComplete={handleComplete}
        />
      )
  }
}
```

**Step 2: Create barrel export**

Create `src/views/Onboarding/index.ts`:

```typescript
export { Onboarding } from './Onboarding'
```

**Step 3: Verify build passes**

Run: `npm run build`

**Step 4: Commit**

Run: `git add src/views/Onboarding && git commit -m "feat: add Onboarding view with step flow"`

---

## Task 8: Update App.tsx with Onboarding Routing

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update App.tsx**

Replace `src/App.tsx` with:

```tsx
import { useState } from 'react'
import { Onboarding } from './views/Onboarding'
import { Dashboard } from './views/Dashboard'
import { Today } from './views/Today'
import { Settings } from './views/Settings'
import { BottomNav } from './components/BottomNav'
import { useAppStore } from './store/useAppStore'
import type { NavTab } from './components/BottomNav'

function App() {
  const { hasCompletedOnboarding } = useAppStore()
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')

  if (!hasCompletedOnboarding) {
    return <Onboarding />
  }

  return (
    <>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'today' && <Today />}
      {activeTab === 'settings' && <Settings />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

export default App
```

**Step 2: Verify build passes**

Run: `npm run build`

**Step 3: Commit**

Run: `git add src/App.tsx && git commit -m "feat: route to Onboarding when not completed"`

---

## Task 9: Update Dashboard to Use Store

**Files:**
- Modify: `src/views/Dashboard/Dashboard.tsx`
- Delete: `src/views/Dashboard/mockData.ts` (optional, can keep for reference)

**Step 1: Update Dashboard.tsx**

Replace `src/views/Dashboard/Dashboard.tsx` with:

```tsx
import { useState } from 'react'
import { CycleHeader } from '../../components/CycleHeader'
import { DashboardGoalCard } from '../../components/DashboardGoalCard'
import { ReviewPrompt } from '../../components/ReviewPrompt'
import { WeeklyReview } from '../WeeklyReview'
import { useAppStore } from '../../store/useAppStore'
import type { DashboardGoal } from '../../types'

export function Dashboard() {
  const { cycle, goals } = useAppStore()
  const [showReviewPrompt, setShowReviewPrompt] = useState(true)
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)

  if (showWeeklyReview) {
    return <WeeklyReview />
  }

  // Convert goals to DashboardGoals (add empty milestones for now)
  const dashboardGoals: DashboardGoal[] = goals.map((goal) => ({
    ...goal,
    milestones: [],
  }))

  if (!cycle) {
    return (
      <div className="min-h-screen bg-bg-base pb-20 flex items-center justify-center">
        <p className="text-text-secondary">No active cycle</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Review Prompt */}
        {showReviewPrompt && (
          <div className="mb-4">
            <ReviewPrompt
              weekNumber={cycle.currentWeek}
              onReviewNow={() => setShowWeeklyReview(true)}
              onLater={() => setShowReviewPrompt(false)}
            />
          </div>
        )}

        {/* Cycle Header */}
        <CycleHeader cycle={cycle} />

        {/* Goals */}
        <div className="mt-6 space-y-4">
          {dashboardGoals.length === 0 ? (
            <div className="bg-bg-surface rounded-card p-6 text-center">
              <p className="text-text-secondary">No goals yet</p>
            </div>
          ) : (
            dashboardGoals.map((goal) => (
              <DashboardGoalCard key={goal.id} goal={goal} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify build passes**

Run: `npm run build`

**Step 3: Commit**

Run: `git add src/views/Dashboard && git commit -m "feat: update Dashboard to use store instead of mock data"`

---

## Task 10: Update Today View to Use Store

**Files:**
- Modify: `src/views/Today/Today.tsx`

**Step 1: Update Today.tsx**

Replace `src/views/Today/Today.tsx` with:

```tsx
import { useCallback } from 'react'
import { TodayFocus } from '../../components/TodayFocus'
import { GoalCard } from '../../components/GoalCard'
import { useAppStore } from '../../store/useAppStore'

export function Today() {
  const { goals, updateAction } = useAppStore()

  const handleActionComplete = useCallback((actionId: string, goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return
    const action = goal.actions.find((a) => a.id === actionId)
    if (!action) return
    const newCurrent = Math.min(action.current + 1, action.target)
    updateAction(goalId, actionId, newCurrent)
  }, [goals, updateAction])

  // Get focus actions for TodayFocus
  const focusActions = goals.flatMap((goal) =>
    goal.actions
      .filter((action) => action.current < action.target)
      .slice(0, 2)
      .map((action) => ({
        ...action,
        goalId: goal.id,
        goalTitle: goal.title,
      }))
  ).slice(0, 3)

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-bg-base pb-20 flex items-center justify-center">
        <p className="text-text-secondary">No goals yet. Set up your cycle first!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto">
        {/* Sticky Focus Section */}
        <div className="sticky top-0 z-10 bg-bg-base px-4 pb-4">
          <TodayFocus
            actions={focusActions}
            onActionComplete={handleActionComplete}
          />
        </div>

        {/* Goals List */}
        <div className="px-4 pb-8 space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onActionComplete={(actionId) => handleActionComplete(actionId, goal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify build passes**

Run: `npm run build`

**Step 3: Commit**

Run: `git add src/views/Today && git commit -m "feat: update Today view to use store instead of mock data"`

---

## Task 11: Add Reset Button to Settings (Dev Tool)

**Files:**
- Modify: `src/views/Settings/Settings.tsx`

**Step 1: Update Settings.tsx**

Replace `src/views/Settings/Settings.tsx` with:

```tsx
import { useAppStore } from '../../store/useAppStore'

export function Settings() {
  const { resetStore } = useAppStore()

  const handleReset = () => {
    if (confirm('This will clear all your data and restart onboarding. Continue?')) {
      resetStore()
    }
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="font-display font-bold text-xl text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary mt-2">
          Settings will be available in a future update.
        </p>

        {/* Dev Tools */}
        <div className="mt-8 pt-6 border-t border-text-disabled/20">
          <h2 className="text-text-secondary text-sm font-medium mb-3">
            Developer Tools
          </h2>
          <button
            onClick={handleReset}
            className="w-full bg-accent-coral/10 text-accent-coral py-2 px-4 rounded-lg hover:bg-accent-coral/20 transition-colors text-sm"
          >
            Reset App & Restart Onboarding
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify build passes**

Run: `npm run build`

**Step 3: Commit**

Run: `git add src/views/Settings && git commit -m "feat: add reset button to Settings for dev testing"`

---

## Task 12: Final Build Verification

**Files:** None (verification only)

**Step 1: Run all checks**

Run: `npm run build && npm run lint`
Expected: Both pass with no errors.

**Step 2: Test the flow manually**

Run: `npm run dev`

Test:
1. App should show WelcomeScreen on first load
2. Click "Get Started" → CycleSetup
3. Click "Looks Good" → GoalForm
4. Add a goal with actions → GoalsList
5. Add another goal or click "Start Your Cycle" → Dashboard with your goals
6. Navigate to Today → See your goals and actions
7. Navigate to Settings → Reset and verify onboarding restarts

**Step 3: Commit any fixes if needed**

---

## Summary

This plan creates:
- Zustand store with localStorage persistence
- 4 new onboarding components (WelcomeScreen, CycleSetup, GoalForm, GoalsList)
- 1 new view (Onboarding)
- Updates to App.tsx, Dashboard, Today, and Settings

Total: 12 tasks with full code provided for each.
