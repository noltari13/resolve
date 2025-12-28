import type { Goal } from '../../types'
import type { FocusAction } from '../../components/TodayFocus'

export const mockGoals: Goal[] = [
  {
    id: 'g1',
    title: 'Run a 5K',
    identityStatement: 'I am becoming a runner',
    percentage: 78,
    weekHistory: ['complete', 'complete', 'partial', 'missed'],
    actions: [
      { id: 'a1', title: 'Run 3x this week', current: 2, target: 3 },
      { id: 'a2', title: 'Interval session', current: 0, target: 1 },
    ],
  },
  {
    id: 'g2',
    title: 'Financial clarity',
    identityStatement: 'I am becoming financially literate',
    percentage: 45,
    weekHistory: ['partial', 'complete', 'missed', 'partial'],
    actions: [
      { id: 'a3', title: 'Review budget', current: 0, target: 1 },
      { id: 'a4', title: 'Track expenses', current: 3, target: 7 },
    ],
  },
  {
    id: 'g3',
    title: 'Learn Spanish',
    percentage: 25,
    weekHistory: ['missed', 'partial', 'missed', 'missed'],
    actions: [
      { id: 'a5', title: 'Duolingo session', current: 1, target: 5 },
      { id: 'a6', title: 'Watch Spanish show', current: 0, target: 2 },
    ],
  },
]

export function getFocusActions(goals: Goal[]): FocusAction[] {
  return goals.flatMap((goal) =>
    goal.actions
      .filter((action) => action.current < action.target)
      .map((action) => ({
        ...action,
        goalId: goal.id,
      }))
  )
}
