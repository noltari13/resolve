import type { Meta, StoryObj } from '@storybook/react-vite'
import { WeeklyReview } from './WeeklyReview'

const meta: Meta<typeof WeeklyReview> = {
  title: 'Views/WeeklyReview',
  component: WeeklyReview,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof WeeklyReview>

export const Default: Story = {}
