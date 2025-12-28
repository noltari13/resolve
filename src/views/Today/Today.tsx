import { useState, useCallback } from 'react'
import { TodayFocus } from '../../components/TodayFocus'
import { GoalCard } from '../../components/GoalCard'
import type { Goal } from '../../types'
import { mockGoals, getFocusActions } from './mockData'

export function Today() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)

  const handleActionComplete = useCallback((actionId: string, goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal

        const updatedActions = goal.actions.map((action) => {
          if (action.id !== actionId) return action
          return { ...action, current: Math.min(action.current + 1, action.target) }
        })

        const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
        const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
        const percentage = Math.round((totalCurrent / totalTarget) * 100)

        return { ...goal, actions: updatedActions, percentage }
      })
    )
  }, [])

  const focusActions = getFocusActions(goals)

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
            />
          ))}
        </div>
      </div>
    </div>
  )
}
