import { useState } from 'react'

interface AddItemInputProps {
  placeholder: string
  onAdd: (value: string) => void
}

export function AddItemInput({ placeholder, onAdd }: AddItemInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed)
      setValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      setValue('')
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div className="p-3 bg-bg-surface rounded-xl border-2 border-dashed border-text-disabled/30 hover:border-accent-amber/50 transition-colors">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent text-text-primary placeholder:text-text-disabled outline-none"
        aria-label={placeholder}
      />
    </div>
  )
}
