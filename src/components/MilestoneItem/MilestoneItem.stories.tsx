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
