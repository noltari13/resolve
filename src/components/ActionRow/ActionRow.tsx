import { EditableText } from '../EditableText'
import type { Action } from '../../types'

interface ActionRowProps {
  action: Action
  onUpdateTitle: (title: string) => void
  onIncrement: () => void
  onDelete: () => void
}

export function ActionRow({
  action,
  onUpdateTitle,
  onIncrement,
  onDelete,
}: ActionRowProps) {
  const isComplete = action.current >= action.target

  const handleDelete = () => {
    if (window.confirm(`Delete "${action.title}"?`)) {
      onDelete()
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
      <EditableText
        value={action.title}
        onSave={onUpdateTitle}
        placeholder="Action title"
        className="text-text-primary flex-1"
      />
      <div className="flex items-center gap-3 ml-3">
        <button
          onClick={onIncrement}
          disabled={isComplete}
          aria-label={`Increment progress for ${action.title}, currently ${action.current} of ${action.target}`}
          className={`text-sm font-medium px-2 py-1 rounded ${
            isComplete
              ? 'text-accent-amber bg-accent-amber/10'
              : 'text-text-secondary hover:text-accent-amber hover:bg-accent-amber/10'
          } transition-colors`}
        >
          {action.current}/{action.target}
        </button>
        <button
          onClick={handleDelete}
          className="text-text-disabled hover:text-accent-coral transition-colors p-1"
          aria-label="Delete action"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
