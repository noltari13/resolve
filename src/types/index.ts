export type WeekStatus = 'complete' | 'partial' | 'missed'

export interface Action {
  id: string
  title: string
  current: number
  target: number
}

export interface Goal {
  id: string
  title: string
  identityStatement?: string
  percentage: number
  weekHistory: WeekStatus[]
  actions: Action[]
  milestones?: Milestone[]
}

export interface ReviewAction extends Action {
  goalId: string
  goalTitle: string
}

export interface WeekReview {
  weekNumber: number
  weekStart: string
  score: number
  completedAt: string | null
}

export interface PlanAction {
  id: string
  goalId: string
  goalTitle: string
  title: string
  target: number
  enabled: boolean
}

export interface Cycle {
  id: string
  name: string
  startDate: string
  endDate: string
  durationWeeks: number
  currentWeek: number
  status: 'active' | 'completed' | 'abandoned'
}

export interface Milestone {
  id: string
  goalId: string
  title: string
  completed: boolean
  completedAt: string | null
}

export interface DashboardGoal extends Goal {
  milestones: Milestone[]
}
