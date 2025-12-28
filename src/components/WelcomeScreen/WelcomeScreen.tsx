interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <h1 className="font-display font-bold text-3xl text-text-primary">
          Set 2-4 big goals
          <br />
          for the next 12 weeks
        </h1>
        <p className="text-text-secondary mt-4 text-lg">
          Not habits. Not tasks.
          <br />
          Meaningful goals with weekly actions.
        </p>
        <button
          onClick={onGetStarted}
          className="mt-8 w-full bg-accent-amber text-bg-base font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-accent-amber/90"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
