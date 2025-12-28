import { useCallback } from 'react'
import { TodayFocus } from '../../components/TodayFocus'
import { GoalCard } from '../../components/GoalCard'
import { useAppStore } from '../../store/useAppStore'

interface TodayProps {
  onSelectGoal?: (goalId: string) => void
}

export function Today({ onSelectGoal }: TodayProps) {
  const { goals, updateAction } = useAppStore()

  const handleActionComplete = useCallback((actionId: string, goalId: string) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return
    const action = goal.actions.find((a) => a.id === actionId)
    if (!action) return
    const newCurrent = Math.min(action.current + 1, action.target)
    updateAction(goalId, actionId, newCurrent)
  }, [goals, updateAction])

  // Get focus actions for TodayFocus
  const focusActions = goals.flatMap((goal) =>
    goal.actions
      .filter((action) => action.current < action.target)
      .slice(0, 2)
      .map((action) => ({
        ...action,
        goalId: goal.id,
        goalTitle: goal.title,
      }))
  ).slice(0, 3)

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-bg-base pb-20 flex items-center justify-center">
        <p className="text-text-secondary">No goals yet. Set up your cycle first!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto">
        {/* Sticky Focus Section */}
        <div className="sticky top-0 z-10 bg-bg-base px-4 pb-4">
          <TodayFocus
            actions={focusActions}
            onActionComplete={handleActionComplete}
          />
        </div>

        {/* Goals List */}
        <div className="px-4 pb-8 space-y-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onActionComplete={(actionId) => handleActionComplete(actionId, goal.id)}
              onTap={() => onSelectGoal?.(goal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
