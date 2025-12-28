import type { Meta, StoryObj } from '@storybook/react-vite'
import { AddActionInline } from './AddActionInline'

const meta: Meta<typeof AddActionInline> = {
  title: 'Components/AddActionInline',
  component: AddActionInline,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-96 bg-bg-surface p-4 rounded-card">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AddActionInline>

export const Default: Story = {
  args: {
    onAdd: (title, target) => console.log('Added:', title, target),
  },
}
