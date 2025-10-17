"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Target, 
  CheckCircle,
  Award,
  Zap,
  Crown,
  Gem
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  points: number
  unlocked: boolean
  category: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  requirement: string
}

interface AchievementSystemProps {
  totalPoints: number
  completedSteps: string[]
  onAchievementUnlocked?: (achievement: Achievement) => void
}

const achievements: Achievement[] = [
  {
    id: 'first-farm',
    title: 'Premier Pas',
    description: 'Créez votre première ferme',
    icon: <Target className="h-6 w-6" />,
    points: 50,
    unlocked: false,
    category: 'beginner',
    requirement: 'Créer une ferme'
  },
  {
    id: 'farm-master',
    title: 'Maître Fermier',
    description: 'Gérez 5 fermes ou plus',
    icon: <Crown className="h-6 w-6" />,
    points: 200,
    unlocked: false,
    category: 'intermediate',
    requirement: '5 fermes créées'
  },
  {
    id: 'budget-expert',
    title: 'Expert Comptable',
    description: 'Maîtrisez la gestion budgétaire',
    icon: <Award className="h-6 w-6" />,
    points: 150,
    unlocked: false,
    category: 'intermediate',
    requirement: 'Utiliser le module budget'
  },
  {
    id: 'team-leader',
    title: 'Chef d\'Équipe',
    description: 'Gérez une équipe de 3+ personnes',
    icon: <Zap className="h-6 w-6" />,
    points: 300,
    unlocked: false,
    category: 'advanced',
    requirement: '3 employés ajoutés'
  },
  {
    id: 'marketplace-trader',
    title: 'Négociant',
    description: 'Participez au marketplace',
    icon: <Gem className="h-6 w-6" />,
    points: 100,
    unlocked: false,
    category: 'beginner',
    requirement: 'Première transaction'
  }
]

const categoryColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  expert: 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const categoryIcons = {
  beginner: <Target className="h-4 w-4" />,
  intermediate: <Star className="h-4 w-4" />,
  advanced: <Crown className="h-4 w-4" />,
  expert: <Trophy className="h-4 w-4" />
}

export function AchievementSystem({ 
  totalPoints, 
  completedSteps, 
  onAchievementUnlocked 
}: AchievementSystemProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  // Vérifier les achievements débloqués
  useEffect(() => {
    const checkAchievements = () => {
      const newlyUnlocked: Achievement[] = []
      
      achievements.forEach(achievement => {
        if (!achievement.unlocked) {
          let shouldUnlock = false
          
          switch (achievement.id) {
            case 'first-farm':
              shouldUnlock = completedSteps.includes('farms') && totalPoints >= 25
              break
            case 'farm-master':
              shouldUnlock = totalPoints >= 200
              break
            case 'budget-expert':
              shouldUnlock = completedSteps.includes('budget')
              break
            case 'team-leader':
              shouldUnlock = completedSteps.includes('team')
              break
            case 'marketplace-trader':
              shouldUnlock = completedSteps.includes('marketplace')
              break
          }
          
          if (shouldUnlock) {
            const unlockedAchievement = { ...achievement, unlocked: true }
            newlyUnlocked.push(unlockedAchievement)
            onAchievementUnlocked?.(unlockedAchievement)
          }
        }
      })
      
      if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newlyUnlocked])
        setNewAchievement(newlyUnlocked[0])
        setShowNotification(true)
        
        // Masquer la notification après 3 secondes
        setTimeout(() => {
          setShowNotification(false)
          setNewAchievement(null)
        }, 3000)
      }
    }
    
    checkAchievements()
  }, [totalPoints, completedSteps, onAchievementUnlocked])

  const getTotalUnlockedPoints = () => {
    return unlockedAchievements.reduce((total, achievement) => total + achievement.points, 0)
  }

  const getAchievementsByCategory = (category: Achievement['category']) => {
    return achievements.filter(achievement => achievement.category === category)
  }

  return (
    <>
      {/* Notification d'achievement */}
      {showNotification && newAchievement && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
            <Card className="w-80 shadow-2xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-yellow-100">
                    {newAchievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">Achievement Débloqué !</h4>
                    <p className="text-sm text-muted-foreground">{newAchievement.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">+{newAchievement.points} points</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      {/* Panel des achievements */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Système d'Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistiques globales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Points Totaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getTotalUnlockedPoints()}</div>
              <div className="text-sm text-muted-foreground">Points Bonus</div>
            </div>
          </div>

          {/* Progression générale */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progression Générale</span>
              <span>{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</span>
            </div>
            <Progress value={(unlockedAchievements.length / achievements.length) * 100} />
          </div>

          {/* Achievements par catégorie */}
          {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map(category => {
            const categoryAchievements = getAchievementsByCategory(category)
            const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length
            
            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  {categoryIcons[category]}
                  <h4 className="font-semibold capitalize">{category}</h4>
                  <Badge variant="outline" className={categoryColors[category]}>
                    {unlockedInCategory}/{categoryAchievements.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {categoryAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border transition-all animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ${
                        achievement.unlocked 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-muted/50 border-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{achievement.title}</h5>
                            {achievement.unlocked && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.requirement}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{achievement.points}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}
