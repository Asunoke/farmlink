"use client"

import { useOnboarding } from "@/hooks/use-onboarding"
import { OnboardingWizard } from "./onboarding-wizard"

interface OnboardingProviderProps {
  children: React.ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const {
    showOnboarding,
    setShowOnboarding,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding()

  return (
    <>
      {children}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
    </>
  )
}
