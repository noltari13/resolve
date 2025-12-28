import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReviewPrompt } from './ReviewPrompt'

const meta: Meta<typeof ReviewPrompt> = {
  title: 'Components/ReviewPrompt',
  component: ReviewPrompt,
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
type Story = StoryObj<typeof ReviewPrompt>

export const Default: Story = {
  args: {
    weekNumber: 4,
    onReviewNow: () => console.log('Review now'),
    onLater: () => console.log('Later'),
  },
}

export const Urgent: Story = {
  args: {
    weekNumber: 4,
    onReviewNow: () => console.log('Review now'),
    onLater: () => console.log('Later'),
    isUrgent: true,
  },
}
