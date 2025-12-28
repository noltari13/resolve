import { CycleHeader } from '../../components/CycleHeader'
import { DashboardGoalCard } from '../../components/DashboardGoalCard'
import { mockCycle, mockDashboardGoals } from './mockData'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
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
