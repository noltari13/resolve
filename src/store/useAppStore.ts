import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cycle, Goal } from '../types'

interface AppState {
  // Onboarding
  hasCompletedOnboarding: boolean

  // Data
  cycle: Cycle | null
  goals: Goal[]

  // Actions
  setCycle: (cycle: Cycle) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  updateAction: (goalId: string, actionId: string, current: number) => void
  completeOnboarding: () => void
  resetStore: () => void
}

const initialState = {
  hasCompletedOnboarding: false,
  cycle: null,
  goals: [],
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setCycle: (cycle) => set({ cycle }),

      addGoal: (goal) =>
        set((state) => ({ goals: [...state.goals, goal] })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      updateAction: (goalId, actionId, current) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal
            const updatedActions = goal.actions.map((action) =>
              action.id === actionId ? { ...action, current } : action
            )
            const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
            const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
            const percentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
            return { ...goal, actions: updatedActions, percentage }
          }),
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      resetStore: () => set(initialState),
    }),
    { name: 'resolve-storage' }
  )
)
