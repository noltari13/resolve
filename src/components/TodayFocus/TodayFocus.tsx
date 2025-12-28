import { motion, AnimatePresence } from 'framer-motion'
import { ActionItem } from '../ActionItem'

export interface FocusAction {
  id: string
  goalId: string
  title: string
  current: number
  target: number
}

interface TodayFocusProps {
  actions: FocusAction[]
  onActionComplete?: (actionId: string, goalId: string) => void
}

export function TodayFocus({ actions, onActionComplete }: TodayFocusProps) {
  const incompleteActions = actions.filter((a) => a.current < a.target)
  const count = incompleteActions.length
  const allComplete = actions.length > 0 && count === 0

  if (allComplete) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bg-surface rounded-card p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent-amber/20 flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-accent-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <p className="text-text-primary font-display font-semibold">
          You showed up today.
        </p>
        <p className="text-text-secondary text-sm mt-1">
          All actions complete
        </p>
      </motion.div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="bg-bg-surface rounded-card p-4 text-center">
        <p className="text-text-secondary">
          Nothing on deck today. Enjoy the space.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface rounded-card p-4">
      <h2 className="text-text-secondary text-sm font-medium mb-3">
        {count} action{count !== 1 ? 's' : ''} today
      </h2>
      <AnimatePresence mode="popLayout">
        {incompleteActions.slice(0, 5).map((action) => (
          <motion.div
            key={action.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ActionItem
              title={action.title}
              current={action.current}
              target={action.target}
              onComplete={() => onActionComplete?.(action.id, action.goalId)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {incompleteActions.length > 5 && (
        <p className="text-text-secondary text-sm mt-2">
          +{incompleteActions.length - 5} more
        </p>
      )}
    </div>
  )
}
