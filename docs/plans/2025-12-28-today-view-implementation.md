# Today View Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive Today View prototype with Storybook-first component development, mock data, and completion animations.

**Architecture:** Vite + React 18 + TypeScript foundation. Components built in isolation with Storybook, composed into Today view. CSS custom properties for design tokens, Tailwind for utilities. Mock data simulates real goal/action structure.

**Tech Stack:** Vite, React 18, TypeScript, TailwindCSS, Storybook 8, Framer Motion (animations)

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`

**Step 1: Create Vite React TypeScript project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

Select "Ignore files and continue" if prompted about existing files.

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify it runs**

Run:
```bash
npm run dev
```

Expected: Dev server starts, shows Vite + React default page.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite React TypeScript project"
```

---

## Task 2: Tailwind CSS Setup

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css`

**Step 1: Install Tailwind**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 2: Configure Tailwind**

Replace `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#121212',
        'bg-surface': '#262220',
        'bg-surface-hover': '#302c28',
        'accent-amber': '#E8A850',
        'accent-coral': '#D4836A',
        'text-primary': '#F5F0EB',
        'text-secondary': '#9A9590',
        'text-disabled': '#5A5550',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 12px rgba(30, 25, 20, 0.4)',
      },
      borderRadius: {
        'card': '14px',
      },
    },
  },
  plugins: [],
}
```

**Step 3: Add Tailwind directives to CSS**

Replace `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Outfit:wght@600;700&display=swap');

body {
  @apply bg-bg-base text-text-primary font-body;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 4: Test Tailwind works**

Replace `src/App.tsx`:
```tsx
function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="font-display text-2xl font-bold text-accent-amber">
        Resolve
      </h1>
      <p className="mt-2 text-text-secondary">
        Tailwind is working.
      </p>
    </div>
  )
}

export default App
```

**Step 5: Verify in browser**

Run:
```bash
npm run dev
```

Expected: Dark background, amber "Resolve" heading in Outfit font.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind with design tokens"
```

---

## Task 3: Storybook Setup

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`

**Step 1: Install Storybook**

Run:
```bash
npx storybook@latest init --builder vite
```

Accept defaults when prompted.

**Step 2: Update preview to include styles**

Replace `.storybook/preview.ts`:
```ts
import type { Preview } from '@storybook/react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#121212' },
        { name: 'surface', value: '#262220' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

**Step 3: Remove default stories**

Run:
```bash
rm -rf src/stories
```

**Step 4: Verify Storybook runs**

Run:
```bash
npm run storybook
```

Expected: Storybook opens with dark background, no stories yet.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: setup Storybook with dark theme"
```

---

## Task 4: Card Component

**Files:**
- Create: `src/components/Card/Card.tsx`
- Create: `src/components/Card/Card.stories.tsx`
- Create: `src/components/Card/index.ts`

**Step 1: Create Card component**

Create `src/components/Card/Card.tsx`:
```tsx
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-bg-surface rounded-card shadow-card p-4
        transition-colors duration-150
        hover:bg-bg-surface-hover
        ${className}
      `}
    >
      {children}
    </div>
  )
}
```

**Step 2: Create index export**

Create `src/components/Card/index.ts`:
```ts
export { Card } from './Card'
```

**Step 3: Create Card stories**

Create `src/components/Card/Card.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: (
      <div className="w-80">
        <h3 className="font-display font-semibold text-lg">Goal Title</h3>
        <p className="text-text-secondary text-sm mt-1">
          Supporting text goes here
        </p>
      </div>
    ),
  },
}

export const WithContent: Story = {
  args: {
    children: (
      <div className="w-80">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-semibold text-lg">Run a 5K</h3>
            <p className="text-text-secondary text-sm mt-1">
              "I am becoming a runner"
            </p>
          </div>
          <span className="text-accent-amber font-display font-bold">78%</span>
        </div>
      </div>
    ),
  },
}
```

**Step 4: Verify in Storybook**

Run:
```bash
npm run storybook
```

Expected: Card component visible with warm surface, shadow, hover state.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Card component with warm elevation"
```

---

## Task 5: ProgressRing Component

**Files:**
- Create: `src/components/ProgressRing/ProgressRing.tsx`
- Create: `src/components/ProgressRing/ProgressRing.stories.tsx`
- Create: `src/components/ProgressRing/index.ts`

**Step 1: Install Framer Motion**

Run:
```bash
npm install framer-motion
```

**Step 2: Create ProgressRing component**

Create `src/components/ProgressRing/ProgressRing.tsx`:
```tsx
import { motion } from 'framer-motion'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
}

export function ProgressRing({
  percentage,
  size = 48,
  strokeWidth = 4,
  showLabel = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring - warm muted amber */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-accent-amber/20"
        />
        {/* Progress ring - solid amber */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-accent-amber"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showLabel && (
        <span className="absolute font-display font-bold text-sm text-accent-amber">
          {percentage}%
        </span>
      )}
    </div>
  )
}
```

**Step 3: Create index export**

Create `src/components/ProgressRing/index.ts`:
```ts
export { ProgressRing } from './ProgressRing'
```

**Step 4: Create ProgressRing stories**

Create `src/components/ProgressRing/ProgressRing.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressRing } from './ProgressRing'

const meta: Meta<typeof ProgressRing> = {
  title: 'Components/ProgressRing',
  component: ProgressRing,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ProgressRing>

export const Empty: Story = {
  args: {
    percentage: 0,
  },
}

export const Partial: Story = {
  args: {
    percentage: 45,
  },
}

export const MostlyComplete: Story = {
  args: {
    percentage: 78,
  },
}

export const Complete: Story = {
  args: {
    percentage: 100,
  },
}

export const WithLabel: Story = {
  args: {
    percentage: 73,
    size: 64,
    showLabel: true,
  },
}

export const Large: Story = {
  args: {
    percentage: 65,
    size: 80,
    strokeWidth: 6,
    showLabel: true,
  },
}
```

**Step 5: Verify in Storybook**

Check that:
- 0% shows muted amber outline (not empty)
- Percentages animate smoothly on mount
- Label centers properly when enabled

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add ProgressRing with animated fill"
```

---

## Task 6: WeekDots Component

**Files:**
- Create: `src/components/WeekDots/WeekDots.tsx`
- Create: `src/components/WeekDots/WeekDots.stories.tsx`
- Create: `src/components/WeekDots/index.ts`

**Step 1: Create WeekDots component**

Create `src/components/WeekDots/WeekDots.tsx`:
```tsx
type WeekStatus = 'complete' | 'partial' | 'missed'

interface WeekDotsProps {
  weeks: WeekStatus[]
}

export function WeekDots({ weeks }: WeekDotsProps) {
  return (
    <div className="flex gap-1.5">
      {weeks.map((status, index) => (
        <div
          key={index}
          className={`
            w-2 h-2 rounded-full
            ${status === 'complete' ? 'bg-accent-amber' : ''}
            ${status === 'partial' ? 'bg-accent-amber/50' : ''}
            ${status === 'missed' ? 'border border-accent-amber/30 bg-transparent' : ''}
          `}
          title={`Week ${index + 1}: ${status}`}
        />
      ))}
    </div>
  )
}
```

**Step 2: Create index export**

Create `src/components/WeekDots/index.ts`:
```ts
export { WeekDots } from './WeekDots'
```

**Step 3: Create WeekDots stories**

Create `src/components/WeekDots/WeekDots.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { WeekDots } from './WeekDots'

const meta: Meta<typeof WeekDots> = {
  title: 'Components/WeekDots',
  component: WeekDots,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof WeekDots>

export const AllComplete: Story = {
  args: {
    weeks: ['complete', 'complete', 'complete', 'complete'],
  },
}

export const Mixed: Story = {
  args: {
    weeks: ['complete', 'complete', 'partial', 'missed'],
  },
}

export const Struggling: Story = {
  args: {
    weeks: ['missed', 'partial', 'missed', 'partial'],
  },
}

export const JustStarted: Story = {
  args: {
    weeks: ['partial'],
  },
}
```

**Step 4: Verify in Storybook**

Check that:
- Complete dots are solid amber
- Partial dots are 50% opacity amber
- Missed dots are outlined only (not punishing gray)

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add WeekDots trend indicator"
```

---

## Task 7: ActionItem Component

**Files:**
- Create: `src/components/ActionItem/ActionItem.tsx`
- Create: `src/components/ActionItem/ActionItem.stories.tsx`
- Create: `src/components/ActionItem/index.ts`

**Step 1: Create ActionItem component**

Create `src/components/ActionItem/ActionItem.tsx`:
```tsx
import { motion } from 'framer-motion'
import { useState } from 'react'

interface ActionItemProps {
  title: string
  current: number
  target: number
  onComplete?: () => void
}

export function ActionItem({ title, current, target, onComplete }: ActionItemProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const isComplete = current >= target

  const handleTap = () => {
    if (isComplete) return
    setIsAnimating(true)
    onComplete?.()
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleTap}
      disabled={isComplete}
      className={`
        w-full flex items-center gap-3 py-2 px-1 rounded-lg
        transition-colors duration-150
        ${isComplete ? 'opacity-60' : 'hover:bg-bg-surface-hover'}
      `}
    >
      {/* Circle/Checkbox */}
      <div className="relative">
        <motion.div
          className={`
            w-5 h-5 rounded-full border-2
            flex items-center justify-center
            ${isComplete
              ? 'bg-accent-amber border-accent-amber'
              : 'border-accent-coral'
            }
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

        {/* Pulse animation on complete */}
        {isAnimating && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent-amber"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Text */}
      <span className={`flex-1 text-left ${isComplete ? 'line-through' : ''}`}>
        {title}
      </span>

      {/* Count */}
      <span className="text-text-secondary text-sm">
        ({current}/{target})
      </span>
    </button>
  )
}
```

**Step 2: Create index export**

Create `src/components/ActionItem/index.ts`:
```ts
export { ActionItem } from './ActionItem'
```

**Step 3: Create ActionItem stories**

Create `src/components/ActionItem/ActionItem.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ActionItem } from './ActionItem'

const meta: Meta<typeof ActionItem> = {
  title: 'Components/ActionItem',
  component: ActionItem,
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
type Story = StoryObj<typeof ActionItem>

export const NotStarted: Story = {
  args: {
    title: 'Run 3x this week',
    current: 0,
    target: 3,
  },
}

export const InProgress: Story = {
  args: {
    title: 'Run 3x this week',
    current: 1,
    target: 3,
  },
}

export const AlmostDone: Story = {
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

// Interactive story
export const Interactive: Story = {
  render: function InteractiveActionItem() {
    const [current, setCurrent] = useState(1)
    return (
      <ActionItem
        title="Run 3x this week"
        current={current}
        target={3}
        onComplete={() => setCurrent((c) => Math.min(c + 1, 3))}
      />
    )
  },
}
```

**Step 4: Verify in Storybook**

Check that:
- Coral outline on incomplete items
- Warm pulse animation on tap
- Checkmark appears when complete
- Count updates correctly

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add ActionItem with pulse animation"
```

---

## Task 8: GoalCard Component

**Files:**
- Create: `src/components/GoalCard/GoalCard.tsx`
- Create: `src/components/GoalCard/GoalCard.stories.tsx`
- Create: `src/components/GoalCard/index.ts`
- Create: `src/types/index.ts`

**Step 1: Create shared types**

Create `src/types/index.ts`:
```ts
export type WeekStatus = 'complete' | 'partial' | 'missed'

export interface Action {
  id: string
  title: string
  current: number
  target: number
}

export interface Goal {
  id: string
  title: string
  identityStatement?: string
  percentage: number
  weekHistory: WeekStatus[]
  actions: Action[]
}
```

**Step 2: Create GoalCard component**

Create `src/components/GoalCard/GoalCard.tsx`:
```tsx
import { Card } from '../Card'
import { ProgressRing } from '../ProgressRing'
import { WeekDots } from '../WeekDots'
import { ActionItem } from '../ActionItem'
import type { Goal } from '../../types'

interface GoalCardProps {
  goal: Goal
  onActionComplete?: (actionId: string) => void
}

export function GoalCard({ goal, onActionComplete }: GoalCardProps) {
  return (
    <Card>
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
        <ProgressRing percentage={goal.percentage} size={48} />
      </div>

      {/* Divider */}
      <div className="border-t border-text-disabled/20 my-3" />

      {/* Actions */}
      <div className="space-y-1">
        {goal.actions.map((action) => (
          <ActionItem
            key={action.id}
            title={action.title}
            current={action.current}
            target={action.target}
            onComplete={() => onActionComplete?.(action.id)}
          />
        ))}
      </div>
    </Card>
  )
}
```

**Step 3: Create index export**

Create `src/components/GoalCard/index.ts`:
```ts
export { GoalCard } from './GoalCard'
```

**Step 4: Create GoalCard stories**

Create `src/components/GoalCard/GoalCard.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { GoalCard } from './GoalCard'
import type { Goal } from '../../types'

const meta: Meta<typeof GoalCard> = {
  title: 'Components/GoalCard',
  component: GoalCard,
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
type Story = StoryObj<typeof GoalCard>

const baseGoal: Goal = {
  id: '1',
  title: 'Run a 5K',
  identityStatement: 'I am becoming a runner',
  percentage: 78,
  weekHistory: ['complete', 'complete', 'partial', 'missed'],
  actions: [
    { id: 'a1', title: 'Run 3x this week', current: 2, target: 3 },
    { id: 'a2', title: 'Interval session', current: 0, target: 1 },
  ],
}

export const Default: Story = {
  args: {
    goal: baseGoal,
  },
}

export const NoIdentity: Story = {
  args: {
    goal: {
      ...baseGoal,
      identityStatement: undefined,
    },
  },
}

export const JustStarted: Story = {
  args: {
    goal: {
      ...baseGoal,
      percentage: 12,
      weekHistory: ['partial'],
      actions: [
        { id: 'a1', title: 'Run 3x this week', current: 0, target: 3 },
        { id: 'a2', title: 'Interval session', current: 0, target: 1 },
      ],
    },
  },
}

export const AllComplete: Story = {
  args: {
    goal: {
      ...baseGoal,
      percentage: 100,
      weekHistory: ['complete', 'complete', 'complete', 'complete'],
      actions: [
        { id: 'a1', title: 'Run 3x this week', current: 3, target: 3 },
        { id: 'a2', title: 'Interval session', current: 1, target: 1 },
      ],
    },
  },
}

export const Interactive: Story = {
  render: function InteractiveGoalCard() {
    const [goal, setGoal] = useState<Goal>(baseGoal)

    const handleComplete = (actionId: string) => {
      setGoal((prev) => ({
        ...prev,
        actions: prev.actions.map((a) =>
          a.id === actionId
            ? { ...a, current: Math.min(a.current + 1, a.target) }
            : a
        ),
      }))
    }

    return <GoalCard goal={goal} onActionComplete={handleComplete} />
  },
}
```

**Step 5: Verify in Storybook**

Check that:
- Ring and dots align nicely with title
- Identity statement appears muted below title
- Actions list with proper spacing
- Interactive story allows completing actions

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add GoalCard composing ring, dots, actions"
```

---

## Task 9: TodayFocus Component

**Files:**
- Create: `src/components/TodayFocus/TodayFocus.tsx`
- Create: `src/components/TodayFocus/TodayFocus.stories.tsx`
- Create: `src/components/TodayFocus/index.ts`

**Step 1: Create FocusAction type and TodayFocus component**

Create `src/components/TodayFocus/TodayFocus.tsx`:
```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { ActionItem } from '../ActionItem'

export interface FocusAction {
  id: string
  goalId: string
  title: string
  current: number
  target: number
}

interface TodayFocusProps {
  actions: FocusAction[]
  onActionComplete?: (actionId: string, goalId: string) => void
}

export function TodayFocus({ actions, onActionComplete }: TodayFocusProps) {
  const incompleteActions = actions.filter((a) => a.current < a.target)
  const count = incompleteActions.length

  if (count === 0) {
    return (
      <div className="bg-bg-surface rounded-card p-4 text-center">
        <p className="text-text-secondary">
          Nothing on deck today. Enjoy the space.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface rounded-card p-4">
      <h2 className="text-text-secondary text-sm font-medium mb-3">
        {count} action{count !== 1 ? 's' : ''} today
      </h2>
      <AnimatePresence mode="popLayout">
        {incompleteActions.slice(0, 5).map((action) => (
          <motion.div
            key={action.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ActionItem
              title={action.title}
              current={action.current}
              target={action.target}
              onComplete={() => onActionComplete?.(action.id, action.goalId)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {incompleteActions.length > 5 && (
        <p className="text-text-secondary text-sm mt-2">
          +{incompleteActions.length - 5} more
        </p>
      )}
    </div>
  )
}
```

**Step 2: Create index export**

Create `src/components/TodayFocus/index.ts`:
```ts
export { TodayFocus } from './TodayFocus'
export type { FocusAction } from './TodayFocus'
```

**Step 3: Create TodayFocus stories**

Create `src/components/TodayFocus/TodayFocus.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TodayFocus, FocusAction } from './TodayFocus'

const meta: Meta<typeof TodayFocus> = {
  title: 'Components/TodayFocus',
  component: TodayFocus,
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
type Story = StoryObj<typeof TodayFocus>

const baseActions: FocusAction[] = [
  { id: 'a1', goalId: 'g1', title: 'Run 3x this week', current: 1, target: 3 },
  { id: 'a2', goalId: 'g1', title: 'Interval session', current: 0, target: 1 },
  { id: 'a3', goalId: 'g2', title: 'Review budget', current: 0, target: 1 },
]

export const Default: Story = {
  args: {
    actions: baseActions,
  },
}

export const SingleAction: Story = {
  args: {
    actions: [baseActions[0]],
  },
}

export const AllComplete: Story = {
  args: {
    actions: [
      { id: 'a1', goalId: 'g1', title: 'Run 3x this week', current: 3, target: 3 },
    ],
  },
}

export const ManyActions: Story = {
  args: {
    actions: [
      ...baseActions,
      { id: 'a4', goalId: 'g3', title: 'Read 20 pages', current: 0, target: 1 },
      { id: 'a5', goalId: 'g3', title: 'Practice Spanish', current: 0, target: 1 },
      { id: 'a6', goalId: 'g4', title: 'Meditate', current: 0, target: 1 },
      { id: 'a7', goalId: 'g4', title: 'Journal', current: 0, target: 1 },
    ],
  },
}

export const Interactive: Story = {
  render: function InteractiveTodayFocus() {
    const [actions, setActions] = useState<FocusAction[]>(baseActions)

    const handleComplete = (actionId: string) => {
      setActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? { ...a, current: Math.min(a.current + 1, a.target) }
            : a
        )
      )
    }

    return <TodayFocus actions={actions} onActionComplete={handleComplete} />
  },
}
```

**Step 4: Verify in Storybook**

Check that:
- Header shows correct count
- Completed actions fade out
- Empty state shows encouraging message
- "+N more" shows when exceeding 5 actions

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add TodayFocus sticky section"
```

---

## Task 10: TopBar Component

**Files:**
- Create: `src/components/TopBar/TopBar.tsx`
- Create: `src/components/TopBar/TopBar.stories.tsx`
- Create: `src/components/TopBar/index.ts`

**Step 1: Create TopBar component**

Create `src/components/TopBar/TopBar.tsx`:
```tsx
interface TopBarProps {
  title?: string
  onGoalsClick?: () => void
  onSettingsClick?: () => void
}

export function TopBar({
  title = 'Today',
  onGoalsClick,
  onSettingsClick
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between py-4 px-4">
      {/* Logo */}
      <div className="w-8 h-8 rounded-lg bg-accent-amber/20 flex items-center justify-center">
        <span className="text-accent-amber font-display font-bold text-sm">R</span>
      </div>

      {/* Title */}
      <h1 className="font-display font-semibold text-lg">{title}</h1>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGoalsClick}
          className="w-8 h-8 rounded-lg hover:bg-bg-surface flex items-center justify-center transition-colors"
          aria-label="Goals"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
        <button
          onClick={onSettingsClick}
          className="w-8 h-8 rounded-lg hover:bg-bg-surface flex items-center justify-center transition-colors"
          aria-label="Settings"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
```

**Step 2: Create index export**

Create `src/components/TopBar/index.ts`:
```ts
export { TopBar } from './TopBar'
```

**Step 3: Create TopBar stories**

Create `src/components/TopBar/TopBar.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { TopBar } from './TopBar'

const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-bg-base">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TopBar>

export const Default: Story = {
  args: {},
}

export const GoalsView: Story = {
  args: {
    title: 'Goals',
  },
}
```

**Step 4: Verify in Storybook**

Check that:
- Logo, title, and icons are properly aligned
- Hover states work on buttons
- Layout is compact but tappable

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add TopBar navigation component"
```

---

## Task 11: Today View Composition

**Files:**
- Create: `src/views/Today/Today.tsx`
- Create: `src/views/Today/index.ts`
- Create: `src/views/Today/mockData.ts`
- Modify: `src/App.tsx`

**Step 1: Create mock data**

Create `src/views/Today/mockData.ts`:
```ts
import type { Goal } from '../../types'
import type { FocusAction } from '../../components/TodayFocus'

export const mockGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Run a 5K',
    identityStatement: 'I am becoming a runner',
    percentage: 78,
    weekHistory: ['complete', 'complete', 'partial', 'missed'],
    actions: [
      { id: 'a1', title: 'Run 3x this week', current: 2, target: 3 },
      { id: 'a2', title: 'Interval session', current: 0, target: 1 },
    ],
  },
  {
    id: 'g2',
    title: 'Financial clarity',
    identityStatement: 'I am becoming financially literate',
    percentage: 45,
    weekHistory: ['partial', 'complete', 'missed', 'partial'],
    actions: [
      { id: 'a3', title: 'Review budget', current: 0, target: 1 },
      { id: 'a4', title: 'Track expenses', current: 3, target: 7 },
    ],
  },
  {
    id: 'g3',
    title: 'Learn Spanish',
    percentage: 25,
    weekHistory: ['missed', 'partial', 'missed', 'missed'],
    actions: [
      { id: 'a5', title: 'Duolingo session', current: 1, target: 5 },
      { id: 'a6', title: 'Watch Spanish show', current: 0, target: 2 },
    ],
  },
]

export function getFocusActions(goals: Goal[]): FocusAction[] {
  return goals.flatMap((goal) =>
    goal.actions
      .filter((action) => action.current < action.target)
      .map((action) => ({
        ...action,
        goalId: goal.id,
      }))
  )
}
```

**Step 2: Create Today view**

Create `src/views/Today/Today.tsx`:
```tsx
import { useState, useCallback } from 'react'
import { TopBar } from '../../components/TopBar'
import { TodayFocus } from '../../components/TodayFocus'
import { GoalCard } from '../../components/GoalCard'
import type { Goal } from '../../types'
import { mockGoals, getFocusActions } from './mockData'

export function Today() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)

  const handleActionComplete = useCallback((actionId: string, goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal

        const updatedActions = goal.actions.map((action) => {
          if (action.id !== actionId) return action
          return { ...action, current: Math.min(action.current + 1, action.target) }
        })

        // Recalculate percentage
        const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
        const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
        const percentage = Math.round((totalCurrent / totalTarget) * 100)

        return { ...goal, actions: updatedActions, percentage }
      })
    )
  }, [])

  const focusActions = getFocusActions(goals)

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto">
        <TopBar />

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

**Step 3: Create index export**

Create `src/views/Today/index.ts`:
```ts
export { Today } from './Today'
```

**Step 4: Update App to render Today view**

Replace `src/App.tsx`:
```tsx
import { Today } from './views/Today'

function App() {
  return <Today />
}

export default App
```

**Step 5: Create components barrel export**

Create `src/components/index.ts`:
```ts
export { Card } from './Card'
export { ProgressRing } from './ProgressRing'
export { WeekDots } from './WeekDots'
export { ActionItem } from './ActionItem'
export { GoalCard } from './GoalCard'
export { TodayFocus } from './TodayFocus'
export { TopBar } from './TopBar'
```

**Step 6: Verify full app**

Run:
```bash
npm run dev
```

Expected:
- Dark background with warm surfaces
- TopBar with logo, "Today", and icons
- Sticky TodayFocus section with incomplete actions
- GoalCards below with rings, dots, and actions
- Completing actions updates both focus section and goal cards
- Progress rings animate on change

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: compose Today view with mock data"
```

---

## Task 12: Polish and All-Complete State

**Files:**
- Modify: `src/components/TodayFocus/TodayFocus.tsx`
- Modify: `src/views/Today/Today.tsx`

**Step 1: Add celebration state to TodayFocus**

Replace `src/components/TodayFocus/TodayFocus.tsx`:
```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { ActionItem } from '../ActionItem'

export interface FocusAction {
  id: string
  goalId: string
  title: string
  current: number
  target: number
}

interface TodayFocusProps {
  actions: FocusAction[]
  onActionComplete?: (actionId: string, goalId: string) => void
}

export function TodayFocus({ actions, onActionComplete }: TodayFocusProps) {
  const incompleteActions = actions.filter((a) => a.current < a.target)
  const count = incompleteActions.length
  const allComplete = actions.length > 0 && count === 0

  if (allComplete) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bg-surface rounded-card p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent-amber/20 flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-accent-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <p className="text-text-primary font-display font-semibold">
          You showed up today.
        </p>
        <p className="text-text-secondary text-sm mt-1">
          All actions complete
        </p>
      </motion.div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="bg-bg-surface rounded-card p-4 text-center">
        <p className="text-text-secondary">
          Nothing on deck today. Enjoy the space.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface rounded-card p-4">
      <h2 className="text-text-secondary text-sm font-medium mb-3">
        {count} action{count !== 1 ? 's' : ''} today
      </h2>
      <AnimatePresence mode="popLayout">
        {incompleteActions.slice(0, 5).map((action) => (
          <motion.div
            key={action.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ActionItem
              title={action.title}
              current={action.current}
              target={action.target}
              onComplete={() => onActionComplete?.(action.id, action.goalId)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {incompleteActions.length > 5 && (
        <p className="text-text-secondary text-sm mt-2">
          +{incompleteActions.length - 5} more
        </p>
      )}
    </div>
  )
}
```

**Step 2: Verify celebration state in Storybook and app**

Run Storybook and check AllComplete story, then complete all actions in dev app to see the "You showed up today" message.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add celebration state when all actions complete"
```

---

## Task 13: Final Cleanup

**Files:**
- Delete: Default Vite files we don't need
- Create: `src/views/Today/Today.stories.tsx`

**Step 1: Clean up unused files**

Run:
```bash
rm -f src/App.css public/vite.svg src/assets/react.svg
```

**Step 2: Create Today view story**

Create `src/views/Today/Today.stories.tsx`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Today } from './Today'

const meta: Meta<typeof Today> = {
  title: 'Views/Today',
  component: Today,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Today>

export const Default: Story = {}
```

**Step 3: Verify everything works**

Run:
```bash
npm run dev
npm run storybook
npm run build
```

All three should succeed.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: cleanup and add Today view story"
```

---

## Summary

After completing all tasks, you'll have:

- **Project foundation**: Vite + React + TypeScript + Tailwind + Storybook
- **Design tokens**: Colors, typography, shadows matching the design spec
- **Components** (all with Storybook stories):
  - Card - warm elevated container
  - ProgressRing - animated SVG with amber fill
  - WeekDots - 4-week trend indicator
  - ActionItem - tap-to-complete with pulse animation
  - GoalCard - composed goal display
  - TodayFocus - sticky section with focus actions
  - TopBar - minimal navigation
- **Today view**: Full composition with mock data, sticky focus section, scrollable goals
- **Interactions**: Completion animations, state sync between focus and cards, celebration state

**Next steps** (future plans):
1. Goals view with cycle context and milestones
2. Weekly review flow
3. Zustand state management
4. Supabase backend integration
