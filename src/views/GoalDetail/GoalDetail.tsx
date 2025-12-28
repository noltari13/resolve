import { useAppStore } from '../../store/useAppStore'
import { ProgressRing } from '../../components/ProgressRing'
import { EditableText } from '../../components/EditableText'
import { ActionRow } from '../../components/ActionRow'
import { MilestoneRow } from '../../components/MilestoneRow'
import { AddItemInput } from '../../components/AddItemInput'
import type { Action, Milestone } from '../../types'

interface GoalDetailProps {
  goalId: string
  onBack: () => void
}

export function GoalDetail({ goalId, onBack }: GoalDetailProps) {
  const goal = useAppStore((state) => state.goals.find((g) => g.id === goalId))
  const updateGoal = useAppStore((state) => state.updateGoal)
  const deleteGoal = useAppStore((state) => state.deleteGoal)
  const updateAction = useAppStore((state) => state.updateAction)
  const addAction = useAppStore((state) => state.addAction)
  const deleteAction = useAppStore((state) => state.deleteAction)
  const addMilestone = useAppStore((state) => state.addMilestone)
  const updateMilestone = useAppStore((state) => state.updateMilestone)
  const deleteMilestone = useAppStore((state) => state.deleteMilestone)

  if (!goal) {
    return (
      <div className="min-h-screen bg-bg-base p-4">
        <button onClick={onBack} className="text-text-secondary">
          Back
        </button>
        <p className="text-text-primary mt-4">Goal not found</p>
      </div>
    )
  }

  const handleDeleteGoal = () => {
    if (window.confirm('Delete this goal and all its actions?')) {
      deleteGoal(goalId)
      onBack()
    }
  }

  const handleAddAction = (title: string) => {
    const newAction: Action = {
      id: crypto.randomUUID(),
      title,
      target: 1,
      current: 0,
    }
    addAction(goalId, newAction)
  }

  const handleAddMilestone = (title: string) => {
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      goalId,
      title,
      completed: false,
      completedAt: null,
    }
    addMilestone(goalId, newMilestone)
  }

  const handleToggleMilestone = (milestone: Milestone) => {
    updateMilestone(goalId, milestone.id, {
      completed: !milestone.completed,
      completedAt: !milestone.completed ? new Date().toISOString() : null,
    })
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <div className="p-4 border-b border-text-disabled/10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleDeleteGoal}
            className="text-text-disabled hover:text-accent-coral transition-colors p-2"
            aria-label="Delete goal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-start gap-4">
          <ProgressRing percentage={goal.percentage} size={64} strokeWidth={5} />
          <div className="flex-1">
            <EditableText
              value={goal.title}
              onSave={(title) => updateGoal(goalId, { title })}
              className="text-xl font-display text-text-primary block"
              placeholder="Goal title"
            />
            <EditableText
              value={goal.identityStatement || ''}
              onSave={(identityStatement) =>
                updateGoal(goalId, { identityStatement: identityStatement || undefined })
              }
              className="text-text-secondary italic mt-1 block"
              placeholder="Add identity statement..."
            />
          </div>
        </div>

        {/* Week history dots */}
        {goal.weekHistory.length > 0 && (
          <div className="flex gap-1.5 mt-4">
            {goal.weekHistory.map((status, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  status === 'complete'
                    ? 'bg-accent-amber'
                    : status === 'partial'
                    ? 'bg-accent-amber/50'
                    : 'bg-text-disabled/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Weekly Actions Section */}
      <div className="p-4">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
          Weekly Actions
        </h2>
        <div className="space-y-2">
          {goal.actions.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
              onUpdateTitle={(title) => {
                updateGoal(goalId, {
                  actions: goal.actions.map((a) =>
                    a.id === action.id ? { ...a, title } : a
                  ),
                })
              }}
              onIncrement={() => {
                if (action.current < action.target) {
                  updateAction(goalId, action.id, action.current + 1)
                }
              }}
              onDelete={() => deleteAction(goalId, action.id)}
            />
          ))}
          <AddItemInput placeholder="+ Add action" onAdd={handleAddAction} />
        </div>
      </div>

      {/* Milestones Section */}
      <div className="p-4 pt-0">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
          Milestones
        </h2>
        <div className="space-y-2">
          {(goal.milestones || []).map((milestone) => (
            <MilestoneRow
              key={milestone.id}
              milestone={milestone}
              onUpdateTitle={(title) => updateMilestone(goalId, milestone.id, { title })}
              onToggleComplete={() => handleToggleMilestone(milestone)}
              onDelete={() => deleteMilestone(goalId, milestone.id)}
            />
          ))}
          <AddItemInput placeholder="+ Add milestone" onAdd={handleAddMilestone} />
        </div>
      </div>
    </div>
  )
}
