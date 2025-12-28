import { motion } from 'framer-motion'
import { useState } from 'react'

interface ReviewActionItemProps {
  title: string
  current: number
  target: number
  onIncrement?: () => void
  onDecrement?: () => void
}

export function ReviewActionItem({
  title,
  current,
  target,
  onIncrement,
  onDecrement,
}: ReviewActionItemProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const isComplete = current >= target

  const handleIncrement = () => {
    if (current >= target) return
    setIsAnimating(true)
    onIncrement?.()
    setTimeout(() => setIsAnimating(false), 200)
  }

  const handleDecrement = () => {
    if (current <= 0) return
    onDecrement?.()
  }

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Checkbox indicator */}
      <motion.div
        className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${isComplete ? 'bg-accent-amber border-accent-amber' : 'border-text-disabled'}
        `}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {isComplete && (
          <svg className="w-3 h-3 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </motion.div>

      {/* Title */}
      <span className={`flex-1 ${isComplete ? 'text-text-secondary' : 'text-text-primary'}`}>
        {title}
      </span>

      {/* Count controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          disabled={current <= 0}
          className="w-7 h-7 rounded-full bg-bg-surface-hover text-text-secondary disabled:opacity-30"
        >
          −
        </button>
        <span className="w-10 text-center text-text-primary">
          {current}/{target}
        </span>
        <button
          onClick={handleIncrement}
          disabled={current >= target}
          className="w-7 h-7 rounded-full bg-accent-coral/20 text-accent-coral disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  )
}
