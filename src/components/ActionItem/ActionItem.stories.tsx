import type { Meta, StoryObj } from '@storybook/react-vite'
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
