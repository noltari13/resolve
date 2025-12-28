import type { Meta, StoryObj } from '@storybook/react'
import { ActionRow } from './ActionRow'
import { useState } from 'react'
import type { Action } from '../../types'

const meta = {
  title: 'Components/ActionRow',
  component: ActionRow,
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
} satisfies Meta<typeof ActionRow>

export default meta
type Story = StoryObj<typeof meta>

function ActionRowDemo() {
  const [action, setAction] = useState<Action>({
    id: '1',
    title: 'Run 3 times',
    target: 3,
    current: 2,
  })

  return (
    <ActionRow
      action={action}
      onUpdateTitle={(title) => setAction({ ...action, title })}
      onIncrement={() => setAction({ ...action, current: Math.min(action.current + 1, action.target) })}
      onDelete={() => alert('Deleted!')}
    />
  )
}

export const InProgress: Story = {
  args: {
    action: {
      id: '1',
      title: 'Run 3 times',
      target: 3,
      current: 2,
    },
    onUpdateTitle: () => {},
    onIncrement: () => {},
    onDelete: () => {},
  },
  render: () => <ActionRowDemo />,
}

export const Complete: Story = {
  args: {
    action: {
      id: '2',
      title: 'Do interval training',
      target: 1,
      current: 1,
    },
    onUpdateTitle: () => {},
    onIncrement: () => {},
    onDelete: () => {},
  },
}
