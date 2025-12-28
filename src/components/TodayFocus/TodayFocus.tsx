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

  if (count === 0) {
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
