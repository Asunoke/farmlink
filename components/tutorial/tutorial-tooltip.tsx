"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  CheckCircle, 
  X, 
  Target,
  Sparkles,
  Star
} from 'lucide-react'

interface TutorialTooltipProps {
  target: string
  title: string
  description: string
  action?: string
  points?: number
  position?: 'top' | 'bottom' | 'left' | 'right'
  onNext: () => void
  onSkip: () => void
  isVisible: boolean
}

export function TutorialTooltip({
  target,
  title,
  description,
  action,
  points = 0,
  position = 'bottom',
  onNext,
  onSkip,
  isVisible
}: TutorialTooltipProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = document.querySelector(`[data-tutorial="${target}"]`) as HTMLElement
    if (element) {
      setTargetElement(element)
      
      // Ajouter un effet de surbrillance
      element.style.position = 'relative'
      element.style.zIndex = '1000'
      
      // Calculer la position du tooltip
      const rect = element.getBoundingClientRect()
      const tooltipRect = tooltipRef.current?.getBoundingClientRect()
      
      let x = rect.left + rect.width / 2
      let y = rect.bottom + 10
      
      if (position === 'top') {
        y = rect.top - (tooltipRect?.height || 0) - 10
      } else if (position === 'left') {
        x = rect.left - (tooltipRect?.width || 0) - 10
        y = rect.top + rect.height / 2
      } else if (position === 'right') {
        x = rect.right + 10
        y = rect.top + rect.height / 2
      }
      
      setTooltipPosition({ x, y })
    }
  }, [target, position])

  useEffect(() => {
    if (targetElement && isVisible) {
      // Ajouter une animation de pulsation
      const interval = setInterval(() => {
        targetElement.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.3)'
        setTimeout(() => {
          targetElement.style.boxShadow = '0 0 0 0px rgba(34, 197, 94, 0.3)'
        }, 500)
      }, 1000)

      return () => {
        clearInterval(interval)
        if (targetElement) {
          targetElement.style.boxShadow = ''
          targetElement.style.position = ''
          targetElement.style.zIndex = ''
        }
      }
    }
  }, [targetElement, isVisible])

  if (!isVisible || !targetElement) return null

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] pointer-events-none animate-in fade-in-0 zoom-in-95 duration-300"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: 'translate(-50%, 0)'
      }}
    >
        <Card className="w-80 shadow-2xl border-2 border-green-500 bg-white">
          <CardContent className="p-4">
            {/* Header avec points */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-sm">Tutoriel</span>
              </div>
              {points > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  +{points} pts
                </Badge>
              )}
            </div>

            {/* Contenu */}
            <div className="mb-4">
              <h4 className="font-bold text-lg mb-2">{title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{description}</p>
              
              {action && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                  <Target className="h-4 w-4" />
                  <span>{action}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Passer
              </Button>
              
              <Button
                size="sm"
                onClick={onNext}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Compris
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
}
