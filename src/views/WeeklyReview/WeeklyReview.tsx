import { useState, useCallback } from 'react'
import { StepIndicator } from '../../components/StepIndicator'
import { ReviewStep } from './steps/ReviewStep'
import { mockReviewActions } from './mockData'
import type { ReviewAction } from '../../types'

type ReviewStepType = 'review' | 'score' | 'plan' | 'done'

export function WeeklyReview() {
  const [step, setStep] = useState<ReviewStepType>('review')
  const [actions, setActions] = useState<ReviewAction[]>(mockReviewActions)

  const stepNumber = { review: 1, score: 2, plan: 3, done: 4 }[step]

  const handleActionChange = useCallback((actionId: string, newCurrent: number) => {
    setActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, current: newCurrent } : a))
    )
  }, [])

  const handleNext = () => {
    if (step === 'review') setStep('score')
    else if (step === 'score') setStep('plan')
    else if (step === 'plan') setStep('done')
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col min-h-screen">
        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator currentStep={stepNumber} totalSteps={4} />
        </div>

        {/* Current step */}
        <div className="flex-1">
          {step === 'review' && (
            <ReviewStep
              weekNumber={4}
              weekDateRange="Dec 22 – Dec 28"
              actions={actions}
              onActionChange={handleActionChange}
              onNext={handleNext}
            />
          )}
          {step === 'score' && (
            <div className="text-text-primary text-center">Score step placeholder</div>
          )}
          {step === 'plan' && (
            <div className="text-text-primary text-center">Plan step placeholder</div>
          )}
          {step === 'done' && (
            <div className="text-text-primary text-center">Done step placeholder</div>
          )}
        </div>
      </div>
    </div>
  )
}
