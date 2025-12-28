import type { Meta, StoryObj } from '@storybook/react'
import { AddItemInput } from './AddItemInput'

const meta = {
  title: 'Components/AddItemInput',
  component: AddItemInput,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4 bg-bg-base">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddItemInput>

export default meta
type Story = StoryObj<typeof meta>

export const AddAction: Story = {
  args: {
    placeholder: '+ Add action',
    onAdd: (value) => alert(`Added: ${value}`),
  },
}

export const AddMilestone: Story = {
  args: {
    placeholder: '+ Add milestone',
    onAdd: (value) => alert(`Added: ${value}`),
  },
}
