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
