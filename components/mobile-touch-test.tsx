"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export function MobileTouchTest() {
  const [testResults, setTestResults] = useState<{
    buttonClick: boolean
    cardClick: boolean
    touchEvents: boolean
  }>({
    buttonClick: false,
    cardClick: false,
    touchEvents: false
  })

  const handleButtonClick = () => {
    setTestResults(prev => ({ ...prev, buttonClick: true }))
  }

  const handleCardClick = () => {
    setTestResults(prev => ({ ...prev, cardClick: true }))
  }

  const handleTouchStart = () => {
    setTestResults(prev => ({ ...prev, touchEvents: true }))
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Test d'interactions tactiles</h2>
      
      {/* Test bouton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Test Bouton
            {testResults.buttonClick ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleButtonClick}
            className="touch-manipulation min-h-[44px] w-full"
            onTouchStart={handleTouchStart}
          >
            Cliquez-moi (test mobile)
          </Button>
        </CardContent>
      </Card>

      {/* Test carte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Test Carte
            {testResults.cardClick ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            className="p-4 bg-gradient-to-r from-[#006633] to-[#0D1B2A] text-white rounded-lg cursor-pointer touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Carte cliquable (test mobile)
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats des tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Bouton cliquable:</span>
            {testResults.buttonClick ? (
              <span className="text-green-600 font-semibold">✓ Réussi</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Échec</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Carte cliquable:</span>
            {testResults.cardClick ? (
              <span className="text-green-600 font-semibold">✓ Réussi</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Échec</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Événements tactiles:</span>
            {testResults.touchEvents ? (
              <span className="text-green-600 font-semibold">✓ Réussi</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Échec</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
