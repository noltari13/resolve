import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScoreDisplay } from './ScoreDisplay'

const meta: Meta<typeof ScoreDisplay> = {
  title: 'Components/ScoreDisplay',
  component: ScoreDisplay,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ScoreDisplay>

export const Exceptional: Story = {
  args: {
    score: 95,
    completed: 10,
    total: 11,
  },
}

export const Strong: Story = {
  args: {
    score: 82,
    completed: 9,
    total: 11,
  },
}

export const Solid: Story = {
  args: {
    score: 64,
    completed: 7,
    total: 11,
  },
}

export const Tough: Story = {
  args: {
    score: 36,
    completed: 4,
    total: 11,
  },
}

export const Low: Story = {
  args: {
    score: 18,
    completed: 2,
    total: 11,
  },
}

export const Zero: Story = {
  args: {
    score: 0,
    completed: 0,
    total: 11,
  },
}
