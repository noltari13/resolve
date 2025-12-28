import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressRing } from './ProgressRing'

const meta: Meta<typeof ProgressRing> = {
  title: 'Components/ProgressRing',
  component: ProgressRing,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ProgressRing>

export const Empty: Story = {
  args: {
    percentage: 0,
  },
}

export const Partial: Story = {
  args: {
    percentage: 45,
  },
}

export const MostlyComplete: Story = {
  args: {
    percentage: 78,
  },
}

export const Complete: Story = {
  args: {
    percentage: 100,
  },
}

export const WithLabel: Story = {
  args: {
    percentage: 73,
    size: 64,
    showLabel: true,
  },
}

export const Large: Story = {
  args: {
    percentage: 65,
    size: 80,
    strokeWidth: 6,
    showLabel: true,
  },
}
