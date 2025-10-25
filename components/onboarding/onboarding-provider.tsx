"use client"

import { useOnboarding } from "@/hooks/use-onboarding"
import { OnboardingWizard } from "./onboarding-wizard"
import { OnboardingDetector } from "./onboarding-detector"

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
      <OnboardingDetector />
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
