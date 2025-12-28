import { useState, useMemo } from 'react'
import type { Cycle } from '../../types'

interface CycleSetupProps {
  onComplete: (cycle: Cycle) => void
  onBack: () => void
}

function getNextMonday(): Date {
  const today = new Date()
  const day = today.getDay()
  const daysUntilMonday = day === 0 ? 1 : 8 - day
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + daysUntilMonday)
  nextMonday.setHours(0, 0, 0, 0)
  return nextMonday
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDateDisplay(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getCycleName(startDate: string): string {
  const date = new Date(startDate + 'T00:00:00')
  const quarter = Math.ceil((date.getMonth() + 1) / 3)
  const year = date.getFullYear()
  return `Q${quarter} ${year} Goals`
}

function getEndDate(startDate: string, weeks: number): string {
  const start = new Date(startDate + 'T00:00:00')
  const end = new Date(start)
  end.setDate(start.getDate() + weeks * 7 - 1)
  return formatDateForInput(end)
}

export function CycleSetup({ onComplete, onBack }: CycleSetupProps) {
  const defaultStart = formatDateForInput(getNextMonday())
  const [durationWeeks, setDurationWeeks] = useState(12)
  const [startDate, setStartDate] = useState(defaultStart)
  const [showOptions, setShowOptions] = useState(false)

  const endDate = useMemo(() => getEndDate(startDate, durationWeeks), [startDate, durationWeeks])
  const cycleName = useMemo(() => getCycleName(startDate), [startDate])

  const handleComplete = () => {
    const cycle: Cycle = {
      id: crypto.randomUUID(),
      name: cycleName,
      startDate,
      endDate,
      durationWeeks,
      currentWeek: 1,
      status: 'active',
    }
    onComplete(cycle)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <button
          onClick={onBack}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back
        </button>

        <h1 className="font-display font-bold text-2xl text-text-primary mt-6">
          Your {durationWeeks}-Week Cycle
        </h1>

        {/* Cycle Card */}
        <div className="bg-bg-surface rounded-card p-4 mt-6">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            {cycleName}
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {formatDateDisplay(startDate)} – {formatDateDisplay(endDate)} • {durationWeeks} weeks
          </p>

          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-accent-amber text-sm mt-3 hover:underline"
          >
            {showOptions ? 'Hide options' : 'Change'}
          </button>

          {showOptions && (
            <div className="mt-4 pt-4 border-t border-text-disabled/20 space-y-4">
              {/* Duration picker */}
              <div>
                <label className="text-text-secondary text-sm">Duration</label>
                <div className="flex gap-2 mt-2">
                  {[4, 8, 12].map((weeks) => (
                    <button
                      key={weeks}
                      onClick={() => setDurationWeeks(weeks)}
                      className={`
                        flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                        ${durationWeeks === weeks
                          ? 'bg-accent-amber text-bg-base'
                          : 'bg-bg-base text-text-secondary hover:text-text-primary'
                        }
                      `}
                    >
                      {weeks} weeks
                    </button>
                  ))}
                </div>
              </div>

              {/* Start date picker */}
              <div>
                <label className="text-text-secondary text-sm">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full bg-bg-base text-text-primary rounded-lg px-3 py-2 border border-text-disabled/20 focus:outline-none focus:ring-2 focus:ring-accent-amber"
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleComplete}
          className="mt-8 w-full bg-accent-amber text-bg-base font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-accent-amber/90"
        >
          Looks Good
        </button>
      </div>
    </div>
  )
}
