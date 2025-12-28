import { useState, useCallback } from 'react'
import { StepIndicator } from '../../components/StepIndicator'
import { ReviewStep } from './steps/ReviewStep'
import { ScoreStep } from './steps/ScoreStep'
import { PlanStep } from './steps/PlanStep'
import { mockReviewActions, mockPlanActions } from './mockData'
import type { ReviewAction, PlanAction } from '../../types'

type ReviewStepType = 'review' | 'score' | 'plan' | 'done'

export function WeeklyReview() {
  const [step, setStep] = useState<ReviewStepType>('review')
  const [reviewActions, setReviewActions] = useState<ReviewAction[]>(mockReviewActions)
  const [planActions, setPlanActions] = useState<PlanAction[]>(mockPlanActions)

  const stepNumber = { review: 1, score: 2, plan: 3, done: 4 }[step]

  const handleActionChange = useCallback((actionId: string, newCurrent: number) => {
    setReviewActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, current: newCurrent } : a))
    )
  }, [])

  const handleTogglePlanAction = useCallback((actionId: string) => {
    setPlanActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, enabled: !a.enabled } : a))
    )
  }, [])

  const handleAddPlanAction = useCallback(
    (goalId: string, title: string, target: number) => {
      const goalTitle = planActions.find((a) => a.goalId === goalId)?.goalTitle ?? 'Goal'
      const newAction: PlanAction = {
        id: `new-${Date.now()}`,
        goalId,
        goalTitle,
        title,
        target,
        enabled: true,
      }
      setPlanActions((prev) => [...prev, newAction])
    },
    [planActions]
  )

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
              actions={reviewActions}
              onActionChange={handleActionChange}
              onNext={handleNext}
            />
          )}
          {step === 'score' && (
            <ScoreStep weekNumber={4} actions={reviewActions} onContinue={handleNext} />
          )}
          {step === 'plan' && (
            <PlanStep
              weekDateRange="Dec 29 – Jan 4"
              actions={planActions}
              onToggleAction={handleTogglePlanAction}
              onAddAction={handleAddPlanAction}
              onComplete={handleNext}
            />
          )}
          {step === 'done' && (
            <div className="text-text-primary text-center">Done step placeholder</div>
          )}
        </div>
      </div>
    </div>
  )
}
