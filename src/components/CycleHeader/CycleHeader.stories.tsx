import type { Meta, StoryObj } from '@storybook/react-vite'
import { CycleHeader } from './CycleHeader'

const meta: Meta<typeof CycleHeader> = {
  title: 'Components/CycleHeader',
  component: CycleHeader,
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
type Story = StoryObj<typeof CycleHeader>

export const EarlyInCycle: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'Q1 2025 Goals',
      startDate: '2025-01-06',
      endDate: '2025-03-30',
      durationWeeks: 12,
      currentWeek: 2,
      status: 'active',
    },
  },
}

export const MidCycle: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'Q1 2025 Goals',
      startDate: '2025-01-06',
      endDate: '2025-03-30',
      durationWeeks: 12,
      currentWeek: 6,
      status: 'active',
    },
  },
}

export const NearingEnd: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'Q1 2025 Goals',
      startDate: '2025-01-06',
      endDate: '2025-03-30',
      durationWeeks: 12,
      currentWeek: 11,
      status: 'active',
    },
  },
}

export const ShortCycle: Story = {
  args: {
    cycle: {
      id: 'c1',
      name: 'January Sprint',
      startDate: '2025-01-06',
      endDate: '2025-02-02',
      durationWeeks: 4,
      currentWeek: 2,
      status: 'active',
    },
  },
}
