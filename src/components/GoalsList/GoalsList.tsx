import type { Goal } from '../../types'

interface GoalsListProps {
  cycleName: string
  cycleInfo: string
  goals: Goal[]
  onEditGoal: (goal: Goal) => void
  onAddGoal: () => void
  onComplete: () => void
}

export function GoalsList({
  cycleName,
  cycleInfo,
  goals,
  onEditGoal,
  onAddGoal,
  onComplete,
}: GoalsListProps) {
  const canComplete = goals.length > 0

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="font-display font-bold text-2xl text-text-primary">
          Your Goals
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {cycleName} • {cycleInfo}
        </p>

        {/* Goals */}
        <div className="mt-6 space-y-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-bg-surface rounded-card p-4 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-accent-amber/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-accent-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary truncate">
                  {goal.title}
                </h3>
                {goal.identityStatement && (
                  <p className="text-text-secondary text-sm truncate">
                    "{goal.identityStatement}"
                  </p>
                )}
                <p className="text-text-disabled text-xs mt-1">
                  {goal.actions.length} weekly action{goal.actions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => onEditGoal(goal)}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
                aria-label={`Edit ${goal.title}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          ))}

          {/* Add Goal Button */}
          <button
            onClick={onAddGoal}
            className="w-full bg-bg-surface rounded-card p-4 text-text-secondary hover:text-text-primary hover:bg-bg-surface/80 transition-colors text-center"
          >
            + Add another goal
          </button>
        </div>

        {/* Advisory */}
        <p className="text-text-secondary text-sm mt-6 text-center">
          {goals.length === 0 && 'Add at least one goal to continue'}
          {goals.length >= 1 && goals.length <= 3 && `${goals.length} goal${goals.length !== 1 ? 's' : ''} set. Most people do best with 2-4 goals per cycle.`}
          {goals.length >= 4 && `${goals.length} goals set. Consider focusing on fewer for better results.`}
        </p>

        {/* Complete Button */}
        <button
          onClick={onComplete}
          disabled={!canComplete}
          className={`
            mt-6 w-full font-semibold py-3 px-6 rounded-lg transition-colors
            ${canComplete
              ? 'bg-accent-amber text-bg-base hover:bg-accent-amber/90'
              : 'bg-text-disabled/20 text-text-disabled cursor-not-allowed'
            }
          `}
        >
          Start Your Cycle
        </button>
      </div>
    </div>
  )
}
