"use client"

interface TutorialProviderProps {
  children: React.ReactNode
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  // Version simplifiée sans tutoriel pour éviter les erreurs de build
  return <>{children}</>
}
