# Weekly Review Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 4-step weekly review flow that lets users score their week and plan the next one in under 90 seconds.

**Architecture:** Step-based wizard flow in a dedicated view. Each step is a component that receives shared state from the parent WeeklyReview view. Score calculation is a pure utility function. Components follow existing patterns (Storybook-first, Framer Motion animations).

**Tech Stack:** React, TypeScript, Tailwind, Framer Motion, Storybook

---

## Task 1: Add Review Types

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add new types for weekly review**

Add to `src/types/index.ts`:

```typescript
export interface ReviewAction extends Action {
  goalId: string
  goalTitle: string
}

export interface WeekReview {
  weekNumber: number
  weekStart: string
  score: number
  completedAt: string | null
}

export interface PlanAction {
  id: string
  goalId: string
  goalTitle: string
  title: string
  target: number
  enabled: boolean
}
```

**Step 2: Commit**

Run: `git add src/types/index.ts && git commit -m "feat: add weekly review types"`

---

## Task 2: Create StepIndicator Component

**Files:**
- Create: `src/components/StepIndicator/StepIndicator.tsx`
- Create: `src/components/StepIndicator/StepIndicator.stories.tsx`
- Create: `src/components/StepIndicator/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/StepIndicator/StepIndicator.tsx`:

```tsx
interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`
            w-2 h-2 rounded-full transition-colors duration-200
            ${i < currentStep ? 'bg-accent-amber' : 'bg-text-disabled'}
          `}
        />
      ))}
    </div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/StepIndicator/index.ts`:

```typescript
export { StepIndicator } from './StepIndicator'
```

**Step 3: Create Storybook stories**

Create `src/components/StepIndicator/StepIndicator.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepIndicator } from './StepIndicator'

const meta: Meta<typeof StepIndicator> = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof StepIndicator>

export const Step1of4: Story = {
  args: {
    currentStep: 1,
    totalSteps: 4,
  },
}

export const Step2of4: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
}

export const Step3of4: Story = {
  args: {
    currentStep: 3,
    totalSteps: 4,
  },
}

export const AllComplete: Story = {
  args: {
    currentStep: 4,
    totalSteps: 4,
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { StepIndicator } from './StepIndicator'
```

**Step 5: Verify in Storybook**

Run: `npm run storybook`
Verify: StepIndicator stories render correctly with dots filling as step increases.

**Step 6: Commit**

Run: `git add src/components/StepIndicator src/components/index.ts && git commit -m "feat: add StepIndicator component"`

---

## Task 3: Create ReviewActionItem Component

**Files:**
- Create: `src/components/ReviewActionItem/ReviewActionItem.tsx`
- Create: `src/components/ReviewActionItem/ReviewActionItem.stories.tsx`
- Create: `src/components/ReviewActionItem/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/ReviewActionItem/ReviewActionItem.tsx`:

```tsx
import { motion } from 'framer-motion'
import { useState } from 'react'

interface ReviewActionItemProps {
  title: string
  current: number
  target: number
  onIncrement?: () => void
  onDecrement?: () => void
}

export function ReviewActionItem({
  title,
  current,
  target,
  onIncrement,
  onDecrement,
}: ReviewActionItemProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const isComplete = current >= target

  const handleIncrement = () => {
    if (current >= target) return
    setIsAnimating(true)
    onIncrement?.()
    setTimeout(() => setIsAnimating(false), 200)
  }

  const handleDecrement = () => {
    if (current <= 0) return
    onDecrement?.()
  }

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Checkbox indicator */}
      <motion.div
        className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${isComplete ? 'bg-accent-amber border-accent-amber' : 'border-text-disabled'}
        `}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {isComplete && (
          <svg className="w-3 h-3 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </motion.div>

      {/* Title */}
      <span className={`flex-1 ${isComplete ? 'text-text-secondary' : 'text-text-primary'}`}>
        {title}
      </span>

      {/* Count controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          disabled={current <= 0}
          className="w-7 h-7 rounded-full bg-bg-surface-hover text-text-secondary disabled:opacity-30"
        >
          −
        </button>
        <span className="w-10 text-center text-text-primary">
          {current}/{target}
        </span>
        <button
          onClick={handleIncrement}
          disabled={current >= target}
          className="w-7 h-7 rounded-full bg-accent-coral/20 text-accent-coral disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/ReviewActionItem/index.ts`:

```typescript
export { ReviewActionItem } from './ReviewActionItem'
```

**Step 3: Create Storybook stories**

Create `src/components/ReviewActionItem/ReviewActionItem.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ReviewActionItem } from './ReviewActionItem'

const meta: Meta<typeof ReviewActionItem> = {
  title: 'Components/ReviewActionItem',
  component: ReviewActionItem,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-bg-surface p-4 rounded-card">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ReviewActionItem>

export const NotStarted: Story = {
  args: {
    title: 'Run 3x this week',
    current: 0,
    target: 3,
  },
}

export const Partial: Story = {
  args: {
    title: 'Run 3x this week',
    current: 2,
    target: 3,
  },
}

export const Complete: Story = {
  args: {
    title: 'Run 3x this week',
    current: 3,
    target: 3,
  },
}

export const Interactive: Story = {
  render: function InteractiveReviewActionItem() {
    const [current, setCurrent] = useState(1)
    const target = 3

    return (
      <ReviewActionItem
        title="Run 3x this week"
        current={current}
        target={target}
        onIncrement={() => setCurrent((c) => Math.min(c + 1, target))}
        onDecrement={() => setCurrent((c) => Math.max(c - 1, 0))}
      />
    )
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { ReviewActionItem } from './ReviewActionItem'
```

**Step 5: Verify in Storybook**

Run: `npm run storybook`
Verify: ReviewActionItem stories render correctly, Interactive story allows +/- adjustments.

**Step 6: Commit**

Run: `git add src/components/ReviewActionItem src/components/index.ts && git commit -m "feat: add ReviewActionItem component"`

---

## Task 4: Create PlanActionItem Component

**Files:**
- Create: `src/components/PlanActionItem/PlanActionItem.tsx`
- Create: `src/components/PlanActionItem/PlanActionItem.stories.tsx`
- Create: `src/components/PlanActionItem/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/PlanActionItem/PlanActionItem.tsx`:

```tsx
interface PlanActionItemProps {
  title: string
  target: number
  enabled: boolean
  onToggle?: () => void
}

export function PlanActionItem({ title, target, enabled, onToggle }: PlanActionItemProps) {
  return (
    <div
      className={`
        flex items-center gap-3 py-2 transition-opacity duration-200
        ${enabled ? 'opacity-100' : 'opacity-50'}
      `}
    >
      {/* Title and target */}
      <div className="flex-1">
        <span className={enabled ? 'text-text-primary' : 'text-text-secondary'}>
          {title}
        </span>
        <span className="text-text-disabled ml-2 text-sm">
          ({target}x)
        </span>
      </div>

      {/* Toggle switch */}
      <button
        onClick={onToggle}
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          ${enabled ? 'bg-accent-amber' : 'bg-text-disabled'}
        `}
      >
        <div
          className={`
            absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${enabled ? 'translate-x-5' : 'translate-x-0.5'}
          `}
        />
      </button>

      {/* Skipped label */}
      {!enabled && (
        <span className="text-text-disabled text-xs">Skipped</span>
      )}
    </div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/PlanActionItem/index.ts`:

```typescript
export { PlanActionItem } from './PlanActionItem'
```

**Step 3: Create Storybook stories**

Create `src/components/PlanActionItem/PlanActionItem.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PlanActionItem } from './PlanActionItem'

const meta: Meta<typeof PlanActionItem> = {
  title: 'Components/PlanActionItem',
  component: PlanActionItem,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-bg-surface p-4 rounded-card">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PlanActionItem>

export const Enabled: Story = {
  args: {
    title: 'Run 3x this week',
    target: 3,
    enabled: true,
  },
}

export const Disabled: Story = {
  args: {
    title: 'Run 3x this week',
    target: 3,
    enabled: false,
  },
}

export const Interactive: Story = {
  render: function InteractivePlanActionItem() {
    const [enabled, setEnabled] = useState(true)

    return (
      <PlanActionItem
        title="Run 3x this week"
        target={3}
        enabled={enabled}
        onToggle={() => setEnabled((e) => !e)}
      />
    )
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { PlanActionItem } from './PlanActionItem'
```

**Step 5: Verify in Storybook**

Run: `npm run storybook`
Verify: PlanActionItem stories render correctly, toggle works in Interactive story.

**Step 6: Commit**

Run: `git add src/components/PlanActionItem src/components/index.ts && git commit -m "feat: add PlanActionItem component"`

---

## Task 5: Create ScoreDisplay Component

**Files:**
- Create: `src/components/ScoreDisplay/ScoreDisplay.tsx`
- Create: `src/components/ScoreDisplay/ScoreDisplay.stories.tsx`
- Create: `src/components/ScoreDisplay/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create score message utility**

Create `src/components/ScoreDisplay/ScoreDisplay.tsx`:

```tsx
import { motion } from 'framer-motion'
import { ProgressRing } from '../ProgressRing'

function getScoreMessage(score: number): string {
  if (score >= 90) return 'Exceptional week. You crushed it.'
  if (score >= 75) return 'Strong week. You showed up.'
  if (score >= 50) return 'Solid progress. Every action counts.'
  if (score >= 25) return "Tough week — but you're still here."
  if (score >= 1) return "Not your week. Tomorrow's a fresh start."
  return 'Life happens. Ready to reset?'
}

interface ScoreDisplayProps {
  score: number
  completed: number
  total: number
}

export function ScoreDisplay({ score, completed, total }: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-8"
    >
      {/* Large progress ring */}
      <div className="relative w-32 h-32">
        <ProgressRing percentage={score} size={128} strokeWidth={8} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-3xl font-display font-bold text-text-primary">
            {score}%
          </span>
        </motion.div>
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-lg font-display text-text-primary"
      >
        {getScoreMessage(score)}
      </motion.p>

      {/* Completion count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-sm text-text-secondary"
      >
        {completed} of {total} actions completed
      </motion.p>
    </motion.div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/ScoreDisplay/index.ts`:

```typescript
export { ScoreDisplay } from './ScoreDisplay'
```

**Step 3: Create Storybook stories**

Create `src/components/ScoreDisplay/ScoreDisplay.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScoreDisplay } from './ScoreDisplay'

const meta: Meta<typeof ScoreDisplay> = {
  title: 'Components/ScoreDisplay',
  component: ScoreDisplay,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ScoreDisplay>

export const Exceptional: Story = {
  args: {
    score: 95,
    completed: 10,
    total: 11,
  },
}

export const Strong: Story = {
  args: {
    score: 82,
    completed: 9,
    total: 11,
  },
}

export const Solid: Story = {
  args: {
    score: 64,
    completed: 7,
    total: 11,
  },
}

export const Tough: Story = {
  args: {
    score: 36,
    completed: 4,
    total: 11,
  },
}

export const Low: Story = {
  args: {
    score: 18,
    completed: 2,
    total: 11,
  },
}

export const Zero: Story = {
  args: {
    score: 0,
    completed: 0,
    total: 11,
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { ScoreDisplay } from './ScoreDisplay'
```

**Step 5: Verify in Storybook**

Run: `npm run storybook`
Verify: ScoreDisplay stories render correctly with different messages per tier.

**Step 6: Commit**

Run: `git add src/components/ScoreDisplay src/components/index.ts && git commit -m "feat: add ScoreDisplay component with tiered messages"`

---

## Task 6: Create AddActionInline Component

**Files:**
- Create: `src/components/AddActionInline/AddActionInline.tsx`
- Create: `src/components/AddActionInline/AddActionInline.stories.tsx`
- Create: `src/components/AddActionInline/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/AddActionInline/AddActionInline.tsx`:

```tsx
import { useState } from 'react'

interface AddActionInlineProps {
  onAdd: (title: string, target: number) => void
}

export function AddActionInline({ onAdd }: AddActionInlineProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState(1)

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd(title.trim(), target)
    setTitle('')
    setTarget(1)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setTitle('')
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-text-secondary hover:text-accent-coral transition-colors text-sm py-2"
      >
        + Add action for this week
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 py-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Action title..."
        autoFocus
        className="flex-1 bg-bg-base border border-text-disabled rounded px-2 py-1 text-text-primary placeholder:text-text-disabled focus:border-accent-coral focus:outline-none"
      />
      <select
        value={target}
        onChange={(e) => setTarget(Number(e.target.value))}
        className="bg-bg-base border border-text-disabled rounded px-2 py-1 text-text-primary"
      >
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <option key={n} value={n}>
            {n}x
          </option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="px-3 py-1 bg-accent-coral text-bg-base rounded font-medium disabled:opacity-50"
      >
        Add
      </button>
      <button
        onClick={() => {
          setIsOpen(false)
          setTitle('')
        }}
        className="px-2 py-1 text-text-secondary hover:text-text-primary"
      >
        Cancel
      </button>
    </div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/AddActionInline/index.ts`:

```typescript
export { AddActionInline } from './AddActionInline'
```

**Step 3: Create Storybook stories**

Create `src/components/AddActionInline/AddActionInline.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AddActionInline } from './AddActionInline'

const meta: Meta<typeof AddActionInline> = {
  title: 'Components/AddActionInline',
  component: AddActionInline,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-96 bg-bg-surface p-4 rounded-card">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AddActionInline>

export const Default: Story = {
  args: {
    onAdd: (title, target) => console.log('Added:', title, target),
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { AddActionInline } from './AddActionInline'
```

**Step 5: Verify in Storybook**

Run: `npm run storybook`
Verify: AddActionInline expands on click, accepts input, can be cancelled.

**Step 6: Commit**

Run: `git add src/components/AddActionInline src/components/index.ts && git commit -m "feat: add AddActionInline component"`

---

## Task 7: Create ReviewPrompt Component

**Files:**
- Create: `src/components/ReviewPrompt/ReviewPrompt.tsx`
- Create: `src/components/ReviewPrompt/ReviewPrompt.stories.tsx`
- Create: `src/components/ReviewPrompt/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/ReviewPrompt/ReviewPrompt.tsx`:

```tsx
import { motion } from 'framer-motion'

interface ReviewPromptProps {
  weekNumber: number
  onReviewNow: () => void
  onLater: () => void
  isUrgent?: boolean
}

export function ReviewPrompt({
  weekNumber,
  onReviewNow,
  onLater,
  isUrgent = false,
}: ReviewPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface rounded-card p-4 border-l-4 border-accent-coral"
    >
      <p className="text-text-primary font-display font-semibold">
        Week {weekNumber} ended
      </p>
      <p className="text-text-secondary text-sm mt-1">
        {isUrgent
          ? 'Your review is overdue. Quick catch-up?'
          : 'Ready to review and plan next week?'}
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onReviewNow}
          className="flex-1 py-2 bg-accent-coral text-bg-base rounded-lg font-medium"
        >
          Review Now
        </button>
        <button
          onClick={onLater}
          className="px-4 py-2 text-text-secondary hover:text-text-primary"
        >
          Later
        </button>
      </div>
    </motion.div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/ReviewPrompt/index.ts`:

```typescript
export { ReviewPrompt } from './ReviewPrompt'
```

**Step 3: Create Storybook stories**

Create `src/components/ReviewPrompt/ReviewPrompt.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReviewPrompt } from './ReviewPrompt'

const meta: Meta<typeof ReviewPrompt> = {
  title: 'Components/ReviewPrompt',
  component: ReviewPrompt,
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
type Story = StoryObj<typeof ReviewPrompt>

export const Default: Story = {
  args: {
    weekNumber: 4,
    onReviewNow: () => console.log('Review now'),
    onLater: () => console.log('Later'),
  },
}

export const Urgent: Story = {
  args: {
    weekNumber: 4,
    onReviewNow: () => console.log('Review now'),
    onLater: () => console.log('Later'),
    isUrgent: true,
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { ReviewPrompt } from './ReviewPrompt'
```

**Step 5: Verify in Storybook**

Run: `npm run storybook`
Verify: ReviewPrompt renders with coral border, buttons work.

**Step 6: Commit**

Run: `git add src/components/ReviewPrompt src/components/index.ts && git commit -m "feat: add ReviewPrompt component"`

---

## Task 8: Create WeeklyReview View - Step 1 (Review This Week)

**Files:**
- Create: `src/views/WeeklyReview/WeeklyReview.tsx`
- Create: `src/views/WeeklyReview/mockData.ts`
- Create: `src/views/WeeklyReview/index.ts`
- Create: `src/views/WeeklyReview/steps/ReviewStep.tsx`

**Step 1: Create mock data**

Create `src/views/WeeklyReview/mockData.ts`:

```typescript
import type { ReviewAction, PlanAction } from '../../types'

export const mockReviewActions: ReviewAction[] = [
  { id: 'a1', goalId: 'g1', goalTitle: 'Get Fit', title: 'Run 3x this week', current: 2, target: 3 },
  { id: 'a2', goalId: 'g1', goalTitle: 'Get Fit', title: 'Interval session', current: 1, target: 1 },
  { id: 'a3', goalId: 'g2', goalTitle: 'Financial Health', title: 'Review budget', current: 0, target: 1 },
  { id: 'a4', goalId: 'g2', goalTitle: 'Financial Health', title: 'Track expenses', current: 1, target: 1 },
  { id: 'a5', goalId: 'g3', goalTitle: 'Learning', title: 'Read 20 pages', current: 0, target: 1 },
]

export const mockPlanActions: PlanAction[] = [
  { id: 'a1', goalId: 'g1', goalTitle: 'Get Fit', title: 'Run 3x this week', target: 3, enabled: true },
  { id: 'a2', goalId: 'g1', goalTitle: 'Get Fit', title: 'Interval session', target: 1, enabled: true },
  { id: 'a3', goalId: 'g2', goalTitle: 'Financial Health', title: 'Review budget', target: 1, enabled: true },
  { id: 'a4', goalId: 'g2', goalTitle: 'Financial Health', title: 'Track expenses', target: 1, enabled: true },
  { id: 'a5', goalId: 'g3', goalTitle: 'Learning', title: 'Read 20 pages', target: 1, enabled: true },
]

export function groupByGoal<T extends { goalId: string; goalTitle: string }>(
  actions: T[]
): Map<string, { goalTitle: string; actions: T[] }> {
  const groups = new Map<string, { goalTitle: string; actions: T[] }>()
  for (const action of actions) {
    const group = groups.get(action.goalId)
    if (group) {
      group.actions.push(action)
    } else {
      groups.set(action.goalId, { goalTitle: action.goalTitle, actions: [action] })
    }
  }
  return groups
}
```

**Step 2: Create ReviewStep component**

Create `src/views/WeeklyReview/steps/ReviewStep.tsx`:

```tsx
import { Card } from '../../../components/Card'
import { ReviewActionItem } from '../../../components/ReviewActionItem'
import type { ReviewAction } from '../../../types'
import { groupByGoal } from '../mockData'

interface ReviewStepProps {
  weekNumber: number
  weekDateRange: string
  actions: ReviewAction[]
  onActionChange: (actionId: string, newCurrent: number) => void
  onNext: () => void
}

export function ReviewStep({
  weekNumber,
  weekDateRange,
  actions,
  onActionChange,
  onNext,
}: ReviewStepProps) {
  const groupedActions = groupByGoal(actions)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-display font-bold text-text-primary">
          Week {weekNumber} Review
        </h1>
        <p className="text-text-secondary text-sm">{weekDateRange}</p>
      </div>

      {/* Actions by goal */}
      <div className="flex-1 overflow-auto space-y-4">
        {Array.from(groupedActions.entries()).map(([goalId, { goalTitle, actions: goalActions }]) => (
          <Card key={goalId}>
            <h2 className="font-display font-semibold text-text-primary mb-3">
              {goalTitle}
            </h2>
            <div className="space-y-1">
              {goalActions.map((action) => (
                <ReviewActionItem
                  key={action.id}
                  title={action.title}
                  current={action.current}
                  target={action.target}
                  onIncrement={() =>
                    onActionChange(action.id, Math.min(action.current + 1, action.target))
                  }
                  onDecrement={() =>
                    onActionChange(action.id, Math.max(action.current - 1, 0))
                  }
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Next button */}
      <div className="pt-4">
        <button
          onClick={onNext}
          className="w-full py-3 bg-accent-coral text-bg-base rounded-lg font-medium"
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

**Step 3: Create main WeeklyReview view**

Create `src/views/WeeklyReview/WeeklyReview.tsx`:

```tsx
import { useState, useCallback } from 'react'
import { StepIndicator } from '../../components/StepIndicator'
import { ReviewStep } from './steps/ReviewStep'
import { mockReviewActions } from './mockData'
import type { ReviewAction } from '../../types'

type ReviewStepType = 'review' | 'score' | 'plan' | 'done'

export function WeeklyReview() {
  const [step, setStep] = useState<ReviewStepType>('review')
  const [actions, setActions] = useState<ReviewAction[]>(mockReviewActions)

  const stepNumber = { review: 1, score: 2, plan: 3, done: 4 }[step]

  const handleActionChange = useCallback((actionId: string, newCurrent: number) => {
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, current: newCurrent } : a))
    )
  }, [])

  const handleNext = () => {
    if (step === 'review') setStep('score')
    else if (step === 'score') setStep('plan')
    else if (step === 'plan') setStep('done')
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col min-h-screen">
        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator currentStep={stepNumber} totalSteps={4} />
        </div>

        {/* Current step */}
        <div className="flex-1">
          {step === 'review' && (
            <ReviewStep
              weekNumber={4}
              weekDateRange="Dec 22 – Dec 28"
              actions={actions}
              onActionChange={handleActionChange}
              onNext={handleNext}
            />
          )}
          {step === 'score' && (
            <div className="text-text-primary text-center">Score step placeholder</div>
          )}
          {step === 'plan' && (
            <div className="text-text-primary text-center">Plan step placeholder</div>
          )}
          {step === 'done' && (
            <div className="text-text-primary text-center">Done step placeholder</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Create the barrel export**

Create `src/views/WeeklyReview/index.ts`:

```typescript
export { WeeklyReview } from './WeeklyReview'
```

**Step 5: Verify in browser**

Temporarily update `src/App.tsx` to render `<WeeklyReview />`.
Run: `npm run dev`
Verify: Step 1 renders with actions grouped by goal, can adjust counts.

**Step 6: Commit**

Run: `git add src/views/WeeklyReview src/types/index.ts && git commit -m "feat: add WeeklyReview view with ReviewStep"`

---

## Task 9: Create WeeklyReview View - Step 2 (Score Display)

**Files:**
- Create: `src/views/WeeklyReview/steps/ScoreStep.tsx`
- Modify: `src/views/WeeklyReview/WeeklyReview.tsx`

**Step 1: Create ScoreStep component**

Create `src/views/WeeklyReview/steps/ScoreStep.tsx`:

```tsx
import { ScoreDisplay } from '../../../components/ScoreDisplay'
import type { ReviewAction } from '../../../types'

interface ScoreStepProps {
  weekNumber: number
  actions: ReviewAction[]
  onContinue: () => void
}

export function ScoreStep({ weekNumber, actions, onContinue }: ScoreStepProps) {
  const totalTarget = actions.reduce((sum, a) => sum + a.target, 0)
  const totalCurrent = actions.reduce((sum, a) => sum + a.current, 0)
  const score = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-display font-bold text-text-primary">
          Week {weekNumber}
        </h1>
      </div>

      {/* Score display */}
      <div className="flex-1 flex items-center justify-center">
        <ScoreDisplay score={score} completed={totalCurrent} total={totalTarget} />
      </div>

      {/* Continue button */}
      <div className="pt-4">
        <button
          onClick={onContinue}
          className="w-full py-3 bg-accent-amber text-bg-base rounded-lg font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Update WeeklyReview to use ScoreStep**

In `src/views/WeeklyReview/WeeklyReview.tsx`, replace the score placeholder:

```tsx
import { ScoreStep } from './steps/ScoreStep'

// In the render, replace:
// {step === 'score' && <div>...</div>}
// With:
{step === 'score' && (
  <ScoreStep weekNumber={4} actions={actions} onContinue={handleNext} />
)}
```

**Step 3: Verify in browser**

Run: `npm run dev`
Click "Next" from Review step.
Verify: Score step shows correct percentage and message.

**Step 4: Commit**

Run: `git add src/views/WeeklyReview && git commit -m "feat: add ScoreStep to WeeklyReview"`

---

## Task 10: Create WeeklyReview View - Step 3 (Plan Next Week)

**Files:**
- Create: `src/views/WeeklyReview/steps/PlanStep.tsx`
- Modify: `src/views/WeeklyReview/WeeklyReview.tsx`

**Step 1: Create PlanStep component**

Create `src/views/WeeklyReview/steps/PlanStep.tsx`:

```tsx
import { Card } from '../../../components/Card'
import { PlanActionItem } from '../../../components/PlanActionItem'
import { AddActionInline } from '../../../components/AddActionInline'
import type { PlanAction } from '../../../types'
import { groupByGoal } from '../mockData'

interface PlanStepProps {
  weekDateRange: string
  actions: PlanAction[]
  onToggleAction: (actionId: string) => void
  onAddAction: (goalId: string, title: string, target: number) => void
  onComplete: () => void
}

export function PlanStep({
  weekDateRange,
  actions,
  onToggleAction,
  onAddAction,
  onComplete,
}: PlanStepProps) {
  const groupedActions = groupByGoal(actions)
  const allSkipped = actions.every((a) => !a.enabled)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-display font-bold text-text-primary">Next Week</h1>
        <p className="text-text-secondary text-sm">{weekDateRange}</p>
      </div>

      {/* Actions by goal */}
      <div className="flex-1 overflow-auto space-y-4">
        {Array.from(groupedActions.entries()).map(([goalId, { goalTitle, actions: goalActions }]) => (
          <Card key={goalId}>
            <h2 className="font-display font-semibold text-text-primary mb-3">
              {goalTitle}
            </h2>
            <div className="space-y-1">
              {goalActions.map((action) => (
                <PlanActionItem
                  key={action.id}
                  title={action.title}
                  target={action.target}
                  enabled={action.enabled}
                  onToggle={() => onToggleAction(action.id)}
                />
              ))}
            </div>
            <div className="mt-2">
              <AddActionInline
                onAdd={(title, target) => onAddAction(goalId, title, target)}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Warning if all skipped */}
      {allSkipped && (
        <p className="text-accent-coral text-sm text-center mt-4">
          You've skipped all actions for next week.
        </p>
      )}

      {/* Complete button */}
      <div className="pt-4">
        <button
          onClick={onComplete}
          className="w-full py-3 bg-accent-amber text-bg-base rounded-lg font-medium"
        >
          Looks Good
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Update WeeklyReview with plan state and handlers**

Update `src/views/WeeklyReview/WeeklyReview.tsx`:

```tsx
import { useState, useCallback } from 'react'
import { StepIndicator } from '../../components/StepIndicator'
import { ReviewStep } from './steps/ReviewStep'
import { ScoreStep } from './steps/ScoreStep'
import { PlanStep } from './steps/PlanStep'
import { mockReviewActions, mockPlanActions } from './mockData'
import type { ReviewAction, PlanAction } from '../../types'

type ReviewStepType = 'review' | 'score' | 'plan' | 'done'

export function WeeklyReview() {
  const [step, setStep] = useState<ReviewStepType>('review')
  const [reviewActions, setReviewActions] = useState<ReviewAction[]>(mockReviewActions)
  const [planActions, setPlanActions] = useState<PlanAction[]>(mockPlanActions)

  const stepNumber = { review: 1, score: 2, plan: 3, done: 4 }[step]

  const handleActionChange = useCallback((actionId: string, newCurrent: number) => {
    setReviewActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, current: newCurrent } : a))
    )
  }, [])

  const handleTogglePlanAction = useCallback((actionId: string) => {
    setPlanActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, enabled: !a.enabled } : a))
    )
  }, [])

  const handleAddPlanAction = useCallback(
    (goalId: string, title: string, target: number) => {
      const goalTitle = planActions.find((a) => a.goalId === goalId)?.goalTitle ?? 'Goal'
      const newAction: PlanAction = {
        id: `new-${Date.now()}`,
        goalId,
        goalTitle,
        title,
        target,
        enabled: true,
      }
      setPlanActions((prev) => [...prev, newAction])
    },
    [planActions]
  )

  const handleNext = () => {
    if (step === 'review') setStep('score')
    else if (step === 'score') setStep('plan')
    else if (step === 'plan') setStep('done')
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col min-h-screen">
        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator currentStep={stepNumber} totalSteps={4} />
        </div>

        {/* Current step */}
        <div className="flex-1">
          {step === 'review' && (
            <ReviewStep
              weekNumber={4}
              weekDateRange="Dec 22 – Dec 28"
              actions={reviewActions}
              onActionChange={handleActionChange}
              onNext={handleNext}
            />
          )}
          {step === 'score' && (
            <ScoreStep weekNumber={4} actions={reviewActions} onContinue={handleNext} />
          )}
          {step === 'plan' && (
            <PlanStep
              weekDateRange="Dec 29 – Jan 4"
              actions={planActions}
              onToggleAction={handleTogglePlanAction}
              onAddAction={handleAddPlanAction}
              onComplete={handleNext}
            />
          )}
          {step === 'done' && (
            <div className="text-text-primary text-center">Done step placeholder</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Verify in browser**

Run: `npm run dev`
Navigate through Review → Score → Plan.
Verify: Can toggle actions, add new actions, see warning if all skipped.

**Step 4: Commit**

Run: `git add src/views/WeeklyReview && git commit -m "feat: add PlanStep to WeeklyReview"`

---

## Task 11: Create WeeklyReview View - Step 4 (Done)

**Files:**
- Create: `src/views/WeeklyReview/steps/DoneStep.tsx`
- Modify: `src/views/WeeklyReview/WeeklyReview.tsx`

**Step 1: Create DoneStep component**

Create `src/views/WeeklyReview/steps/DoneStep.tsx`:

```tsx
import { motion } from 'framer-motion'

interface DoneStepProps {
  nextWeekNumber: number
  onBackToToday: () => void
}

export function DoneStep({ nextWeekNumber, onBackToToday }: DoneStepProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center">
      {/* Celebration icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-accent-amber/20 flex items-center justify-center mb-6"
      >
        <svg
          className="w-8 h-8 text-accent-amber"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-display font-bold text-text-primary"
      >
        You're all set for Week {nextWeekNumber}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-text-secondary mt-2"
      >
        See you next week
      </motion.p>

      {/* Back to Today button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={onBackToToday}
          className="px-8 py-3 bg-accent-amber text-bg-base rounded-lg font-medium"
        >
          Back to Today
        </button>
      </motion.div>
    </div>
  )
}
```

**Step 2: Update WeeklyReview to use DoneStep**

In `src/views/WeeklyReview/WeeklyReview.tsx`, add:

```tsx
import { DoneStep } from './steps/DoneStep'

// Add handler:
const handleBackToToday = () => {
  // For now, just reset to review step
  // Later this will navigate to Today view
  setStep('review')
  setReviewActions(mockReviewActions)
  setPlanActions(mockPlanActions)
}

// Replace done placeholder:
{step === 'done' && (
  <DoneStep nextWeekNumber={5} onBackToToday={handleBackToToday} />
)}
```

**Step 3: Verify in browser**

Run: `npm run dev`
Navigate through all 4 steps.
Verify: Done step shows celebration with animation, "Back to Today" resets flow.

**Step 4: Commit**

Run: `git add src/views/WeeklyReview && git commit -m "feat: add DoneStep to WeeklyReview"`

---

## Task 12: Create WeeklyReview Stories

**Files:**
- Create: `src/views/WeeklyReview/WeeklyReview.stories.tsx`

**Step 1: Create stories**

Create `src/views/WeeklyReview/WeeklyReview.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { WeeklyReview } from './WeeklyReview'

const meta: Meta<typeof WeeklyReview> = {
  title: 'Views/WeeklyReview',
  component: WeeklyReview,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof WeeklyReview>

export const Default: Story = {}
```

**Step 2: Verify in Storybook**

Run: `npm run storybook`
Verify: WeeklyReview appears under Views, all 4 steps work.

**Step 3: Commit**

Run: `git add src/views/WeeklyReview && git commit -m "feat: add WeeklyReview stories"`

---

## Task 13: Integrate ReviewPrompt into Today View

**Files:**
- Modify: `src/views/Today/Today.tsx`

**Step 1: Add review prompt state and rendering**

Update `src/views/Today/Today.tsx`:

```tsx
import { useState, useCallback } from 'react'
import { TopBar } from '../../components/TopBar'
import { TodayFocus } from '../../components/TodayFocus'
import { GoalCard } from '../../components/GoalCard'
import { ReviewPrompt } from '../../components/ReviewPrompt'
import type { Goal } from '../../types'
import { mockGoals, getFocusActions } from './mockData'

export function Today() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [showReviewPrompt, setShowReviewPrompt] = useState(true)
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)

  const handleActionComplete = useCallback((actionId: string, goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal

        const updatedActions = goal.actions.map((action) => {
          if (action.id !== actionId) return action
          return { ...action, current: Math.min(action.current + 1, action.target) }
        })

        const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
        const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
        const percentage = Math.round((totalCurrent / totalTarget) * 100)

        return { ...goal, actions: updatedActions, percentage }
      })
    )
  }, [])

  const focusActions = getFocusActions(goals)

  // If showing weekly review, render that instead
  if (showWeeklyReview) {
    // Import WeeklyReview dynamically to avoid circular deps
    const { WeeklyReview } = require('../WeeklyReview')
    return <WeeklyReview />
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto">
        <TopBar />

        {/* Review Prompt */}
        {showReviewPrompt && (
          <div className="px-4 pb-4">
            <ReviewPrompt
              weekNumber={4}
              onReviewNow={() => setShowWeeklyReview(true)}
              onLater={() => setShowReviewPrompt(false)}
            />
          </div>
        )}

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

**Step 2: Verify in browser**

Run: `npm run dev`
Verify: ReviewPrompt appears at top, "Review Now" opens WeeklyReview, "Later" dismisses prompt.

**Step 3: Commit**

Run: `git add src/views/Today && git commit -m "feat: integrate ReviewPrompt into Today view"`

---

## Task 14: Final Build Verification

**Files:** None (verification only)

**Step 1: Run all checks**

Run: `npm run build && npm run lint`
Expected: Both pass with no errors.

**Step 2: Verify Storybook**

Run: `npm run storybook`
Verify: All new components and views appear and work correctly.

**Step 3: Final commit**

Run: `git add -A && git commit -m "feat: complete Weekly Review feature"`

---

## Summary

This plan creates:
- 6 new components (StepIndicator, ReviewActionItem, PlanActionItem, ScoreDisplay, AddActionInline, ReviewPrompt)
- 1 new view (WeeklyReview) with 4 step sub-components
- Integration with existing Today view
- Full Storybook coverage

All components follow existing patterns: Framer Motion animations, Tailwind styling, barrel exports, type-only imports.
