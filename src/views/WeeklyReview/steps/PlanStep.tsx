import { Card } from '../../../components/Card'
import { PlanActionItem } from '../../../components/PlanActionItem'
import { AddActionInline } from '../../../components/AddActionInline'
import type { PlanAction } from '../../../types'
import { groupByGoal } from '../mockData'

interface PlanStepProps {
  weekDateRange: string
  actions: PlanAction[]
  onToggleAction: (actionId: string) => void
  onAddAction: (goalId: string, title: string, target: number) => void
  onComplete: () => void
}

export function PlanStep({
  weekDateRange,
  actions,
  onToggleAction,
  onAddAction,
  onComplete,
}: PlanStepProps) {
  const groupedActions = groupByGoal(actions)
  const allSkipped = actions.every((a) => !a.enabled)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-display font-bold text-text-primary">Next Week</h1>
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
                <PlanActionItem
                  key={action.id}
                  title={action.title}
                  target={action.target}
                  enabled={action.enabled}
                  onToggle={() => onToggleAction(action.id)}
                />
              ))}
            </div>
            <div className="mt-2">
              <AddActionInline
                onAdd={(title, target) => onAddAction(goalId, title, target)}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Warning if all skipped */}
      {allSkipped && (
        <p className="text-accent-coral text-sm text-center mt-4">
          You've skipped all actions for next week.
        </p>
      )}

      {/* Complete button */}
      <div className="pt-4">
        <button
          onClick={onComplete}
          className="w-full py-3 bg-accent-amber text-bg-base rounded-lg font-medium"
        >
          Looks Good
        </button>
      </div>
    </div>
  )
}
