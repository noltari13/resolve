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
  args: {
    milestone: {
      id: '1',
      goalId: 'goal-1',
      title: 'Register for local 5K',
      completed: false,
      completedAt: null,
    },
    onUpdateTitle: () => {},
    onToggleComplete: () => {},
    onDelete: () => {},
  },
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
