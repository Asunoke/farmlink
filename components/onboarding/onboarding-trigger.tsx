"use client"

import { Button } from "@/components/ui/button"
import { Play, BookOpen } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"

interface OnboardingTriggerProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function OnboardingTrigger({ 
  variant = "outline", 
  size = "default",
  className = ""
}: OnboardingTriggerProps) {
  const { setShowOnboarding, resetOnboarding } = useOnboarding()

  const handleStartOnboarding = () => {
    resetOnboarding()
    setShowOnboarding(true)
  }

  return (
    <Button
      onClick={handleStartOnboarding}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <Play className="h-4 w-4" />
      Tutoriel FarmLink
    </Button>
  )
}
