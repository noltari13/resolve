# Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Dashboard view as the app's home base with cycle progress, goal cards with milestones, and bottom tab navigation.

**Architecture:** Dashboard becomes the new main view rendered by App. BottomNav provides tab switching between Dashboard, Today, and Settings. CycleHeader shows cycle progress. DashboardGoalCard adapts existing GoalCard to show milestones instead of actions.

**Tech Stack:** React, TypeScript, Tailwind, Framer Motion, Storybook

---

## Task 1: Add Dashboard Types

**Files:**
- Modify: `src/types/index.ts`

**Step 1: Add Cycle and Milestone types**

Add to `src/types/index.ts`:

```typescript
export interface Cycle {
  id: string
  name: string
  startDate: string
  endDate: string
  durationWeeks: number
  currentWeek: number
  status: 'active' | 'completed' | 'abandoned'
}

export interface Milestone {
  id: string
  goalId: string
  title: string
  completed: boolean
  completedAt: string | null
}

export interface DashboardGoal extends Goal {
  milestones: Milestone[]
}
```

**Step 2: Commit**

Run: `git add src/types/index.ts && git commit -m "feat: add Cycle and Milestone types"`

---

## Task 2: Create BottomNav Component

**Files:**
- Create: `src/components/BottomNav/BottomNav.tsx`
- Create: `src/components/BottomNav/BottomNav.stories.tsx`
- Create: `src/components/BottomNav/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/BottomNav/BottomNav.tsx`:

```tsx
export type NavTab = 'dashboard' | 'today' | 'settings'

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: NavTab; label: string; icon: JSX.Element }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'today',
      label: 'Today',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-text-disabled/20 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex flex-col items-center gap-1 px-4 py-2 transition-colors
              ${activeTab === tab.id ? 'text-accent-amber' : 'text-text-secondary'}
            `}
          >
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-2 w-1 h-1 rounded-full bg-accent-amber" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/BottomNav/index.ts`:

```typescript
export { BottomNav } from './BottomNav'
export type { NavTab } from './BottomNav'
```

**Step 3: Create Storybook stories**

Create `src/components/BottomNav/BottomNav.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BottomNav } from './BottomNav'
import type { NavTab } from './BottomNav'

const meta: Meta<typeof BottomNav> = {
  title: 'Components/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-bg-base flex flex-col justify-end">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BottomNav>

export const Dashboard: Story = {
  args: {
    activeTab: 'dashboard',
    onTabChange: () => {},
  },
}

export const Today: Story = {
  args: {
    activeTab: 'today',
    onTabChange: () => {},
  },
}

export const Interactive: Story = {
  render: function InteractiveBottomNav() {
    const [activeTab, setActiveTab] = useState<NavTab>('dashboard')
    return <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { BottomNav } from './BottomNav'
export type { NavTab } from './BottomNav'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/BottomNav src/components/index.ts && git commit -m "feat: add BottomNav component"`

---

## Task 3: Create CycleHeader Component

**Files:**
- Create: `src/components/CycleHeader/CycleHeader.tsx`
- Create: `src/components/CycleHeader/CycleHeader.stories.tsx`
- Create: `src/components/CycleHeader/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/CycleHeader/CycleHeader.tsx`:

```tsx
import type { Cycle } from '../../types'

interface CycleHeaderProps {
  cycle: Cycle
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

export function CycleHeader({ cycle }: CycleHeaderProps) {
  const progress = (cycle.currentWeek / cycle.durationWeeks) * 100
  const daysRemaining = getDaysRemaining(cycle.endDate)

  return (
    <div className="bg-bg-surface rounded-card p-4">
      {/* Cycle name */}
      <h1 className="font-display font-bold text-lg text-text-primary">
        {cycle.name}
      </h1>

      {/* Week and days remaining */}
      <p className="text-text-secondary text-sm mt-1">
        Week {cycle.currentWeek} of {cycle.durationWeeks} • {daysRemaining} days remaining
      </p>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-2 bg-bg-base rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-amber rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Date range */}
      <div className="flex justify-between text-text-disabled text-xs mt-2">
        <span>{formatDate(cycle.startDate)}</span>
        <span>{formatDate(cycle.endDate)}</span>
      </div>
    </div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/CycleHeader/index.ts`:

```typescript
export { CycleHeader } from './CycleHeader'
```

**Step 3: Create Storybook stories**

Create `src/components/CycleHeader/CycleHeader.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CycleHeader } from './CycleHeader'

const meta: Meta<typeof CycleHeader> = {
  title: 'Components/CycleHeader',
  component: CycleHeader,
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
type Story = StoryObj<typeof CycleHeader>

export const EarlyInCycle: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'Q1 2025 Goals',
      startDate: '2025-01-06',
      endDate: '2025-03-30',
      durationWeeks: 12,
      currentWeek: 2,
      status: 'active',
    },
  },
}

export const MidCycle: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'Q1 2025 Goals',
      startDate: '2025-01-06',
      endDate: '2025-03-30',
      durationWeeks: 12,
      currentWeek: 6,
      status: 'active',
    },
  },
}

export const NearingEnd: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'Q1 2025 Goals',
      startDate: '2025-01-06',
      endDate: '2025-03-30',
      durationWeeks: 12,
      currentWeek: 11,
      status: 'active',
    },
  },
}

export const ShortCycle: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'January Sprint',
      startDate: '2025-01-06',
      endDate: '2025-02-02',
      durationWeeks: 4,
      currentWeek: 2,
      status: 'active',
    },
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { CycleHeader } from './CycleHeader'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/CycleHeader src/components/index.ts && git commit -m "feat: add CycleHeader component"`

---

## Task 4: Create MilestoneItem Component

**Files:**
- Create: `src/components/MilestoneItem/MilestoneItem.tsx`
- Create: `src/components/MilestoneItem/MilestoneItem.stories.tsx`
- Create: `src/components/MilestoneItem/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/MilestoneItem/MilestoneItem.tsx`:

```tsx
import type { Milestone } from '../../types'

interface MilestoneItemProps {
  milestone: Milestone
  variant: 'completed' | 'upcoming'
}

export function MilestoneItem({ milestone, variant }: MilestoneItemProps) {
  if (variant === 'completed') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 text-accent-amber flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-text-secondary truncate">{milestone.title}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <svg className="w-4 h-4 text-accent-coral flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      <span className="text-text-secondary truncate">Next: {milestone.title}</span>
    </div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/MilestoneItem/index.ts`:

```typescript
export { MilestoneItem } from './MilestoneItem'
```

**Step 3: Create Storybook stories**

Create `src/components/MilestoneItem/MilestoneItem.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MilestoneItem } from './MilestoneItem'

const meta: Meta<typeof MilestoneItem> = {
  title: 'Components/MilestoneItem',
  component: MilestoneItem,
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
type Story = StoryObj<typeof MilestoneItem>

export const Completed: Story = {
  args: {
    milestone: {
      id: 'm1',
      goalId: 'g1',
      title: 'Complete Couch-to-5K Week 4',
      completed: true,
      completedAt: '2025-01-15',
    },
    variant: 'completed',
  },
}

export const Upcoming: Story = {
  args: {
    milestone: {
      id: 'm2',
      goalId: 'g1',
      title: 'Register for local 5K',
      completed: false,
      completedAt: null,
    },
    variant: 'upcoming',
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { MilestoneItem } from './MilestoneItem'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/MilestoneItem src/components/index.ts && git commit -m "feat: add MilestoneItem component"`

---

## Task 5: Create DashboardGoalCard Component

**Files:**
- Create: `src/components/DashboardGoalCard/DashboardGoalCard.tsx`
- Create: `src/components/DashboardGoalCard/DashboardGoalCard.stories.tsx`
- Create: `src/components/DashboardGoalCard/index.ts`
- Modify: `src/components/index.ts`

**Step 1: Create the component**

Create `src/components/DashboardGoalCard/DashboardGoalCard.tsx`:

```tsx
import { Card } from '../Card'
import { ProgressRing } from '../ProgressRing'
import { WeekDots } from '../WeekDots'
import { MilestoneItem } from '../MilestoneItem'
import type { DashboardGoal } from '../../types'

interface DashboardGoalCardProps {
  goal: DashboardGoal
  onTap?: () => void
}

export function DashboardGoalCard({ goal, onTap }: DashboardGoalCardProps) {
  const completedMilestones = goal.milestones.filter((m) => m.completed)
  const upcomingMilestones = goal.milestones.filter((m) => !m.completed)

  const lastCompleted = completedMilestones[completedMilestones.length - 1]
  const nextUpcoming = upcomingMilestones[0]

  return (
    <Card className={onTap ? 'cursor-pointer' : ''}>
      <div onClick={onTap}>
        {/* Header: Title + Ring */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg truncate">
              {goal.title}
            </h3>
            {goal.identityStatement && (
              <p className="text-text-secondary text-sm mt-0.5 truncate">
                "{goal.identityStatement}"
              </p>
            )}
            <div className="mt-2">
              <WeekDots weeks={goal.weekHistory} />
            </div>
          </div>
          <ProgressRing percentage={goal.percentage} size={56} />
        </div>

        {/* Milestones */}
        {(lastCompleted || nextUpcoming) && (
          <>
            <div className="border-t border-text-disabled/20 my-3" />
            <div className="space-y-2">
              {lastCompleted && (
                <MilestoneItem milestone={lastCompleted} variant="completed" />
              )}
              {nextUpcoming && (
                <MilestoneItem milestone={nextUpcoming} variant="upcoming" />
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
```

**Step 2: Create the barrel export**

Create `src/components/DashboardGoalCard/index.ts`:

```typescript
export { DashboardGoalCard } from './DashboardGoalCard'
```

**Step 3: Create Storybook stories**

Create `src/components/DashboardGoalCard/DashboardGoalCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardGoalCard } from './DashboardGoalCard'

const meta: Meta<typeof DashboardGoalCard> = {
  title: 'Components/DashboardGoalCard',
  component: DashboardGoalCard,
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
type Story = StoryObj<typeof DashboardGoalCard>

export const WithMilestones: Story = {
  args: {
    goal: {
      id: 'g1',
      title: 'Run a 5K',
      identityStatement: 'I am becoming a runner',
      percentage: 73,
      weekHistory: ['complete', 'complete', 'partial', 'missed'],
      actions: [],
      milestones: [
        { id: 'm1', goalId: 'g1', title: 'Complete Couch-to-5K Week 4', completed: true, completedAt: '2025-01-15' },
        { id: 'm2', goalId: 'g1', title: 'Register for local 5K', completed: false, completedAt: null },
        { id: 'm3', goalId: 'g1', title: 'Run 5K under 35 minutes', completed: false, completedAt: null },
      ],
    },
  },
}

export const NoMilestones: Story = {
  args: {
    goal: {
      id: 'g2',
      title: 'Financial clarity',
      identityStatement: 'I am becoming financially literate',
      percentage: 45,
      weekHistory: ['partial', 'complete', 'missed', 'partial'],
      actions: [],
      milestones: [],
    },
  },
}

export const OnlyUpcoming: Story = {
  args: {
    goal: {
      id: 'g3',
      title: 'Learn Spanish',
      percentage: 25,
      weekHistory: ['missed', 'partial', 'missed', 'missed'],
      actions: [],
      milestones: [
        { id: 'm1', goalId: 'g3', title: 'Complete Duolingo Unit 1', completed: false, completedAt: null },
      ],
    },
  },
}

export const AllCompleted: Story = {
  args: {
    goal: {
      id: 'g4',
      title: 'Morning Routine',
      identityStatement: 'I am becoming an early riser',
      percentage: 100,
      weekHistory: ['complete', 'complete', 'complete', 'complete'],
      actions: [],
      milestones: [
        { id: 'm1', goalId: 'g4', title: 'Wake at 6am for 7 days', completed: true, completedAt: '2025-01-10' },
        { id: 'm2', goalId: 'g4', title: 'Establish meditation habit', completed: true, completedAt: '2025-01-20' },
      ],
    },
  },
}
```

**Step 4: Add to components barrel**

Add to `src/components/index.ts`:

```typescript
export { DashboardGoalCard } from './DashboardGoalCard'
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/components/DashboardGoalCard src/components/index.ts && git commit -m "feat: add DashboardGoalCard component"`

---

## Task 6: Create Dashboard View

**Files:**
- Create: `src/views/Dashboard/Dashboard.tsx`
- Create: `src/views/Dashboard/mockData.ts`
- Create: `src/views/Dashboard/index.ts`
- Create: `src/views/Dashboard/Dashboard.stories.tsx`

**Step 1: Create mock data**

Create `src/views/Dashboard/mockData.ts`:

```typescript
import type { Cycle, DashboardGoal } from '../../types'

export const mockCycle: Cycle = {
  id: 'c1',
  name: 'Q1 2025 Goals',
  startDate: '2025-01-06',
  endDate: '2025-03-30',
  durationWeeks: 12,
  currentWeek: 4,
  status: 'active',
}

export const mockDashboardGoals: DashboardGoal[] = [
  {
    id: 'g1',
    title: 'Run a 5K',
    identityStatement: 'I am becoming a runner',
    percentage: 73,
    weekHistory: ['complete', 'complete', 'partial', 'missed'],
    actions: [],
    milestones: [
      { id: 'm1', goalId: 'g1', title: 'Complete Couch-to-5K Week 4', completed: true, completedAt: '2025-01-15' },
      { id: 'm2', goalId: 'g1', title: 'Register for local 5K', completed: false, completedAt: null },
    ],
  },
  {
    id: 'g2',
    title: 'Financial clarity',
    identityStatement: 'I am becoming financially literate',
    percentage: 45,
    weekHistory: ['partial', 'complete', 'missed', 'partial'],
    actions: [],
    milestones: [
      { id: 'm3', goalId: 'g2', title: 'Create monthly budget', completed: true, completedAt: '2025-01-10' },
      { id: 'm4', goalId: 'g2', title: 'Set up emergency fund', completed: false, completedAt: null },
    ],
  },
  {
    id: 'g3',
    title: 'Learn Spanish',
    percentage: 25,
    weekHistory: ['missed', 'partial', 'missed', 'missed'],
    actions: [],
    milestones: [
      { id: 'm5', goalId: 'g3', title: 'Complete Duolingo Unit 1', completed: false, completedAt: null },
    ],
  },
]
```

**Step 2: Create Dashboard view**

Create `src/views/Dashboard/Dashboard.tsx`:

```tsx
import { CycleHeader } from '../../components/CycleHeader'
import { DashboardGoalCard } from '../../components/DashboardGoalCard'
import { mockCycle, mockDashboardGoals } from './mockData'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Cycle Header */}
        <CycleHeader cycle={mockCycle} />

        {/* Goals */}
        <div className="mt-6 space-y-4">
          {mockDashboardGoals.map((goal) => (
            <DashboardGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 3: Create the barrel export**

Create `src/views/Dashboard/index.ts`:

```typescript
export { Dashboard } from './Dashboard'
```

**Step 4: Create Storybook stories**

Create `src/views/Dashboard/Dashboard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard } from './Dashboard'

const meta: Meta<typeof Dashboard> = {
  title: 'Views/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Dashboard>

export const Default: Story = {}
```

**Step 5: Verify build passes**

Run: `npm run build`

**Step 6: Commit**

Run: `git add src/views/Dashboard && git commit -m "feat: add Dashboard view"`

---

## Task 7: Create Settings Stub View

**Files:**
- Create: `src/views/Settings/Settings.tsx`
- Create: `src/views/Settings/index.ts`

**Step 1: Create Settings stub**

Create `src/views/Settings/Settings.tsx`:

```tsx
export function Settings() {
  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="font-display font-bold text-xl text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary mt-2">
          Settings will be available in a future update.
        </p>
      </div>
    </div>
  )
}
```

**Step 2: Create the barrel export**

Create `src/views/Settings/index.ts`:

```typescript
export { Settings } from './Settings'
```

**Step 3: Verify build passes**

Run: `npm run build`

**Step 4: Commit**

Run: `git add src/views/Settings && git commit -m "feat: add Settings stub view"`

---

## Task 8: Update App with Navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/views/Today/Today.tsx`

**Step 1: Update App.tsx with tab navigation**

Replace `src/App.tsx`:

```tsx
import { useState } from 'react'
import { Dashboard } from './views/Dashboard'
import { Today } from './views/Today'
import { Settings } from './views/Settings'
import { BottomNav } from './components/BottomNav'
import type { NavTab } from './components/BottomNav'

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')

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

**Step 2: Update Today.tsx to remove TopBar and add bottom padding**

The Today view needs to remove TopBar (navigation is now via BottomNav) and add bottom padding for the nav bar. Read the current Today.tsx first, then modify it to:

1. Remove the TopBar import and usage
2. Add `pb-20` to the main container for bottom nav clearance
3. Keep the ReviewPrompt and WeeklyReview logic

The key changes are:
- Remove: `import { TopBar } from '../../components/TopBar'`
- Remove: `<TopBar />` from the render
- Change: `<div className="min-h-screen bg-bg-base">` to `<div className="min-h-screen bg-bg-base pb-20">`

**Step 3: Verify build passes**

Run: `npm run build`

**Step 4: Commit**

Run: `git add src/App.tsx src/views/Today/Today.tsx && git commit -m "feat: add tab navigation with BottomNav"`

---

## Task 9: Move ReviewPrompt to Dashboard

**Files:**
- Modify: `src/views/Dashboard/Dashboard.tsx`
- Modify: `src/views/Today/Today.tsx`

**Step 1: Update Dashboard to include ReviewPrompt**

Update `src/views/Dashboard/Dashboard.tsx`:

```tsx
import { useState } from 'react'
import { CycleHeader } from '../../components/CycleHeader'
import { DashboardGoalCard } from '../../components/DashboardGoalCard'
import { ReviewPrompt } from '../../components/ReviewPrompt'
import { WeeklyReview } from '../WeeklyReview'
import { mockCycle, mockDashboardGoals } from './mockData'

export function Dashboard() {
  const [showReviewPrompt, setShowReviewPrompt] = useState(true)
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)

  if (showWeeklyReview) {
    return <WeeklyReview />
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Review Prompt */}
        {showReviewPrompt && (
          <div className="mb-4">
            <ReviewPrompt
              weekNumber={mockCycle.currentWeek}
              onReviewNow={() => setShowWeeklyReview(true)}
              onLater={() => setShowReviewPrompt(false)}
            />
          </div>
        )}

        {/* Cycle Header */}
        <CycleHeader cycle={mockCycle} />

        {/* Goals */}
        <div className="mt-6 space-y-4">
          {mockDashboardGoals.map((goal) => (
            <DashboardGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Remove ReviewPrompt from Today view**

In `src/views/Today/Today.tsx`:
- Remove the ReviewPrompt import
- Remove the showReviewPrompt and showWeeklyReview state
- Remove the ReviewPrompt conditional rendering
- Remove the WeeklyReview conditional return

The Today view should now only show the TodayFocus and GoalCards.

**Step 3: Verify build passes**

Run: `npm run build`

**Step 4: Commit**

Run: `git add src/views/Dashboard src/views/Today && git commit -m "feat: move ReviewPrompt to Dashboard"`

---

## Task 10: Final Build Verification

**Files:** None (verification only)

**Step 1: Run all checks**

Run: `npm run build && npm run lint`
Expected: Both pass with no errors.

**Step 2: Verify Storybook**

Run: `npm run storybook`
Verify: All new components and views appear and work correctly.

**Step 3: Final commit (if any unstaged changes)**

Run: `git status`
If clean, no commit needed.

---

## Summary

This plan creates:
- 4 new components (BottomNav, CycleHeader, MilestoneItem, DashboardGoalCard)
- 2 new views (Dashboard, Settings stub)
- Tab-based navigation system
- ReviewPrompt moved from Today to Dashboard

All components follow existing patterns: Tailwind styling, barrel exports, Storybook stories.
