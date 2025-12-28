import { Card } from '../../../components/Card'
import { ReviewActionItem } from '../../../components/ReviewActionItem'
import type { ReviewAction } from '../../../types'
import { groupByGoal } from '../mockData'

interface ReviewStepProps {
  weekNumber: number
  weekDateRange: string
  actions: ReviewAction[]
  onActionChange: (actionId: string, newCurrent: number) => void
  onNext: () => void
}

export function ReviewStep({
  weekNumber,
  weekDateRange,
  actions,
  onActionChange,
  onNext,
}: ReviewStepProps) {
  const groupedActions = groupByGoal(actions)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-display font-bold text-text-primary">
          Week {weekNumber} Review
        </h1>
        <p className="text-text-secondary text-sm">{weekDateRange}</p>
      </div>

      {/* Actions by goal */}
      <div className="flex-1 overflow-auto space-y-4">
        {Array.from(groupedActions.entries()).map(([goalId, { goalTitle, actions: goalActions }]) => (
          <Card key={goalId}>
            <h2 className="font-display font-semibold text-text-primary mb-3">
              {goalTitle}
            </h2>
            <div className="space-y-1">
              {goalActions.map((action) => (
                <ReviewActionItem
                  key={action.id}
                  title={action.title}
                  current={action.current}
                  target={action.target}
                  onIncrement={() =>
                    onActionChange(action.id, Math.min(action.current + 1, action.target))
                  }
                  onDecrement={() =>
                    onActionChange(action.id, Math.max(action.current - 1, 0))
                  }
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Next button */}
      <div className="pt-4">
        <button
          onClick={onNext}
          className="w-full py-3 bg-accent-coral text-bg-base rounded-lg font-medium"
        >
          Next
        </button>
      </div>
    </div>
  )
}
