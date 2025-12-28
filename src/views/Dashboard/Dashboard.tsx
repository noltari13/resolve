import { useState } from 'react'
import { CycleHeader } from '../../components/CycleHeader'
import { DashboardGoalCard } from '../../components/DashboardGoalCard'
import { ReviewPrompt } from '../../components/ReviewPrompt'
import { WeeklyReview } from '../WeeklyReview'
import { useAppStore } from '../../store/useAppStore'
import type { DashboardGoal } from '../../types'

export function Dashboard() {
  const { cycle, goals } = useAppStore()
  const [showReviewPrompt, setShowReviewPrompt] = useState(true)
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)

  if (showWeeklyReview) {
    return <WeeklyReview />
  }

  // Convert goals to DashboardGoals (add empty milestones for now)
  const dashboardGoals: DashboardGoal[] = goals.map((goal) => ({
    ...goal,
    milestones: [],
  }))

  if (!cycle) {
    return (
      <div className="min-h-screen bg-bg-base pb-20 flex items-center justify-center">
        <p className="text-text-secondary">No active cycle</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Review Prompt */}
        {showReviewPrompt && (
          <div className="mb-4">
            <ReviewPrompt
              weekNumber={cycle.currentWeek}
              onReviewNow={() => setShowWeeklyReview(true)}
              onLater={() => setShowReviewPrompt(false)}
            />
          </div>
        )}

        {/* Cycle Header */}
        <CycleHeader cycle={cycle} />

        {/* Goals */}
        <div className="mt-6 space-y-4">
          {dashboardGoals.length === 0 ? (
            <div className="bg-bg-surface rounded-card p-6 text-center">
              <p className="text-text-secondary">No goals yet</p>
            </div>
          ) : (
            dashboardGoals.map((goal) => (
              <DashboardGoalCard key={goal.id} goal={goal} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
