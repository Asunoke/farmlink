"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserPlus, Calendar, CheckCircle } from "lucide-react"

interface TeamStepProps {
  onNext: () => void
  onSkip: () => void
  isLoading: boolean
}

export function TeamStep({ onNext, onSkip, isLoading }: TeamStepProps) {
  const [memberData, setMemberData] = useState({
    name: "",
    role: "",
    salary: "",
    phone: "",
    email: "",
    hireDate: new Date().toISOString().split('T')[0]
  })

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: ""
  })

  const [currentSubStep, setCurrentSubStep] = useState<"member" | "task">("member")

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCurrentSubStep("task")
  }

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(resolve => setTimeout(resolve, 1000))
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#006633]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-[#006633]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0D1B2A] mb-2">
          Organisez votre équipe
        </h3>
        <p className="text-[#0D1B2A]/70 text-sm">
          Ajoutez vos employés et planifiez leurs tâches pour optimiser votre production
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center space-x-2 ${currentSubStep === "member" ? "text-[#006633]" : "text-green-600"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentSubStep === "member" ? "bg-[#006633] text-white" : "bg-green-100 text-green-600"
          }`}>
            {currentSubStep === "member" ? "1" : <CheckCircle className="h-4 w-4" />}
          </div>
          <span className="text-sm font-medium">Ajouter un employé</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentSubStep === "task" ? "text-[#006633]" : "text-gray-400"}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentSubStep === "task" ? "bg-[#006633] text-white" : "bg-gray-100 text-gray-400"
          }`}>
            2
          </div>
          <span className="text-sm font-medium">Créer une tâche</span>
        </div>
      </div>

      {currentSubStep === "member" ? (
        <form onSubmit={handleMemberSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0D1B2A] font-medium">
                Nom complet *
              </Label>
              <Input
                id="name"
                value={memberData.name}
                onChange={(e) => setMemberData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Amadou Traoré"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-[#0D1B2A] font-medium">
                Rôle *
              </Label>
              <Input
                id="role"
                value={memberData.role}
                onChange={(e) => setMemberData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Ex: Ouvrier agricole, Conducteur de tracteur"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-[#0D1B2A] font-medium">
                Salaire mensuel (FCFA)
              </Label>
              <Input
                id="salary"
                type="number"
                value={memberData.salary}
                onChange={(e) => setMemberData(prev => ({ ...prev, salary: e.target.value }))}
                placeholder="Ex: 50000"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#0D1B2A] font-medium">
                Téléphone
              </Label>
              <Input
                id="phone"
                value={memberData.phone}
                onChange={(e) => setMemberData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Ex: +223 70 12 34 56"
                className="border-[#D4AF37]/30 focus:border-[#006633]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#0D1B2A] font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={memberData.email}
              onChange={(e) => setMemberData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Ex: amadou@example.com"
              className="border-[#D4AF37]/30 focus:border-[#006633]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireDate" className="text-[#0D1B2A] font-medium">
              Date d'embauche
            </Label>
            <Input
              id="hireDate"
              type="date"
              value={memberData.hireDate}
              onChange={(e) => setMemberData(prev => ({ ...prev, hireDate: e.target.value }))}
              className="border-[#D4AF37]/30 focus:border-[#006633]"
            />
          </div>

          <Card className="bg-[#F5F5DC] border-[#D4AF37]/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#006633]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-4 w-4 text-[#006633]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#0D1B2A] mb-1">
                    💡 Conseil
                  </h4>
                  <p className="text-sm text-[#0D1B2A]/70">
                    Ajoutez tous vos employés pour mieux organiser le travail et suivre les coûts de main d'œuvre.
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
              disabled={isLoading || !memberData.name || !memberData.role}
              className="bg-[#006633] hover:bg-[#C1440E] text-white"
            >
              {isLoading ? "Ajout..." : "Ajouter l'employé"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskTitle" className="text-[#0D1B2A] font-medium">
              Titre de la tâche *
            </Label>
            <Input
              id="taskTitle"
              value={taskData.title}
              onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Préparation du sol pour la plantation"
              className="border-[#D4AF37]/30 focus:border-[#006633]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskDescription" className="text-[#0D1B2A] font-medium">
              Description
            </Label>
            <Textarea
              id="taskDescription"
              value={taskData.description}
              onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez les détails de la tâche..."
              className="border-[#D4AF37]/30 focus:border-[#006633]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-[#0D1B2A] font-medium">
                Priorité
              </Label>
              <select
                id="priority"
                value={taskData.priority}
                onChange={(e) => setTaskData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-2 border border-[#D4AF37]/30 rounded-md focus:border-[#006633] focus:outline-none"
              >
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Élevée</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-[#0D1B2A] font-medium">
                Date limite
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="border-[#D4AF37]/30 focus:border-[#006633]"
              />
            </div>
          </div>

          <Card className="bg-[#F5F5DC] border-[#D4AF37]/30">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#006633]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-[#006633]" />
                </div>
                <div>
                  <h4 className="font-medium text-[#0D1B2A] mb-1">
                    💡 Conseil
                  </h4>
                  <p className="text-sm text-[#0D1B2A]/70">
                    Planifiez les tâches selon les saisons agricoles et assignez-les à vos employés 
                    pour une meilleure organisation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentSubStep("member")}
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
            >
              Retour
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !taskData.title}
              className="bg-[#006633] hover:bg-[#C1440E] text-white"
            >
              {isLoading ? "Création..." : "Créer la tâche"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
