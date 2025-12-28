# Goal Detail View Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Goal Detail view—a unified hub for viewing/editing goals, weekly actions, and milestones with inline editing and tap-to-navigate access.

**Architecture:** State-based navigation in App.tsx (selectedGoalId) routes to GoalDetail view. All edits update Zustand store immediately. Components follow existing patterns (directory per component, Storybook stories).

**Tech Stack:** React 18, TypeScript, Zustand, Tailwind CSS, Framer Motion

---

## Task 1: Add Milestones to Goal Type

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Update Goal interface**

Add optional milestones array to base Goal type:

```typescript
export interface Goal {
  id: string
  title: string
  identityStatement?: string
  percentage: number
  weekHistory: WeekStatus[]
  actions: Action[]
  milestones?: Milestone[]
}
```

**Step 2: Verify types compile**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(types): add milestones to Goal interface"
```

---

## Task 2: Add Store Actions for Actions/Milestones CRUD

**Files:**
- Modify: `src/store/useAppStore.ts`

**Step 1: Add new action types to AppState interface**

```typescript
// Add to AppState interface
addAction: (goalId: string, action: Action) => void
deleteAction: (goalId: string, actionId: string) => void
addMilestone: (goalId: string, milestone: Milestone) => void
updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void
deleteMilestone: (goalId: string, milestoneId: string) => void
```

**Step 2: Implement addAction**

```typescript
addAction: (goalId, action) =>
  set((state) => ({
    goals: state.goals.map((goal) => {
      if (goal.id !== goalId) return goal
      const updatedActions = [...goal.actions, action]
      const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
      const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
      const percentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
      return { ...goal, actions: updatedActions, percentage }
    }),
  })),
```

**Step 3: Implement deleteAction**

```typescript
deleteAction: (goalId, actionId) =>
  set((state) => ({
    goals: state.goals.map((goal) => {
      if (goal.id !== goalId) return goal
      const updatedActions = goal.actions.filter((a) => a.id !== actionId)
      const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
      const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
      const percentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
      return { ...goal, actions: updatedActions, percentage }
    }),
  })),
```

**Step 4: Implement addMilestone**

```typescript
addMilestone: (goalId, milestone) =>
  set((state) => ({
    goals: state.goals.map((goal) =>
      goal.id === goalId
        ? { ...goal, milestones: [...(goal.milestones || []), milestone] }
        : goal
    ),
  })),
```

**Step 5: Implement updateMilestone**

```typescript
updateMilestone: (goalId, milestoneId, updates) =>
  set((state) => ({
    goals: state.goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            milestones: (goal.milestones || []).map((m) =>
              m.id === milestoneId ? { ...m, ...updates } : m
            ),
          }
        : goal
    ),
  })),
```

**Step 6: Implement deleteMilestone**

```typescript
deleteMilestone: (goalId, milestoneId) =>
  set((state) => ({
    goals: state.goals.map((goal) =>
      goal.id === goalId
        ? { ...goal, milestones: (goal.milestones || []).filter((m) => m.id !== milestoneId) }
        : goal
    ),
  })),
```

**Step 7: Add Milestone import**

```typescript
import type { Cycle, Goal, Action, Milestone } from '../types'
```

**Step 8: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 9: Commit**

```bash
git add src/store/useAppStore.ts
git commit -m "feat(store): add action and milestone CRUD operations"
```

---

## Task 3: Create EditableText Component

**Files:**
- Create: `src/components/EditableText/EditableText.tsx`
- Create: `src/components/EditableText/EditableText.stories.tsx`
- Create: `src/components/EditableText/index.ts`

**Step 1: Create component directory**

```bash
mkdir -p src/components/EditableText
```

**Step 2: Create EditableText.tsx**

```typescript
import { useState, useRef, useEffect } from 'react'

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function EditableText({
  value,
  onSave,
  placeholder = 'Click to edit',
  className = '',
  inputClassName = '',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    setIsEditing(false)
    if (editValue !== value) {
      onSave(editValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-b border-accent-amber outline-none ${inputClassName}`}
        placeholder={placeholder}
      />
    )
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:text-accent-amber transition-colors ${className}`}
    >
      {value || <span className="text-text-disabled">{placeholder}</span>}
    </span>
  )
}
```

**Step 3: Create index.ts**

```typescript
export { EditableText } from './EditableText'
```

**Step 4: Create EditableText.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { EditableText } from './EditableText'
import { useState } from 'react'

const meta = {
  title: 'Components/EditableText',
  component: EditableText,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EditableText>

export default meta
type Story = StoryObj<typeof meta>

function EditableTextDemo() {
  const [value, setValue] = useState('Click me to edit')
  return (
    <div className="p-8 bg-bg-base">
      <EditableText
        value={value}
        onSave={setValue}
        className="text-xl text-text-primary"
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <EditableTextDemo />,
}

export const WithPlaceholder: Story = {
  args: {
    value: '',
    onSave: () => {},
    placeholder: 'Add identity statement...',
    className: 'text-text-secondary italic',
  },
}
```

**Step 5: Verify Storybook renders**

Run: `npm run storybook` (check component renders)

**Step 6: Commit**

```bash
git add src/components/EditableText
git commit -m "feat(components): add EditableText tap-to-edit component"
```

---

## Task 4: Create ActionRow Component

**Files:**
- Create: `src/components/ActionRow/ActionRow.tsx`
- Create: `src/components/ActionRow/ActionRow.stories.tsx`
- Create: `src/components/ActionRow/index.ts`

**Step 1: Create component directory**

```bash
mkdir -p src/components/ActionRow
```

**Step 2: Create ActionRow.tsx**

```typescript
import { EditableText } from '../EditableText'
import type { Action } from '../../types'

interface ActionRowProps {
  action: Action
  onUpdateTitle: (title: string) => void
  onIncrement: () => void
  onDelete: () => void
}

export function ActionRow({
  action,
  onUpdateTitle,
  onIncrement,
  onDelete,
}: ActionRowProps) {
  const isComplete = action.current >= action.target

  const handleDelete = () => {
    if (window.confirm(`Delete "${action.title}"?`)) {
      onDelete()
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
      <EditableText
        value={action.title}
        onSave={onUpdateTitle}
        placeholder="Action title"
        className="text-text-primary flex-1"
      />
      <div className="flex items-center gap-3 ml-3">
        <button
          onClick={onIncrement}
          disabled={isComplete}
          className={`text-sm font-medium px-2 py-1 rounded ${
            isComplete
              ? 'text-accent-amber bg-accent-amber/10'
              : 'text-text-secondary hover:text-accent-amber hover:bg-accent-amber/10'
          } transition-colors`}
        >
          {action.current}/{action.target}
        </button>
        <button
          onClick={handleDelete}
          className="text-text-disabled hover:text-accent-coral transition-colors p-1"
          aria-label="Delete action"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
```

**Step 3: Create index.ts**

```typescript
export { ActionRow } from './ActionRow'
```

**Step 4: Create ActionRow.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ActionRow } from './ActionRow'
import { useState } from 'react'
import type { Action } from '../../types'

const meta = {
  title: 'Components/ActionRow',
  component: ActionRow,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4 bg-bg-base">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionRow>

export default meta
type Story = StoryObj<typeof meta>

function ActionRowDemo() {
  const [action, setAction] = useState<Action>({
    id: '1',
    goalId: 'goal-1',
    title: 'Run 3 times',
    target: 3,
    current: 2,
  })

  return (
    <ActionRow
      action={action}
      onUpdateTitle={(title) => setAction({ ...action, title })}
      onIncrement={() => setAction({ ...action, current: Math.min(action.current + 1, action.target) })}
      onDelete={() => alert('Deleted!')}
    />
  )
}

export const InProgress: Story = {
  render: () => <ActionRowDemo />,
}

export const Complete: Story = {
  args: {
    action: {
      id: '2',
      goalId: 'goal-1',
      title: 'Do interval training',
      target: 1,
      current: 1,
    },
    onUpdateTitle: () => {},
    onIncrement: () => {},
    onDelete: () => {},
  },
}
```

**Step 5: Verify Storybook renders**

Run: `npm run storybook` (check component renders)

**Step 6: Commit**

```bash
git add src/components/ActionRow
git commit -m "feat(components): add ActionRow with inline editing"
```

---

## Task 5: Create MilestoneRow Component

**Files:**
- Create: `src/components/MilestoneRow/MilestoneRow.tsx`
- Create: `src/components/MilestoneRow/MilestoneRow.stories.tsx`
- Create: `src/components/MilestoneRow/index.ts`

**Step 1: Create component directory**

```bash
mkdir -p src/components/MilestoneRow
```

**Step 2: Create MilestoneRow.tsx**

```typescript
import { EditableText } from '../EditableText'
import type { Milestone } from '../../types'

interface MilestoneRowProps {
  milestone: Milestone
  onUpdateTitle: (title: string) => void
  onToggleComplete: () => void
  onDelete: () => void
}

export function MilestoneRow({
  milestone,
  onUpdateTitle,
  onToggleComplete,
  onDelete,
}: MilestoneRowProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${milestone.title}"?`)) {
      onDelete()
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onToggleComplete}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            milestone.completed
              ? 'bg-accent-amber border-accent-amber'
              : 'border-text-disabled hover:border-accent-amber'
          }`}
          aria-label={milestone.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {milestone.completed && (
            <svg className="w-3 h-3 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <EditableText
          value={milestone.title}
          onSave={onUpdateTitle}
          placeholder="Milestone title"
          className={`flex-1 ${milestone.completed ? 'text-text-disabled line-through' : 'text-text-primary'}`}
        />
      </div>
      <button
        onClick={handleDelete}
        className="text-text-disabled hover:text-accent-coral transition-colors p-1 ml-2"
        aria-label="Delete milestone"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
```

**Step 3: Create index.ts**

```typescript
export { MilestoneRow } from './MilestoneRow'
```

**Step 4: Create MilestoneRow.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MilestoneRow } from './MilestoneRow'
import { useState } from 'react'
import type { Milestone } from '../../types'

const meta = {
  title: 'Components/MilestoneRow',
  component: MilestoneRow,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4 bg-bg-base">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MilestoneRow>

export default meta
type Story = StoryObj<typeof meta>

function MilestoneRowDemo() {
  const [milestone, setMilestone] = useState<Milestone>({
    id: '1',
    goalId: 'goal-1',
    title: 'Register for local 5K',
    completed: false,
    completedAt: null,
  })

  return (
    <MilestoneRow
      milestone={milestone}
      onUpdateTitle={(title) => setMilestone({ ...milestone, title })}
      onToggleComplete={() =>
        setMilestone({
          ...milestone,
          completed: !milestone.completed,
          completedAt: !milestone.completed ? new Date().toISOString() : null,
        })
      }
      onDelete={() => alert('Deleted!')}
    />
  )
}

export const Incomplete: Story = {
  render: () => <MilestoneRowDemo />,
}

export const Complete: Story = {
  args: {
    milestone: {
      id: '2',
      goalId: 'goal-1',
      title: 'Complete Couch-to-5K Week 4',
      completed: true,
      completedAt: '2024-01-15T10:00:00Z',
    },
    onUpdateTitle: () => {},
    onToggleComplete: () => {},
    onDelete: () => {},
  },
}
```

**Step 5: Verify Storybook renders**

Run: `npm run storybook` (check component renders)

**Step 6: Commit**

```bash
git add src/components/MilestoneRow
git commit -m "feat(components): add MilestoneRow with checkbox toggle"
```

---

## Task 6: Create AddItemInput Component

**Files:**
- Create: `src/components/AddItemInput/AddItemInput.tsx`
- Create: `src/components/AddItemInput/AddItemInput.stories.tsx`
- Create: `src/components/AddItemInput/index.ts`

**Step 1: Create component directory**

```bash
mkdir -p src/components/AddItemInput
```

**Step 2: Create AddItemInput.tsx**

```typescript
import { useState } from 'react'

interface AddItemInputProps {
  placeholder: string
  onAdd: (value: string) => void
}

export function AddItemInput({ placeholder, onAdd }: AddItemInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
      setValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="p-3 bg-bg-surface rounded-xl border-2 border-dashed border-text-disabled/30 hover:border-accent-amber/50 transition-colors">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-text-primary placeholder:text-text-disabled outline-none"
      />
    </div>
  )
}
```

**Step 3: Create index.ts**

```typescript
export { AddItemInput } from './AddItemInput'
```

**Step 4: Create AddItemInput.stories.tsx**

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { AddItemInput } from './AddItemInput'

const meta = {
  title: 'Components/AddItemInput',
  component: AddItemInput,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4 bg-bg-base">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddItemInput>

export default meta
type Story = StoryObj<typeof meta>

export const AddAction: Story = {
  args: {
    placeholder: '+ Add action',
    onAdd: (value) => alert(`Added: ${value}`),
  },
}

export const AddMilestone: Story = {
  args: {
    placeholder: '+ Add milestone',
    onAdd: (value) => alert(`Added: ${value}`),
  },
}
```

**Step 5: Verify Storybook renders**

Run: `npm run storybook` (check component renders)

**Step 6: Commit**

```bash
git add src/components/AddItemInput
git commit -m "feat(components): add AddItemInput for inline item creation"
```

---

## Task 7: Create GoalDetail View

**Files:**
- Create: `src/views/GoalDetail/GoalDetail.tsx`
- Create: `src/views/GoalDetail/index.ts`

**Step 1: Create view directory**

```bash
mkdir -p src/views/GoalDetail
```

**Step 2: Create GoalDetail.tsx**

```typescript
import { useAppStore } from '../../store/useAppStore'
import { ProgressRing } from '../../components/ProgressRing'
import { EditableText } from '../../components/EditableText'
import { ActionRow } from '../../components/ActionRow'
import { MilestoneRow } from '../../components/MilestoneRow'
import { AddItemInput } from '../../components/AddItemInput'
import type { Action, Milestone } from '../../types'

interface GoalDetailProps {
  goalId: string
  onBack: () => void
}

export function GoalDetail({ goalId, onBack }: GoalDetailProps) {
  const goal = useAppStore((state) => state.goals.find((g) => g.id === goalId))
  const updateGoal = useAppStore((state) => state.updateGoal)
  const deleteGoal = useAppStore((state) => state.deleteGoal)
  const updateAction = useAppStore((state) => state.updateAction)
  const addAction = useAppStore((state) => state.addAction)
  const deleteAction = useAppStore((state) => state.deleteAction)
  const addMilestone = useAppStore((state) => state.addMilestone)
  const updateMilestone = useAppStore((state) => state.updateMilestone)
  const deleteMilestone = useAppStore((state) => state.deleteMilestone)

  if (!goal) {
    return (
      <div className="min-h-screen bg-bg-base p-4">
        <button onClick={onBack} className="text-text-secondary">
          Back
        </button>
        <p className="text-text-primary mt-4">Goal not found</p>
      </div>
    )
  }

  const handleDeleteGoal = () => {
    if (window.confirm('Delete this goal and all its actions?')) {
      deleteGoal(goalId)
      onBack()
    }
  }

  const handleAddAction = (title: string) => {
    const newAction: Action = {
      id: crypto.randomUUID(),
      goalId,
      title,
      target: 1,
      current: 0,
    }
    addAction(goalId, newAction)
  }

  const handleAddMilestone = (title: string) => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      goalId,
      title,
      completed: false,
      completedAt: null,
    }
    addMilestone(goalId, newMilestone)
  }

  const handleToggleMilestone = (milestone: Milestone) => {
    updateMilestone(goalId, milestone.id, {
      completed: !milestone.completed,
      completedAt: !milestone.completed ? new Date().toISOString() : null,
    })
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <div className="p-4 border-b border-text-disabled/10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleDeleteGoal}
            className="text-text-disabled hover:text-accent-coral transition-colors p-2"
            aria-label="Delete goal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-start gap-4">
          <ProgressRing percentage={goal.percentage} size={64} strokeWidth={5} />
          <div className="flex-1">
            <EditableText
              value={goal.title}
              onSave={(title) => updateGoal(goalId, { title })}
              className="text-xl font-display text-text-primary block"
              placeholder="Goal title"
            />
            <EditableText
              value={goal.identityStatement || ''}
              onSave={(identityStatement) =>
                updateGoal(goalId, { identityStatement: identityStatement || undefined })
              }
              className="text-text-secondary italic mt-1 block"
              placeholder="Add identity statement..."
            />
          </div>
        </div>

        {/* Week history dots */}
        {goal.weekHistory.length > 0 && (
          <div className="flex gap-1.5 mt-4">
            {goal.weekHistory.map((status, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  status === 'complete'
                    ? 'bg-accent-amber'
                    : status === 'partial'
                    ? 'bg-accent-amber/50'
                    : 'bg-text-disabled/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Weekly Actions Section */}
      <div className="p-4">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
          Weekly Actions
        </h2>
        <div className="space-y-2">
          {goal.actions.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
              onUpdateTitle={(title) => {
                updateGoal(goalId, {
                  actions: goal.actions.map((a) =>
                    a.id === action.id ? { ...a, title } : a
                  ),
                })
              }}
              onIncrement={() => {
                if (action.current < action.target) {
                  updateAction(goalId, action.id, action.current + 1)
                }
              }}
              onDelete={() => deleteAction(goalId, action.id)}
            />
          ))}
          <AddItemInput placeholder="+ Add action" onAdd={handleAddAction} />
        </div>
      </div>

      {/* Milestones Section */}
      <div className="p-4 pt-0">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
          Milestones
        </h2>
        <div className="space-y-2">
          {(goal.milestones || []).map((milestone) => (
            <MilestoneRow
              key={milestone.id}
              milestone={milestone}
              onUpdateTitle={(title) => updateMilestone(goalId, milestone.id, { title })}
              onToggleComplete={() => handleToggleMilestone(milestone)}
              onDelete={() => deleteMilestone(goalId, milestone.id)}
            />
          ))}
          <AddItemInput placeholder="+ Add milestone" onAdd={handleAddMilestone} />
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Create index.ts**

```typescript
export { GoalDetail } from './GoalDetail'
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/views/GoalDetail
git commit -m "feat(views): add GoalDetail view with inline editing"
```

---

## Task 8: Update App.tsx with Goal Detail Navigation

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add state for selectedGoalId and returnTo**

Add imports and state:

```typescript
import { GoalDetail } from './views/GoalDetail'

// Inside App function:
const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
const [returnTo, setReturnTo] = useState<NavTab>('dashboard')
```

**Step 2: Add handler functions**

```typescript
const handleSelectGoal = (goalId: string, from: NavTab) => {
  setSelectedGoalId(goalId)
  setReturnTo(from)
}

const handleBack = () => {
  setActiveTab(returnTo)
  setSelectedGoalId(null)
}
```

**Step 3: Update render logic**

```typescript
if (!hasCompletedOnboarding) {
  return <Onboarding />
}

if (selectedGoalId) {
  return <GoalDetail goalId={selectedGoalId} onBack={handleBack} />
}

return (
  <>
    {activeTab === 'dashboard' && (
      <Dashboard onSelectGoal={(id) => handleSelectGoal(id, 'dashboard')} />
    )}
    {activeTab === 'today' && (
      <Today onSelectGoal={(id) => handleSelectGoal(id, 'today')} />
    )}
    {activeTab === 'settings' && <Settings />}
    <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
  </>
)
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds (will have type errors until views updated)

**Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): add Goal Detail navigation routing"
```

---

## Task 9: Update Dashboard View to Support onSelectGoal

**Files:**
- Modify: `src/views/Dashboard/Dashboard.tsx`

**Step 1: Add onSelectGoal prop**

```typescript
interface DashboardProps {
  onSelectGoal?: (goalId: string) => void
}

export function Dashboard({ onSelectGoal }: DashboardProps) {
```

**Step 2: Pass to DashboardGoalCard**

Update the DashboardGoalCard usage to include onTap:

```typescript
<DashboardGoalCard
  key={goal.id}
  goal={goal}
  onTap={() => onSelectGoal?.(goal.id)}
/>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build may have type error on DashboardGoalCard (fixed in next task)

**Step 4: Commit**

```bash
git add src/views/Dashboard
git commit -m "feat(dashboard): wire up goal selection handler"
```

---

## Task 10: Update DashboardGoalCard to Support onTap

**Files:**
- Modify: `src/components/DashboardGoalCard/DashboardGoalCard.tsx`

**Step 1: Add onTap prop to interface**

```typescript
interface DashboardGoalCardProps {
  goal: DashboardGoal
  onTap?: () => void
}
```

**Step 2: Add onClick to container**

Wrap or modify the container to be clickable:

```typescript
export function DashboardGoalCard({ goal, onTap }: DashboardGoalCardProps) {
  return (
    <div
      onClick={onTap}
      className="bg-bg-surface rounded-2xl p-4 cursor-pointer hover:bg-bg-surface/80 transition-colors"
    >
      {/* existing content */}
    </div>
  )
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/DashboardGoalCard
git commit -m "feat(dashboard-goal-card): add onTap prop for navigation"
```

---

## Task 11: Update Today View to Support onSelectGoal

**Files:**
- Modify: `src/views/Today/Today.tsx`

**Step 1: Add onSelectGoal prop**

```typescript
interface TodayProps {
  onSelectGoal?: (goalId: string) => void
}

export function Today({ onSelectGoal }: TodayProps) {
```

**Step 2: Pass to GoalCard**

Update GoalCard usage to include onTap:

```typescript
<GoalCard
  key={goal.id}
  goal={goal}
  onActionComplete={(actionId) => updateAction(goal.id, actionId, ...)}
  onTap={() => onSelectGoal?.(goal.id)}
/>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build may have type error on GoalCard (fixed in next task)

**Step 4: Commit**

```bash
git add src/views/Today
git commit -m "feat(today): wire up goal selection handler"
```

---

## Task 12: Update GoalCard to Support onTap

**Files:**
- Modify: `src/components/GoalCard/GoalCard.tsx`

**Step 1: Add onTap prop to interface**

```typescript
interface GoalCardProps {
  goal: Goal
  onActionComplete?: (actionId: string) => void
  onTap?: () => void
}
```

**Step 2: Add tap target on goal header**

Add onClick to the header area (not the action buttons):

```typescript
export function GoalCard({ goal, onActionComplete, onTap }: GoalCardProps) {
  return (
    <div className="bg-bg-surface rounded-2xl overflow-hidden">
      {/* Header - tappable */}
      <div
        onClick={onTap}
        className="p-4 cursor-pointer hover:bg-bg-surface/80 transition-colors"
      >
        {/* goal title, progress ring, identity */}
      </div>

      {/* Actions - not tappable for navigation */}
      <div className="px-4 pb-4">
        {/* action buttons */}
      </div>
    </div>
  )
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/GoalCard
git commit -m "feat(goal-card): add onTap prop for navigation"
```

---

## Task 13: Final Verification

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors

**Step 3: Manual test checklist**

Run: `npm run dev`

Verify:
- [ ] Dashboard goal cards are tappable
- [ ] Today goal cards are tappable
- [ ] GoalDetail shows correct goal
- [ ] Back button returns to correct tab
- [ ] Title editing works
- [ ] Identity editing works
- [ ] Action progress increment works
- [ ] Add action works
- [ ] Delete action works
- [ ] Add milestone works
- [ ] Toggle milestone works
- [ ] Delete milestone works
- [ ] Delete goal works and navigates back

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any issues found during verification"
```

---

## Summary

| Task | Component | Purpose |
|------|-----------|---------|
| 1 | types/index.ts | Add milestones to Goal |
| 2 | useAppStore.ts | CRUD for actions/milestones |
| 3 | EditableText | Tap-to-edit text field |
| 4 | ActionRow | Editable action with progress |
| 5 | MilestoneRow | Checkbox + editable milestone |
| 6 | AddItemInput | Inline add input |
| 7 | GoalDetail | Main view combining all |
| 8 | App.tsx | Navigation routing |
| 9-10 | Dashboard | Wire up goal selection |
| 11-12 | Today | Wire up goal selection |
| 13 | Verification | Full test pass |
