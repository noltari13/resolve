import { motion } from 'framer-motion'

interface ReviewPromptProps {
  weekNumber: number
  onReviewNow: () => void
  onLater: () => void
  isUrgent?: boolean
}

export function ReviewPrompt({
  weekNumber,
  onReviewNow,
  onLater,
  isUrgent = false,
}: ReviewPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-surface rounded-card p-4 border-l-4 border-accent-coral"
    >
      <p className="text-text-primary font-display font-semibold">
        Week {weekNumber} ended
      </p>
      <p className="text-text-secondary text-sm mt-1">
        {isUrgent
          ? 'Your review is overdue. Quick catch-up?'
          : 'Ready to review and plan next week?'}
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onReviewNow}
          className="flex-1 py-2 bg-accent-coral text-bg-base rounded-lg font-medium"
        >
          Review Now
        </button>
        <button
          onClick={onLater}
          className="px-4 py-2 text-text-secondary hover:text-text-primary"
        >
          Later
        </button>
      </div>
    </motion.div>
  )
}
