import type { Meta, StoryObj } from '@storybook/react-vite'
import { EditableText } from './EditableText'
import { useState } from 'react'

const meta = {
  title: 'Components/EditableText',
  component: EditableText,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EditableText>

export default meta
type Story = StoryObj<typeof meta>

function EditableTextDemo() {
  const [value, setValue] = useState('Click me to edit')
  return (
    <div className="p-8 bg-bg-base">
      <EditableText
        value={value}
        onSave={setValue}
        className="text-xl text-text-primary"
      />
    </div>
  )
}

export const Default: Story = {
  args: {
    value: 'Click me to edit',
    onSave: () => {},
  },
  render: () => <EditableTextDemo />,
}

export const WithPlaceholder: Story = {
  args: {
    value: '',
    onSave: () => {},
    placeholder: 'Add identity statement...',
    className: 'text-text-secondary italic',
  },
}
