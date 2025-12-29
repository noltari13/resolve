import { useState, useCallback } from 'react'
import { StepIndicator } from '../../components/StepIndicator'
import { ReviewStep } from './steps/ReviewStep'
import { ScoreStep } from './steps/ScoreStep'
import { PlanStep } from './steps/PlanStep'
import { DoneStep } from './steps/DoneStep'
import { useAppStore } from '../../store/useAppStore'
import type { ReviewAction, PlanAction } from '../../types'

type ReviewStepType = 'review' | 'score' | 'plan' | 'done'

interface WeeklyReviewProps {
  onComplete: () => void
}

export function WeeklyReview({ onComplete }: WeeklyReviewProps) {
  const goals = useAppStore((state) => state.goals)
  const cycle = useAppStore((state) => state.cycle)
  const currentWeek = useAppStore((state) => state.currentWeek)
  const completeWeeklyReview = useAppStore((state) => state.completeWeeklyReview)
  const resetActionsForNewWeek = useAppStore((state) => state.resetActionsForNewWeek)
  const updateAction = useAppStore((state) => state.updateAction)

  const [step, setStep] = useState<ReviewStepType>('review')

  const reviewActions: ReviewAction[] = goals.flatMap((goal) =>
    goal.actions.map((action) => ({
      ...action,
      goalId: goal.id,
      goalTitle: goal.title,
    }))
  )

  const [planActions, setPlanActions] = useState<PlanAction[]>(() =>
    goals.flatMap((goal) =>
      goal.actions.map((action) => ({
        id: action.id,
        goalId: goal.id,
        goalTitle: goal.title,
        title: action.title,
        target: action.target,
        enabled: true,
      }))
    )
  )

  const stepNumber = { review: 1, score: 2, plan: 3, done: 4 }[step]

  const handleActionChange = useCallback((actionId: string, newCurrent: number) => {
    const action = reviewActions.find((a) => a.id === actionId)
    if (action) {
      updateAction(action.goalId, actionId, newCurrent)
    }
  }, [reviewActions, updateAction])

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

  const handleBackToToday = () => {
    completeWeeklyReview(currentWeek)
    resetActionsForNewWeek()
    onComplete()
  }

  const weekDateRange = cycle ? `Week ${currentWeek}` : 'This Week'

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
              weekNumber={currentWeek}
              weekDateRange={weekDateRange}
              actions={reviewActions}
              onActionChange={handleActionChange}
              onNext={handleNext}
            />
          )}
          {step === 'score' && (
            <ScoreStep weekNumber={currentWeek} actions={reviewActions} onContinue={handleNext} />
          )}
          {step === 'plan' && (
            <PlanStep
              weekDateRange={`Week ${currentWeek + 1}`}
              actions={planActions}
              onToggleAction={handleTogglePlanAction}
              onAddAction={handleAddPlanAction}
              onComplete={handleNext}
            />
          )}
          {step === 'done' && (
            <DoneStep nextWeekNumber={currentWeek + 1} onBackToToday={handleBackToToday} />
          )}
        </div>
      </div>
    </div>
  )
}
