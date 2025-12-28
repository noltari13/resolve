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
