type WeekStatus = 'complete' | 'partial' | 'missed'

interface WeekDotsProps {
  weeks: WeekStatus[]
}

export function WeekDots({ weeks }: WeekDotsProps) {
  return (
    <div className="flex gap-1.5">
      {weeks.map((status, index) => (
        <div
          key={index}
          className={`
            w-2 h-2 rounded-full
            ${status === 'complete' ? 'bg-accent-amber' : ''}
            ${status === 'partial' ? 'bg-accent-amber/50' : ''}
            ${status === 'missed' ? 'border border-accent-amber/30 bg-transparent' : ''}
          `}
          title={`Week ${index + 1}: ${status}`}
        />
      ))}
    </div>
  )
}
