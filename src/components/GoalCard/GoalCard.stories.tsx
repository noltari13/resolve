import type { Meta, StoryObj } from '@storybook/react-vite'
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
