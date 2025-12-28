import { useState } from 'react'
import { WelcomeScreen } from '../../components/WelcomeScreen'
import { CycleSetup } from '../../components/CycleSetup'
import { GoalForm } from '../../components/GoalForm'
import { GoalsList } from '../../components/GoalsList'
import { useAppStore } from '../../store/useAppStore'
import type { Cycle, Goal } from '../../types'

type OnboardingStep = 'welcome' | 'cycle' | 'goal-form' | 'goals-list'

export function Onboarding() {
  const { setCycle, addGoal, updateGoal, completeOnboarding, cycle, goals } = useAppStore()

  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const handleCycleComplete = (newCycle: Cycle) => {
    setCycle(newCycle)
    setStep('goal-form')
  }

  const handleGoalSave = (goal: Goal) => {
    if (editingGoal) {
      updateGoal(goal.id, goal)
    } else {
      addGoal(goal)
    }
    setEditingGoal(null)
    setStep('goals-list')
  }

  const handleGoalCancel = () => {
    setEditingGoal(null)
    if (goals.length > 0) {
      setStep('goals-list')
    } else {
      setStep('cycle')
    }
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setStep('goal-form')
  }

  const handleAddGoal = () => {
    setEditingGoal(null)
    setStep('goal-form')
  }

  const handleComplete = () => {
    completeOnboarding()
  }

  const formatCycleInfo = () => {
    if (!cycle) return ''
    const start = new Date(cycle.startDate + 'T00:00:00')
    return `${cycle.durationWeeks} weeks starting ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  switch (step) {
    case 'welcome':
      return <WelcomeScreen onGetStarted={() => setStep('cycle')} />

    case 'cycle':
      return (
        <CycleSetup
          onComplete={handleCycleComplete}
          onBack={() => setStep('welcome')}
        />
      )

    case 'goal-form':
      return (
        <div className="min-h-screen bg-bg-base">
          <div className="max-w-lg mx-auto px-4 py-6">
            <button
              onClick={handleGoalCancel}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back
            </button>
            <h1 className="font-display font-bold text-2xl text-text-primary mt-6 mb-6">
              {editingGoal ? 'Edit Goal' : goals.length === 0 ? 'Add Your First Goal' : 'Add Another Goal'}
            </h1>
            <GoalForm
              goalNumber={editingGoal ? goals.findIndex(g => g.id === editingGoal.id) + 1 : goals.length + 1}
              initialGoal={editingGoal ?? undefined}
              onSave={handleGoalSave}
              onCancel={handleGoalCancel}
            />
          </div>
        </div>
      )

    case 'goals-list':
      return (
        <GoalsList
          cycleName={cycle?.name ?? ''}
          cycleInfo={formatCycleInfo()}
          goals={goals}
          onEditGoal={handleEditGoal}
          onAddGoal={handleAddGoal}
          onComplete={handleComplete}
        />
      )
  }
}
