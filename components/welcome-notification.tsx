"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

interface WelcomeNotificationProps {
  name?: string
  onClose?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export function WelcomeNotification({ 
  name = "Nouvel utilisateur", 
  onClose,
  autoClose = true,
  autoCloseDelay = 5000
}: WelcomeNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  return (
    <Card className="border-green-200 bg-green-50/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-green-800">
                Bienvenue sur FarmLink ! 🎉
              </CardTitle>
              <CardDescription className="text-green-700">
                Salut {name} ! Votre compte a été créé avec succès.
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-green-700 mb-3">
          Vous pouvez maintenant commencer à utiliser toutes les fonctionnalités de FarmLink :
        </p>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Gérer vos fermes et parcelles</li>
          <li>• Suivre vos dépenses et revenus</li>
          <li>• Organiser votre équipe</li>
          <li>• Accéder au marché agricole</li>
        </ul>
      </CardContent>
    </Card>
  )
}
