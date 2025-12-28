import { useState, useRef, useEffect } from 'react'

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function EditableText({
  value,
  onSave,
  placeholder = 'Click to edit',
  className = '',
  inputClassName = '',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    setIsEditing(false)
    if (editValue !== value) {
      onSave(editValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-b border-accent-amber outline-none ${inputClassName}`}
        placeholder={placeholder}
      />
    )
  }

  const handleSpanKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsEditing(true)
    }
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      onKeyDown={handleSpanKeyDown}
      tabIndex={0}
      role="button"
      aria-label={value ? `Edit: ${value}` : placeholder}
      className={`cursor-pointer hover:text-accent-amber transition-colors ${className}`}
    >
      {value || <span className="text-text-disabled">{placeholder}</span>}
    </span>
  )
}
