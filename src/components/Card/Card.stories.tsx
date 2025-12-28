import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: (
      <div className="w-80">
        <h3 className="font-display font-semibold text-lg">Goal Title</h3>
        <p className="text-text-secondary text-sm mt-1">
          Supporting text goes here
        </p>
      </div>
    ),
  },
}

export const WithContent: Story = {
  args: {
    children: (
      <div className="w-80">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-semibold text-lg">Run a 5K</h3>
            <p className="text-text-secondary text-sm mt-1">
              "I am becoming a runner"
            </p>
          </div>
          <span className="text-accent-amber font-display font-bold">78%</span>
        </div>
      </div>
    ),
  },
}
