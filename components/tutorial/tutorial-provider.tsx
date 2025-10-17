"use client"

import { useEffect } from 'react'
import { WelcomeTutorial } from './welcome-tutorial'
import { useTutorial } from '@/hooks/use-tutorial'

interface TutorialProviderProps {
  children: React.ReactNode
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const { tutorialState, completeTutorial, skipTutorial } = useTutorial()

  const handleTutorialComplete = () => {
    completeTutorial()
  }

  const handleTutorialSkip = () => {
    skipTutorial()
  }

  return (
    <>
      {children}
      
      {tutorialState.showWelcome && (
        <WelcomeTutorial
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
    </>
  )
}
