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
