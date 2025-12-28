import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepIndicator } from './StepIndicator'

const meta: Meta<typeof StepIndicator> = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof StepIndicator>

export const Step1of4: Story = {
  args: {
    currentStep: 1,
    totalSteps: 4,
  },
}

export const Step2of4: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
}

export const Step3of4: Story = {
  args: {
    currentStep: 3,
    totalSteps: 4,
  },
}

export const AllComplete: Story = {
  args: {
    currentStep: 4,
    totalSteps: 4,
  },
}
