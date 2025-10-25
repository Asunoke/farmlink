"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface OnboardingState {
  isCompleted: boolean
  currentStep: number
  completedSteps: number[]
  hasSeenOnboarding: boolean
  userId?: string
}

const ONBOARDING_STORAGE_KEY = "farmlink-onboarding"

export function useOnboarding() {
  const { data: session } = useSession()
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isCompleted: false,
    currentStep: 0,
    completedSteps: [],
    hasSeenOnboarding: false
  })

  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!session?.user?.id) return

    // Charger l'état depuis le localStorage
    const savedState = localStorage.getItem(ONBOARDING_STORAGE_KEY)
    const currentUserId = session.user.id

    if (savedState) {
      const parsed = JSON.parse(savedState)
      
      // Vérifier si c'est un nouvel utilisateur (ID différent)
      if (parsed.userId !== currentUserId) {
        // Nouvel utilisateur - réinitialiser et montrer l'onboarding
        setOnboardingState({
          isCompleted: false,
          currentStep: 0,
          completedSteps: [],
          hasSeenOnboarding: false,
          userId: currentUserId
        })
        setShowOnboarding(true)
      } else {
        // Utilisateur existant - charger son état
        setOnboardingState(parsed)
        setShowOnboarding(!parsed.isCompleted && !parsed.hasSeenOnboarding)
      }
    } else {
      // Premier utilisateur - montrer l'onboarding
      setOnboardingState({
        isCompleted: false,
        currentStep: 0,
        completedSteps: [],
        hasSeenOnboarding: false,
        userId: currentUserId
      })
      setShowOnboarding(true)
    }
  }, [session?.user?.id])

  const updateOnboardingState = (updates: Partial<OnboardingState>) => {
    const newState = { ...onboardingState, ...updates, userId: session?.user?.id }
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
