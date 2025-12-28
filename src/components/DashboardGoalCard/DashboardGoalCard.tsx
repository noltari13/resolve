import { Card } from '../Card'
import { ProgressRing } from '../ProgressRing'
import { WeekDots } from '../WeekDots'
import { MilestoneItem } from '../MilestoneItem'
import type { DashboardGoal } from '../../types'

interface DashboardGoalCardProps {
  goal: DashboardGoal
  onTap?: () => void
}

export function DashboardGoalCard({ goal, onTap }: DashboardGoalCardProps) {
  const completedMilestones = goal.milestones.filter((m) => m.completed)
  const upcomingMilestones = goal.milestones.filter((m) => !m.completed)

  const lastCompleted = completedMilestones[completedMilestones.length - 1]
  const nextUpcoming = upcomingMilestones[0]

  const content = (
    <>
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
        <ProgressRing percentage={goal.percentage} size={56} />
      </div>

      {/* Milestones */}
      {(lastCompleted || nextUpcoming) && (
        <>
          <div className="border-t border-text-disabled/20 my-3" />
          <div className="space-y-2">
            {lastCompleted && (
              <MilestoneItem milestone={lastCompleted} variant="completed" />
            )}
            {nextUpcoming && (
              <MilestoneItem milestone={nextUpcoming} variant="upcoming" />
            )}
          </div>
        </>
      )}
    </>
  )

  return (
    <Card>
      {onTap ? (
        <button
          onClick={onTap}
          aria-label={`View details for ${goal.title}`}
          className="w-full text-left cursor-pointer"
        >
          {content}
        </button>
      ) : (
        <div>{content}</div>
      )}
    </Card>
  )
}
