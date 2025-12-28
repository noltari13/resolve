import { motion } from 'framer-motion'
import { useState } from 'react'

interface ActionItemProps {
  title: string
  current: number
  target: number
  onComplete?: () => void
}

export function ActionItem({ title, current, target, onComplete }: ActionItemProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const isComplete = current >= target

  const handleTap = () => {
    if (isComplete) return
    setIsAnimating(true)
    onComplete?.()
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleTap}
      disabled={isComplete}
      className={`
        w-full flex items-center gap-3 py-2 px-1 rounded-lg
        transition-colors duration-150
        ${isComplete ? 'opacity-60' : 'hover:bg-bg-surface-hover'}
      `}
    >
      {/* Circle/Checkbox */}
      <div className="relative">
        <motion.div
          className={`
            w-5 h-5 rounded-full border-2
            flex items-center justify-center
            ${isComplete
              ? 'bg-accent-amber border-accent-amber'
              : 'border-accent-coral'
            }
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

        {/* Pulse animation on complete */}
        {isAnimating && (
          <motion.div
            className="absolute inset-0 rounded-full bg-accent-amber"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Text */}
      <span className={`flex-1 text-left ${isComplete ? 'line-through' : ''}`}>
        {title}
      </span>

      {/* Count */}
      <span className="text-text-secondary text-sm">
        ({current}/{target})
      </span>
    </button>
  )
}
