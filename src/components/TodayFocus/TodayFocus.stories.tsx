import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { TodayFocus } from './TodayFocus'
import type { FocusAction } from './TodayFocus'

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
