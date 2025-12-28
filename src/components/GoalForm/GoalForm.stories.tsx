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
