import type { Meta, StoryObj } from '@storybook/react-vite'
import { WelcomeScreen } from './WelcomeScreen'

const meta: Meta<typeof WelcomeScreen> = {
  title: 'Onboarding/WelcomeScreen',
  component: WelcomeScreen,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof WelcomeScreen>

export const Default: Story = {
  args: {
    onGetStarted: () => console.log('Get started clicked'),
  },
}
