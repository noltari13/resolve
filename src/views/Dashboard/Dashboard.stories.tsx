import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dashboard } from './Dashboard'

const meta: Meta<typeof Dashboard> = {
  title: 'Views/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Dashboard>

export const Default: Story = {}
