import { useState } from 'react'
import { Dashboard } from './views/Dashboard'
import { Today } from './views/Today'
import { Settings } from './views/Settings'
import { BottomNav } from './components/BottomNav'
import type { NavTab } from './components/BottomNav'

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')

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
