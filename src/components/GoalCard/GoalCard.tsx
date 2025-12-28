import { ProgressRing } from '../ProgressRing'
import { WeekDots } from '../WeekDots'
import { ActionItem } from '../ActionItem'
import type { Goal } from '../../types'

interface GoalCardProps {
  goal: Goal
  onActionComplete?: (actionId: string) => void
  onTap?: () => void
}

export function GoalCard({ goal, onActionComplete, onTap }: GoalCardProps) {
  return (
    <div className="bg-bg-surface rounded-card shadow-card overflow-hidden">
      {/* Header - tappable */}
      <div
        onClick={onTap}
        className={`p-4 transition-colors duration-150 ${
          onTap ? 'cursor-pointer hover:bg-bg-surface-hover' : ''
        }`}
      >
        {/* Title + Ring */}
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
      </div>

      {/* Actions - not tappable for navigation */}
      <div className="px-4 pb-4">
        {/* Divider */}
        <div className="border-t border-text-disabled/20 mb-3" />

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
      </div>
    </div>
  )
}
