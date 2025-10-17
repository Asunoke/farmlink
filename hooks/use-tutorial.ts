"use client"

import { useState, useEffect, useCallback } from 'react'

interface TutorialStep {
  id: string
  title: string
  description: string
  target: string
  action?: string
  points: number
  completed: boolean
}

interface TutorialState {
  isActive: boolean
  currentStep: number
  totalSteps: number
  completedSteps: string[]
  totalPoints: number
  showWelcome: boolean
}

const TUTORIAL_STORAGE_KEY = 'farmlink-tutorial-state'
const TUTORIAL_COMPLETED_KEY = 'farmlink-tutorial-completed'

export function useTutorial() {
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    isActive: false,
    currentStep: 0,
    totalSteps: 0,
    completedSteps: [],
    totalPoints: 0,
    showWelcome: false
  })

  // Charger l'état du tutoriel au montage
  useEffect(() => {
    const savedState = localStorage.getItem(TUTORIAL_STORAGE_KEY)
    const hasCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY)
    
    if (savedState && !hasCompleted) {
      setTutorialState(JSON.parse(savedState))
    } else if (!hasCompleted) {
      // Premier utilisateur - afficher le tutoriel de bienvenue
      setTutorialState(prev => ({
        ...prev,
        showWelcome: true
      }))
    }
  }, [])

  // Sauvegarder l'état du tutoriel
  const saveTutorialState = useCallback((newState: Partial<TutorialState>) => {
    const updatedState = { ...tutorialState, ...newState }
    setTutorialState(updatedState)
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(updatedState))
  }, [tutorialState])

  // Démarrer le tutoriel
  const startTutorial = useCallback((steps: TutorialStep[]) => {
    saveTutorialState({
      isActive: true,
      currentStep: 0,
      totalSteps: steps.length,
      showWelcome: false
    })
  }, [saveTutorialState])

  // Passer à l'étape suivante
  const nextStep = useCallback((stepId: string, points: number) => {
    const newCompletedSteps = [...tutorialState.completedSteps, stepId]
    const newTotalPoints = tutorialState.totalPoints + points
    
    saveTutorialState({
      currentStep: tutorialState.currentStep + 1,
      completedSteps: newCompletedSteps,
      totalPoints: newTotalPoints
    })
  }, [tutorialState, saveTutorialState])

  // Étape précédente
  const previousStep = useCallback(() => {
    if (tutorialState.currentStep > 0) {
      saveTutorialState({
        currentStep: tutorialState.currentStep - 1
      })
    }
  }, [tutorialState, saveTutorialState])

  // Compléter le tutoriel
  const completeTutorial = useCallback(() => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true')
    localStorage.removeItem(TUTORIAL_STORAGE_KEY)
    
    setTutorialState({
      isActive: false,
      currentStep: 0,
      totalSteps: 0,
      completedSteps: [],
      totalPoints: 0,
      showWelcome: false
    })
  }, [])

  // Passer le tutoriel
  const skipTutorial = useCallback(() => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true')
    localStorage.removeItem(TUTORIAL_STORAGE_KEY)
    
    setTutorialState(prev => ({
      ...prev,
      isActive: false,
      showWelcome: false
    }))
  }, [])

  // Réinitialiser le tutoriel
  const resetTutorial = useCallback(() => {
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY)
    localStorage.removeItem(TUTORIAL_STORAGE_KEY)
    
    setTutorialState({
      isActive: false,
      currentStep: 0,
      totalSteps: 0,
      completedSteps: [],
      totalPoints: 0,
      showWelcome: true
    })
  }, [])

  // Vérifier si une étape est complétée
  const isStepCompleted = useCallback((stepId: string) => {
    return tutorialState.completedSteps.includes(stepId)
  }, [tutorialState.completedSteps])

  // Obtenir le pourcentage de progression
  const getProgressPercentage = useCallback(() => {
    if (tutorialState.totalSteps === 0) return 0
    return (tutorialState.completedSteps.length / tutorialState.totalSteps) * 100
  }, [tutorialState.completedSteps.length, tutorialState.totalSteps])

  // Vérifier si le tutoriel est terminé
  const isTutorialCompleted = useCallback(() => {
    return tutorialState.completedSteps.length === tutorialState.totalSteps
  }, [tutorialState.completedSteps.length, tutorialState.totalSteps])

  return {
    tutorialState,
    startTutorial,
    nextStep,
    previousStep,
    completeTutorial,
    skipTutorial,
    resetTutorial,
    isStepCompleted,
    getProgressPercentage,
    isTutorialCompleted,
    saveTutorialState
  }
}
