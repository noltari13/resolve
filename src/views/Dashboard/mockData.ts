import type { Cycle, DashboardGoal } from '../../types'

export const mockCycle: Cycle = {
  id: 'c1',
  name: 'Q1 2025 Goals',
  startDate: '2025-01-06',
  endDate: '2025-03-30',
  durationWeeks: 12,
  currentWeek: 4,
  status: 'active',
}

export const mockDashboardGoals: DashboardGoal[] = [
  {
    id: 'g1',
    title: 'Run a 5K',
    identityStatement: 'I am becoming a runner',
    percentage: 73,
    weekHistory: ['complete', 'complete', 'partial', 'missed'],
    actions: [],
    milestones: [
      { id: 'm1', goalId: 'g1', title: 'Complete Couch-to-5K Week 4', completed: true, completedAt: '2025-01-15' },
      { id: 'm2', goalId: 'g1', title: 'Register for local 5K', completed: false, completedAt: null },
    ],
  },
  {
    id: 'g2',
    title: 'Financial clarity',
    identityStatement: 'I am becoming financially literate',
    percentage: 45,
    weekHistory: ['partial', 'complete', 'missed', 'partial'],
    actions: [],
    milestones: [
      { id: 'm3', goalId: 'g2', title: 'Create monthly budget', completed: true, completedAt: '2025-01-10' },
      { id: 'm4', goalId: 'g2', title: 'Set up emergency fund', completed: false, completedAt: null },
    ],
  },
  {
    id: 'g3',
    title: 'Learn Spanish',
    percentage: 25,
    weekHistory: ['missed', 'partial', 'missed', 'missed'],
    actions: [],
    milestones: [
      { id: 'm5', goalId: 'g3', title: 'Complete Duolingo Unit 1', completed: false, completedAt: null },
    ],
  },
]
