import { EditableText } from '../EditableText'
import type { Milestone } from '../../types'

interface MilestoneRowProps {
  milestone: Milestone
  onUpdateTitle: (title: string) => void
  onToggleComplete: () => void
  onDelete: () => void
}

export function MilestoneRow({
  milestone,
  onUpdateTitle,
  onToggleComplete,
  onDelete,
}: MilestoneRowProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${milestone.title}"?`)) {
      onDelete()
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onToggleComplete}
          aria-pressed={milestone.completed}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            milestone.completed
              ? 'bg-accent-amber border-accent-amber'
              : 'border-text-disabled hover:border-accent-amber'
          }`}
          aria-label={milestone.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {milestone.completed && (
            <svg className="w-3 h-3 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <EditableText
          value={milestone.title}
          onSave={onUpdateTitle}
          placeholder="Milestone title"
          className={`flex-1 ${milestone.completed ? 'text-text-disabled line-through' : 'text-text-primary'}`}
        />
      </div>
      <button
        onClick={handleDelete}
        className="text-text-disabled hover:text-accent-coral transition-colors p-1 ml-2"
        aria-label="Delete milestone"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
