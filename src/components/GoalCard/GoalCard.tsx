import { Card } from '../Card'
import { ProgressRing } from '../ProgressRing'
import { WeekDots } from '../WeekDots'
import { ActionItem } from '../ActionItem'
import type { Goal } from '../../types'

interface GoalCardProps {
  goal: Goal
  onActionComplete?: (actionId: string) => void
}

export function GoalCard({ goal, onActionComplete }: GoalCardProps) {
  return (
    <Card>
      {/* Header: Title + Ring */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg truncate">
            {goal.title}
          </h3>
          {goal.identityStatement && (
            <p className="text-text-secondary text-sm mt-0.5 truncate">
              "{goal.identityStatement}"
            </p>
          )}
          <div className="mt-2">
            <WeekDots weeks={goal.weekHistory} />
          </div>
        </div>
        <ProgressRing percentage={goal.percentage} size={48} />
      </div>

      {/* Divider */}
      <div className="border-t border-text-disabled/20 my-3" />

      {/* Actions */}
      <div className="space-y-1">
        {goal.actions.map((action) => (
          <ActionItem
            key={action.id}
            title={action.title}
            current={action.current}
            target={action.target}
            onComplete={() => onActionComplete?.(action.id)}
          />
        ))}
      </div>
    </Card>
  )
}
