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
