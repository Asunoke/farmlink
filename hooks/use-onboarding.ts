"use client"

import { useState, useEffect } from "react"

interface OnboardingState {
  isCompleted: boolean
  currentStep: number
  completedSteps: number[]
  hasSeenOnboarding: boolean
}

const ONBOARDING_STORAGE_KEY = "farmlink-onboarding"

export function useOnboarding() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isCompleted: false,
    currentStep: 0,
    completedSteps: [],
    hasSeenOnboarding: false
  })

  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Charger l'état depuis le localStorage
    const savedState = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    if (savedState) {
      const parsed = JSON.parse(savedState)
      setOnboardingState(parsed)
      // Ne pas montrer l'onboarding si déjà complété
      setShowOnboarding(!parsed.isCompleted && !parsed.hasSeenOnboarding)
    } else {
      // Nouvel utilisateur - montrer l'onboarding
      setShowOnboarding(true)
    }
  }, [])

  const updateOnboardingState = (updates: Partial<OnboardingState>) => {
    const newState = { ...onboardingState, ...updates }
    setOnboardingState(newState)
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState))
  }

  const completeStep = (stepIndex: number) => {
    const newCompletedSteps = [...onboardingState.completedSteps, stepIndex]
    updateOnboardingState({
      completedSteps: newCompletedSteps,
      currentStep: stepIndex + 1
    })
  }

  const completeOnboarding = () => {
    updateOnboardingState({
      isCompleted: true,
      hasSeenOnboarding: true
    })
    setShowOnboarding(false)
  }

  const skipOnboarding = () => {
    updateOnboardingState({
      hasSeenOnboarding: true,
      isCompleted: false
    })
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    setOnboardingState({
      isCompleted: false,
      currentStep: 0,
      completedSteps: [],
      hasSeenOnboarding: false
    })
    setShowOnboarding(true)
  }

  return {
    onboardingState,
    showOnboarding,
    setShowOnboarding,
    completeStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  }
}
