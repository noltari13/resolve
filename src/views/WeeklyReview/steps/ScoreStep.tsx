import { ScoreDisplay } from '../../../components/ScoreDisplay'
import type { ReviewAction } from '../../../types'

interface ScoreStepProps {
  weekNumber: number
  actions: ReviewAction[]
  onContinue: () => void
}

export function ScoreStep({ weekNumber, actions, onContinue }: ScoreStepProps) {
  const totalTarget = actions.reduce((sum, a) => sum + a.target, 0)
  const totalCurrent = actions.reduce((sum, a) => sum + a.current, 0)
  const score = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-display font-bold text-text-primary">
          Week {weekNumber}
        </h1>
      </div>

      {/* Score display */}
      <div className="flex-1 flex items-center justify-center">
        <ScoreDisplay score={score} completed={totalCurrent} total={totalTarget} />
      </div>

      {/* Continue button */}
      <div className="pt-4">
        <button
          onClick={onContinue}
          className="w-full py-3 bg-accent-amber text-bg-base rounded-lg font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
