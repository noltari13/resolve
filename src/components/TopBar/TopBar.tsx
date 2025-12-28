interface TopBarProps {
  title?: string
  onGoalsClick?: () => void
  onSettingsClick?: () => void
}

export function TopBar({
  title = 'Today',
  onGoalsClick,
  onSettingsClick
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between py-4 px-4">
      {/* Logo */}
      <div className="w-8 h-8 rounded-lg bg-accent-amber/20 flex items-center justify-center">
        <span className="text-accent-amber font-display font-bold text-sm">R</span>
      </div>

      {/* Title */}
      <h1 className="font-display font-semibold text-lg">{title}</h1>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGoalsClick}
          className="w-8 h-8 rounded-lg hover:bg-bg-surface flex items-center justify-center transition-colors"
          aria-label="Goals"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
        <button
          onClick={onSettingsClick}
          className="w-8 h-8 rounded-lg hover:bg-bg-surface flex items-center justify-center transition-colors"
          aria-label="Settings"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
