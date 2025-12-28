import { useAppStore } from '../../store/useAppStore'

export function Settings() {
  const { resetStore } = useAppStore()

  const handleReset = () => {
    if (confirm('This will clear all your data and restart onboarding. Continue?')) {
      resetStore()
    }
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="font-display font-bold text-xl text-text-primary">
          Settings
        </h1>
        <p className="text-text-secondary mt-2">
          Settings will be available in a future update.
        </p>

        {/* Dev Tools */}
        <div className="mt-8 pt-6 border-t border-text-disabled/20">
          <h2 className="text-text-secondary text-sm font-medium mb-3">
            Developer Tools
          </h2>
          <button
            onClick={handleReset}
            className="w-full bg-accent-coral/10 text-accent-coral py-2 px-4 rounded-lg hover:bg-accent-coral/20 transition-colors text-sm"
          >
            Reset App & Restart Onboarding
          </button>
        </div>
      </div>
    </div>
  )
}
