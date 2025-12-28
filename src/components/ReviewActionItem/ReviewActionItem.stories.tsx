import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ReviewActionItem } from './ReviewActionItem'

const meta: Meta<typeof ReviewActionItem> = {
  title: 'Components/ReviewActionItem',
  component: ReviewActionItem,
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
type Story = StoryObj<typeof ReviewActionItem>

export const NotStarted: Story = {
  args: {
    title: 'Run 3x this week',
    current: 0,
    target: 3,
  },
}

export const Partial: Story = {
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

export const Interactive: Story = {
  render: function InteractiveReviewActionItem() {
    const [current, setCurrent] = useState(1)
    const target = 3

    return (
      <ReviewActionItem
        title="Run 3x this week"
        current={current}
        target={target}
        onIncrement={() => setCurrent((c) => Math.min(c + 1, target))}
        onDecrement={() => setCurrent((c) => Math.max(c - 1, 0))}
      />
    )
  },
}
