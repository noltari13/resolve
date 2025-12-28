import type { Meta, StoryObj } from '@storybook/react-vite'
import { CycleSetup } from './CycleSetup'

const meta: Meta<typeof CycleSetup> = {
  title: 'Onboarding/CycleSetup',
  component: CycleSetup,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof CycleSetup>

export const Default: Story = {
  args: {
    onComplete: (cycle) => console.log('Cycle created:', cycle),
    onBack: () => console.log('Back clicked'),
  },
}
