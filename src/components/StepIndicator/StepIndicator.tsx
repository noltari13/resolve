interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`
            w-2 h-2 rounded-full transition-colors duration-200
            ${i < currentStep ? 'bg-accent-amber' : 'bg-text-disabled'}
          `}
        />
      ))}
    </div>
  )
}
