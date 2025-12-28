import { motion } from 'framer-motion'
import { ProgressRing } from '../ProgressRing'

function getScoreMessage(score: number): string {
  if (score >= 90) return 'Exceptional week. You crushed it.'
  if (score >= 75) return 'Strong week. You showed up.'
  if (score >= 50) return 'Solid progress. Every action counts.'
  if (score >= 25) return "Tough week — but you're still here."
  if (score >= 1) return "Not your week. Tomorrow's a fresh start."
  return 'Life happens. Ready to reset?'
}

interface ScoreDisplayProps {
  score: number
  completed: number
  total: number
}

export function ScoreDisplay({ score, completed, total }: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-8"
    >
      {/* Large progress ring */}
      <div className="relative w-32 h-32">
        <ProgressRing percentage={score} size={128} strokeWidth={8} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-3xl font-display font-bold text-text-primary">
            {score}%
          </span>
        </motion.div>
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-lg font-display text-text-primary"
      >
        {getScoreMessage(score)}
      </motion.p>

      {/* Completion count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-sm text-text-secondary"
      >
        {completed} of {total} actions completed
      </motion.p>
    </motion.div>
  )
}
