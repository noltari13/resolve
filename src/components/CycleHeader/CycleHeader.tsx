import type { Cycle } from '../../types'

interface CycleHeaderProps {
  cycle: Cycle
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

export function CycleHeader({ cycle }: CycleHeaderProps) {
  const progress = (cycle.currentWeek / cycle.durationWeeks) * 100
  const daysRemaining = getDaysRemaining(cycle.endDate)

  return (
    <div className="bg-bg-surface rounded-card p-4">
      {/* Cycle name */}
      <h1 className="font-display font-bold text-lg text-text-primary">
        {cycle.name}
      </h1>

      {/* Week and days remaining */}
      <p className="text-text-secondary text-sm mt-1">
        Week {cycle.currentWeek} of {cycle.durationWeeks} • {daysRemaining} days remaining
      </p>

      {/* Progress bar */}
      <div className="mt-4">
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Cycle progress: Week ${cycle.currentWeek} of ${cycle.durationWeeks}`}
          className="h-2 bg-bg-base rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-accent-amber rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Date range */}
      <div className="flex justify-between text-text-disabled text-xs mt-2">
        <span>{formatDate(cycle.startDate)}</span>
        <span>{formatDate(cycle.endDate)}</span>
      </div>
    </div>
  )
}
