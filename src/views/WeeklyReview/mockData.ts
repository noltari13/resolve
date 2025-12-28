import type { ReviewAction, PlanAction } from '../../types'

export const mockReviewActions: ReviewAction[] = [
  { id: 'a1', goalId: 'g1', goalTitle: 'Get Fit', title: 'Run 3x this week', current: 2, target: 3 },
  { id: 'a2', goalId: 'g1', goalTitle: 'Get Fit', title: 'Interval session', current: 1, target: 1 },
  { id: 'a3', goalId: 'g2', goalTitle: 'Financial Health', title: 'Review budget', current: 0, target: 1 },
  { id: 'a4', goalId: 'g2', goalTitle: 'Financial Health', title: 'Track expenses', current: 1, target: 1 },
  { id: 'a5', goalId: 'g3', goalTitle: 'Learning', title: 'Read 20 pages', current: 0, target: 1 },
]

export const mockPlanActions: PlanAction[] = [
  { id: 'a1', goalId: 'g1', goalTitle: 'Get Fit', title: 'Run 3x this week', target: 3, enabled: true },
  { id: 'a2', goalId: 'g1', goalTitle: 'Get Fit', title: 'Interval session', target: 1, enabled: true },
  { id: 'a3', goalId: 'g2', goalTitle: 'Financial Health', title: 'Review budget', target: 1, enabled: true },
  { id: 'a4', goalId: 'g2', goalTitle: 'Financial Health', title: 'Track expenses', target: 1, enabled: true },
  { id: 'a5', goalId: 'g3', goalTitle: 'Learning', title: 'Read 20 pages', target: 1, enabled: true },
]

export function groupByGoal<T extends { goalId: string; goalTitle: string }>(
  actions: T[]
): Map<string, { goalTitle: string; actions: T[] }> {
  const groups = new Map<string, { goalTitle: string; actions: T[] }>()
  for (const action of actions) {
    const group = groups.get(action.goalId)
    if (group) {
      group.actions.push(action)
    } else {
      groups.set(action.goalId, { goalTitle: action.goalTitle, actions: [action] })
    }
  }
  return groups
}
