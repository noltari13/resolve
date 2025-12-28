import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BottomNav } from './BottomNav'
import type { NavTab } from './BottomNav'

const meta: Meta<typeof BottomNav> = {
  title: 'Components/BottomNav',
  component: BottomNav,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-bg-base flex flex-col justify-end">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BottomNav>

export const Dashboard: Story = {
  args: {
    activeTab: 'dashboard',
    onTabChange: () => {},
  },
}

export const Today: Story = {
  args: {
    activeTab: 'today',
    onTabChange: () => {},
  },
}

export const Interactive: Story = {
  render: function InteractiveBottomNav() {
    const [activeTab, setActiveTab] = useState<NavTab>('dashboard')
    return <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
  },
}
