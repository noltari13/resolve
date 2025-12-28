import { useState } from 'react'
import { Onboarding } from './views/Onboarding'
import { Dashboard } from './views/Dashboard'
import { Today } from './views/Today'
import { Settings } from './views/Settings'
import { GoalDetail } from './views/GoalDetail'
import { BottomNav } from './components/BottomNav'
import { useAppStore } from './store/useAppStore'
import type { NavTab } from './components/BottomNav'

function App() {
  const { hasCompletedOnboarding } = useAppStore()
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [returnTo, setReturnTo] = useState<NavTab>('dashboard')

  const handleSelectGoal = (goalId: string, from: NavTab) => {
    setSelectedGoalId(goalId)
    setReturnTo(from)
  }

  const handleBack = () => {
    setActiveTab(returnTo)
    setSelectedGoalId(null)
  }

  if (!hasCompletedOnboarding) {
    return <Onboarding />
  }

  if (selectedGoalId) {
    return <GoalDetail goalId={selectedGoalId} onBack={handleBack} />
  }

  return (
    <>
      {activeTab === 'dashboard' && (
        <Dashboard onSelectGoal={(id) => handleSelectGoal(id, 'dashboard')} />
      )}
      {activeTab === 'today' && (
        <Today onSelectGoal={(id) => handleSelectGoal(id, 'today')} />
      )}
      {activeTab === 'settings' && <Settings />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

export default App
