"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Leaf,
  MapPin,
  Calculator,
  Users,
  Store
} from 'lucide-react'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  target: string
  action?: string
  points: number
  completed: boolean
}

interface WelcomeTutorialProps {
  onComplete: () => void
  onSkip: () => void
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur FarmLink ! 🌱',
    description: 'Découvrez comment gérer votre ferme comme un pro. Commençons par explorer les fonctionnalités principales.',
    icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
    target: 'dashboard-header',
    points: 10,
    completed: false
  },
  {
    id: 'farms',
    title: 'Gérez vos Fermes 🏡',
    description: 'Créez et organisez vos fermes. Ajoutez des parcelles, suivez vos cultures et planifiez vos récoltes.',
    icon: <Leaf className="h-6 w-6 text-green-500" />,
    target: 'farms-section',
    action: 'Cliquez sur "Nouvelle Ferme"',
    points: 25,
    completed: false
  },
  {
    id: 'budget',
    title: 'Contrôlez vos Finances 💰',
    description: 'Suivez vos dépenses, revenus et calculez la rentabilité de vos cultures.',
    icon: <Calculator className="h-6 w-6 text-blue-500" />,
    target: 'budget-section',
    action: 'Explorez l\'onglet Budget',
    points: 20,
    completed: false
  },
  {
    id: 'team',
    title: 'Organisez votre Équipe 👥',
    description: 'Gérez vos employés, assignez des tâches et suivez les performances.',
    icon: <Users className="h-6 w-6 text-purple-500" />,
    target: 'team-section',
    action: 'Découvrez l\'onglet Équipe',
    points: 20,
    completed: false
  },
  {
    id: 'marketplace',
    title: 'Vendez et Achetez 🛒',
    description: 'Connectez-vous avec d\'autres agriculteurs pour échanger vos produits.',
    icon: <Store className="h-6 w-6 text-orange-500" />,
    target: 'marketplace-section',
    action: 'Visitez le Marketplace',
    points: 25,
    completed: false
  }
]

export function SimpleWelcomeTutorial({ onComplete, onSkip }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  // Vérifier si l'utilisateur a déjà complété le tutoriel
  useEffect(() => {
    const hasCompletedTutorial = localStorage.getItem('farmlink-tutorial-completed')
    if (hasCompletedTutorial) {
      setShowTutorial(false)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('farmlink-tutorial-completed', 'true')
    setTotalPoints(prev => prev + tutorialSteps[currentStep].points)
    setCompletedSteps(prev => [...prev, tutorialSteps[currentStep].id])
    setShowTutorial(false)
    onComplete()
  }

  const handleSkip = () => {
    setShowTutorial(false)
    onSkip()
  }

  const currentStepData = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  if (!showTutorial) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="relative overflow-hidden">
          {/* Header avec progression */}
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8" />
                <div>
                  <CardTitle className="text-xl">Tutoriel FarmLink</CardTitle>
                  <p className="text-sm opacity-90">
                    Étape {currentStep + 1} sur {tutorialSteps.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400" />
                <span className="font-bold">{totalPoints} pts</span>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs mt-1">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Étape actuelle */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-100 to-blue-100">
                  {currentStepData.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground mb-4">{currentStepData.description}</p>
              
              {currentStepData.action && (
                <Badge variant="secondary" className="mb-4">
                  <Target className="h-4 w-4 mr-1" />
                  {currentStepData.action}
                </Badge>
              )}

              {/* Points pour cette étape */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>+{currentStepData.points} points</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Précédent
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Passer
                </Button>
                <Button onClick={handleNext} className="bg-gradient-to-r from-green-500 to-blue-500">
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Terminer
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Étapes complétées */}
            {completedSteps.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Étapes complétées</span>
                </div>
                <div className="flex gap-1">
                  {completedSteps.map((stepId, index) => (
                    <div
                      key={stepId}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
