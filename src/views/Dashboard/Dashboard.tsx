import { useState } from 'react'
import { CycleHeader } from '../../components/CycleHeader'
import { DashboardGoalCard } from '../../components/DashboardGoalCard'
import { ReviewPrompt } from '../../components/ReviewPrompt'
import { WeeklyReview } from '../WeeklyReview'
import { mockCycle, mockDashboardGoals } from './mockData'

export function Dashboard() {
  const [showReviewPrompt, setShowReviewPrompt] = useState(true)
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)

  if (showWeeklyReview) {
    return <WeeklyReview />
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Review Prompt */}
        {showReviewPrompt && (
          <div className="mb-4">
            <ReviewPrompt
              weekNumber={mockCycle.currentWeek}
              onReviewNow={() => setShowWeeklyReview(true)}
              onLater={() => setShowReviewPrompt(false)}
            />
          </div>
        )}

        {/* Cycle Header */}
        <CycleHeader cycle={mockCycle} />

        {/* Goals */}
        <div className="mt-6 space-y-4">
          {mockDashboardGoals.map((goal) => (
            <DashboardGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  )
}
