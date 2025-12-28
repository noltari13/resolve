import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Action, Cycle, Goal, Milestone } from '../types'

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
  addAction: (goalId: string, action: Action) => void
  deleteAction: (goalId: string, actionId: string) => void
  addMilestone: (goalId: string, milestone: Milestone) => void
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void
  deleteMilestone: (goalId: string, milestoneId: string) => void
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

      addAction: (goalId, action) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal
            const updatedActions = [...goal.actions, action]
            const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
            const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
            const percentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
            return { ...goal, actions: updatedActions, percentage }
          }),
        })),

      deleteAction: (goalId, actionId) =>
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal
            const updatedActions = goal.actions.filter((a) => a.id !== actionId)
            const totalTarget = updatedActions.reduce((sum, a) => sum + a.target, 0)
            const totalCurrent = updatedActions.reduce((sum, a) => sum + a.current, 0)
            const percentage = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0
            return { ...goal, actions: updatedActions, percentage }
          }),
        })),

      addMilestone: (goalId, milestone) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? { ...goal, milestones: [...(goal.milestones || []), milestone] }
              : goal
          ),
        })),

      updateMilestone: (goalId, milestoneId, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: (goal.milestones || []).map((m) =>
                    m.id === milestoneId ? { ...m, ...updates } : m
                  ),
                }
              : goal
          ),
        })),

      deleteMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? { ...goal, milestones: (goal.milestones || []).filter((m) => m.id !== milestoneId) }
              : goal
          ),
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      resetStore: () => set(initialState),
    }),
    { name: 'resolve-storage' }
  )
)
