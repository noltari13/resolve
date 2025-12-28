import { motion } from 'framer-motion'

interface DoneStepProps {
  nextWeekNumber: number
  onBackToToday: () => void
}

export function DoneStep({ nextWeekNumber, onBackToToday }: DoneStepProps) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center">
      {/* Celebration icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-accent-amber/20 flex items-center justify-center mb-6"
      >
        <svg
          className="w-8 h-8 text-accent-amber"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-display font-bold text-text-primary"
      >
        You're all set for Week {nextWeekNumber}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-text-secondary mt-2"
      >
        See you next week
      </motion.p>

      {/* Back to Today button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={onBackToToday}
          className="px-8 py-3 bg-accent-amber text-bg-base rounded-lg font-medium"
        >
          Back to Today
        </button>
      </motion.div>
    </div>
  )
}
