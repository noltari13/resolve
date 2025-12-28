import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PlanActionItem } from './PlanActionItem'

const meta: Meta<typeof PlanActionItem> = {
  title: 'Components/PlanActionItem',
  component: PlanActionItem,
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
type Story = StoryObj<typeof PlanActionItem>

export const Enabled: Story = {
  args: {
    title: 'Run 3x this week',
    target: 3,
    enabled: true,
  },
}

export const Disabled: Story = {
  args: {
    title: 'Run 3x this week',
    target: 3,
    enabled: false,
  },
}

export const Interactive: Story = {
  render: function InteractivePlanActionItem() {
    const [enabled, setEnabled] = useState(true)

    return (
      <PlanActionItem
        title="Run 3x this week"
        target={3}
        enabled={enabled}
        onToggle={() => setEnabled((e) => !e)}
      />
    )
  },
}
