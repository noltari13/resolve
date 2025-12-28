import type { Meta, StoryObj } from '@storybook/react-vite'
import { Today } from './Today'

const meta: Meta<typeof Today> = {
  title: 'Views/Today',
  component: Today,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Today>

export const Default: Story = {}
