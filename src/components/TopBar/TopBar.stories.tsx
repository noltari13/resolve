import type { Meta, StoryObj } from '@storybook/react-vite'
import { TopBar } from './TopBar'

const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-bg-base">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TopBar>

export const Default: Story = {
  args: {},
}

export const GoalsView: Story = {
  args: {
    title: 'Goals',
  },
}
