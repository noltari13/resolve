import { useState } from 'react'
import { Onboarding } from './views/Onboarding'
import { Dashboard } from './views/Dashboard'
import { Today } from './views/Today'
import { Settings } from './views/Settings'
import { BottomNav } from './components/BottomNav'
import { useAppStore } from './store/useAppStore'
import type { NavTab } from './components/BottomNav'

function App() {
  const { hasCompletedOnboarding } = useAppStore()
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')

  if (!hasCompletedOnboarding) {
    return <Onboarding />
  }

  return (
    <>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'today' && <Today />}
      {activeTab === 'settings' && <Settings />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  )
}

export default App
