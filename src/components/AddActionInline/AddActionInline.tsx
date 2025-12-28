import { useState } from 'react'

interface AddActionInlineProps {
  onAdd: (title: string, target: number) => void
}

export function AddActionInline({ onAdd }: AddActionInlineProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState(1)

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd(title.trim(), target)
    setTitle('')
    setTarget(1)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setTitle('')
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-text-secondary hover:text-accent-coral transition-colors text-sm py-2"
      >
        + Add action for this week
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 py-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Action title..."
        autoFocus
        className="flex-1 bg-bg-base border border-text-disabled rounded px-2 py-1 text-text-primary placeholder:text-text-disabled focus:border-accent-coral focus:outline-none"
      />
      <select
        value={target}
        onChange={(e) => setTarget(Number(e.target.value))}
        className="bg-bg-base border border-text-disabled rounded px-2 py-1 text-text-primary"
      >
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <option key={n} value={n}>
            {n}x
          </option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className="px-3 py-1 bg-accent-coral text-bg-base rounded font-medium disabled:opacity-50"
      >
        Add
      </button>
      <button
        onClick={() => {
          setIsOpen(false)
          setTitle('')
        }}
        className="px-2 py-1 text-text-secondary hover:text-text-primary"
      >
        Cancel
      </button>
    </div>
  )
}
