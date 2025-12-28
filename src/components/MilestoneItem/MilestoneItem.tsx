import type { Milestone } from '../../types'

interface MilestoneItemProps {
  milestone: Milestone
  variant: 'completed' | 'upcoming'
}

export function MilestoneItem({ milestone, variant }: MilestoneItemProps) {
  if (variant === 'completed') {
    return (
      <div className="flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 text-accent-amber flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-text-secondary truncate">{milestone.title}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <svg className="w-4 h-4 text-accent-coral flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      <span className="text-text-secondary truncate">Next: {milestone.title}</span>
    </div>
  )
}
