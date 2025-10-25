"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Smartphone } from "lucide-react"

export function PaymentPhoneTest() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques sauf le +
    let cleaned = value.replace(/[^\d+]/g, '')
    
    // Si commence par 223, ajouter le +
    if (cleaned.startsWith('223')) {
      cleaned = '+' + cleaned
    }
    
    // Si commence par un numéro sans +, ajouter le +223
    if (cleaned.match(/^\d/) && !cleaned.startsWith('+223')) {
      cleaned = '+223' + cleaned
    }
    
    return cleaned
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setPhoneNumber(formatted)
    
    // Validation du numéro
    const isValidNumber = formatted.match(/^\+223\d{8}$/) !== null
    setIsValid(isValidNumber)
  }

  const testPaymentCreation = async () => {
    if (!isValid) {
      setTestResult("❌ Veuillez entrer un numéro valide")
      return
    }

    try {
      // Simuler la création d'un paiement de test
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: 'BASIC',
          amount: 15000,
          period: 'monthly',
          userOrangeMoneyNumber: phoneNumber,
        }),
      })

      if (response.ok) {
        const payment = await response.json()
        setTestResult(`✅ Paiement créé avec succès! ID: ${payment.id}`)
      } else {
        const error = await response.json()
        setTestResult(`❌ Erreur: ${error.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Erreur: ${error}`)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Test de sauvegarde du numéro</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-[#006633]" />
            Test du numéro Orange Money
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testPhone">Numéro Orange Money</Label>
            <div className="relative">
              <Input
                id="testPhone"
                type="tel"
                placeholder="+223 XX XX XX XX XX"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`font-mono pr-10 ${
                  phoneNumber && !isValid ? 'border-red-500' : ''
                }`}
                style={{ fontSize: '16px' }}
              />
              {phoneNumber && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {phoneNumber && !isValid && (
              <p className="text-sm text-red-400">
                Veuillez entrer un numéro valide (ex: +223 70 12 34 56)
              </p>
            )}
          </div>

          <Button 
            onClick={testPaymentCreation}
            disabled={!isValid}
            className="w-full"
          >
            Tester la création du paiement
          </Button>

          {testResult && (
            <div className={`p-3 rounded-lg ${
              testResult.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {testResult}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
