"use client"

import { SimpleTutorial } from "./simple-tutorial"

interface OnboardingWizardProps {
  onComplete: () => void
  onSkip: () => void
}

// Le tutoriel est maintenant géré par SimpleTutorial

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  return <SimpleTutorial onComplete={onComplete} onSkip={onSkip} />
}
