import type { Meta, StoryObj } from '@storybook/react-vite'
import { WeekDots } from './WeekDots'

const meta: Meta<typeof WeekDots> = {
  title: 'Components/WeekDots',
  component: WeekDots,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof WeekDots>

export const AllComplete: Story = {
  args: {
    weeks: ['complete', 'complete', 'complete', 'complete'],
  },
}

export const Mixed: Story = {
  args: {
    weeks: ['complete', 'complete', 'partial', 'missed'],
  },
}

export const Struggling: Story = {
  args: {
    weeks: ['missed', 'partial', 'missed', 'partial'],
  },
}

export const JustStarted: Story = {
  args: {
    weeks: ['partial'],
  },
}
