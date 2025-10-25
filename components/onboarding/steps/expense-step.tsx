"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Calculator } from "lucide-react"

interface ExpenseStepProps {
  onNext: () => void
  onSkip: () => void
  isLoading: boolean
}

const expenseCategories = [
  { value: "SEEDS", label: "Graines et semences", icon: "🌱" },
  { value: "FERTILIZER", label: "Engrais", icon: "🌿" },
  { value: "EQUIPMENT", label: "Équipement", icon: "🔧" },
  { value: "LABOR", label: "Main d'œuvre", icon: "👥" },
  { value: "FUEL", label: "Carburant", icon: "⛽" },
  { value: "MAINTENANCE", label: "Maintenance", icon: "🔨" },
  { value: "OTHER", label: "Autres", icon: "📝" }
]

export function ExpenseStep({ onNext, onSkip, isLoading }: ExpenseStepProps) {
  const [transactionType, setTransactionType] = useState<"EXPENSE" | "REVENUE">("EXPENSE")
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulation de l'enregistrement
    await new Promise(resolve => setTimeout(resolve, 1000))
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="h-8 w-8 text-[#006633]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-2">
          Gérez vos finances
        </h3>
        <p className="text-[#0D1B2A]/70 text-sm">
          Enregistrez vos premières dépenses et revenus pour suivre votre rentabilité
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type de transaction */}
        <div className="space-y-3">
          <Label className="text-[#0D1B2A] font-medium">Type de transaction</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={transactionType === "EXPENSE" ? "default" : "outline"}
              onClick={() => setTransactionType("EXPENSE")}
              className={`${
                transactionType === "EXPENSE" 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Dépense
            </Button>
            <Button
              type="button"
              variant={transactionType === "REVENUE" ? "default" : "outline"}
              onClick={() => setTransactionType("REVENUE")}
              className={`${
                transactionType === "REVENUE" 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "border-green-300 text-green-600 hover:bg-green-50"
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Revenu
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#0D1B2A] font-medium">
              Description *
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={transactionType === "EXPENSE" ? "Ex: Achat de semences de riz" : "Ex: Vente de récolte"}
              className="border-[#D4AF37]/30 focus:border-[#006633]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-[#0D1B2A] font-medium">
              Montant (FCFA) *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-[#0D1B2A]/50" />
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Ex: 50000"
                className="pl-10 border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>
          </div>
        </div>

        {transactionType === "EXPENSE" && (
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#0D1B2A] font-medium">
              Catégorie
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="border-[#D4AF37]/30 focus:border-[#006633]">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="date" className="text-[#0D1B2A] font-medium">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="border-[#D4AF37]/30 focus:border-[#006633]"
            required
          />
        </div>

        <Card className="bg-[#F5F5DC] border-[#D4AF37]/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#006633]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Calculator className="h-4 w-4 text-[#006633]" />
              </div>
              <div>
                <h4 className="font-medium text-[#0D1B2A] mb-1">
                  💡 Conseil
                </h4>
                <p className="text-sm text-[#0D1B2A]/70">
                  Enregistrez régulièrement vos dépenses et revenus pour avoir une vue claire 
                  de la rentabilité de votre exploitation. FarmLink vous aidera à analyser ces données.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
          >
            Passer cette étape
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.description || !formData.amount}
            className="bg-[#006633] hover:bg-[#C1440E] text-white"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
