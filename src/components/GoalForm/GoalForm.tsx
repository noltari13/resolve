import { useState } from 'react'
import type { Goal, Action } from '../../types'

interface GoalFormProps {
  goalNumber: number
  initialGoal?: Goal
  onSave: (goal: Goal) => void
  onCancel: () => void
}

export function GoalForm({ goalNumber, initialGoal, onSave, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(initialGoal?.title ?? '')
  const [identityStatement, setIdentityStatement] = useState(initialGoal?.identityStatement ?? '')
  const [actions, setActions] = useState<Action[]>(initialGoal?.actions ?? [])
  const [newAction, setNewAction] = useState('')

  const handleAddAction = () => {
    if (!newAction.trim()) return
    const action: Action = {
      id: crypto.randomUUID(),
      title: newAction.trim(),
      current: 0,
      target: 1,
    }
    setActions([...actions, action])
    setNewAction('')
  }

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter((a) => a.id !== id))
  }

  const handleSave = () => {
    if (!title.trim()) return
    const goal: Goal = {
      id: initialGoal?.id ?? crypto.randomUUID(),
      title: title.trim(),
      identityStatement: identityStatement.trim() || undefined,
      percentage: 0,
      weekHistory: [],
      actions,
    }
    onSave(goal)
  }

  const isValid = title.trim().length > 0

  return (
    <div className="bg-bg-surface rounded-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-secondary text-sm">Goal {goalNumber}</span>
        <button
          onClick={onCancel}
          className="text-text-secondary hover:text-text-primary text-sm transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="text-text-secondary text-sm">What's your goal?</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Run a 5K"
          className="mt-2 w-full bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber placeholder:text-text-disabled"
        />
      </div>

      {/* Identity Statement */}
      <div className="mt-4">
        <label className="text-text-secondary text-sm">Who are you becoming? (optional)</label>
        <input
          type="text"
          value={identityStatement}
          onChange={(e) => setIdentityStatement(e.target.value)}
          placeholder="I am becoming a runner"
          className="mt-2 w-full bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber placeholder:text-text-disabled"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-text-disabled/20 my-4" />

      {/* Weekly Actions */}
      <div>
        <label className="text-text-secondary text-sm">Weekly Actions</label>

        <div className="mt-2 space-y-2">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center gap-2 bg-bg-base rounded-lg px-3 py-2"
            >
              <span className="flex-1 text-text-primary text-sm truncate">
                {action.title}
              </span>
              <button
                onClick={() => handleRemoveAction(action.id)}
                className="text-text-disabled hover:text-accent-coral transition-colors"
                aria-label={`Remove ${action.title}`}
              >
                ×
              </button>
            </div>
          ))}

          {/* Add action input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
              placeholder="+ Add action"
              className="flex-1 bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber placeholder:text-text-disabled text-sm"
            />
            {newAction.trim() && (
              <button
                onClick={handleAddAction}
                className="bg-accent-amber text-bg-base px-3 py-2 rounded-lg text-sm font-medium"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!isValid}
        className={`
          mt-6 w-full font-semibold py-3 px-6 rounded-lg transition-colors
          ${isValid
            ? 'bg-accent-amber text-bg-base hover:bg-accent-amber/90'
            : 'bg-text-disabled/20 text-text-disabled cursor-not-allowed'
          }
        `}
      >
        Save Goal
      </button>
    </div>
  )
}
