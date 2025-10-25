"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Home, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Cloud,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  Minimize2,
  Maximize2
} from "lucide-react"
import { useSession } from "next-auth/react"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'action'
}

interface ChatbotInterfaceProps {
  isOpen: boolean
  onClose: () => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

const quickActions = [
  { icon: Home, label: "Mes fermes", action: "Voir mes fermes" },
  { icon: DollarSign, label: "Finances", action: "Voir mes finances" },
  { icon: Users, label: "Équipe", action: "Gérer mon équipe" },
  { icon: ShoppingCart, label: "Marché", action: "Accéder au marché" },
  { icon: Cloud, label: "Météo", action: "Voir la météo" },
  { icon: BarChart3, label: "Rapports", action: "Voir les rapports" }
]

const suggestions = [
  "Comment créer une nouvelle ferme ?",
  "Comment ajouter un employé ?",
  "Comment enregistrer une dépense ?",
  "Comment vendre mes produits ?",
  "Comment voir mes statistiques ?",
  "Comment changer mon plan ?"
]

export function ChatbotInterface({ 
  isOpen, onClose, isMinimized = false, onToggleMinimize 
}: ChatbotInterfaceProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Message de bienvenue
      const welcomeMessage: Message = {
        id: '1',
        content: `Bonjour ${session?.user?.name || 'utilisateur'} ! 👋 Je suis votre assistant FarmLink. Je peux vous aider avec toutes vos questions sur la gestion de vos fermes, finances, équipe, et bien plus encore. Que puis-je faire pour vous ?`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, session?.user?.name])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simuler une réponse de l'assistant
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(messageContent),
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('ferme') || message.includes('fermes')) {
      return `🌱 **Gestion des Fermes**\n\nPour créer une nouvelle ferme :\n1. Allez dans "Fermes" → "Nouvelle ferme"\n2. Remplissez les informations (nom, localisation, superficie)\n3. Ajoutez vos parcelles\n4. Sauvegardez\n\nVous pouvez gérer plusieurs fermes et suivre leurs performances individuelles.`
    }
    
    if (message.includes('employé') || message.includes('équipe')) {
      return `👥 **Gestion d'Équipe**\n\nPour ajouter un employé :\n1. Allez dans "Équipe" → "Nouvel employé"\n2. Renseignez ses informations\n3. Assignez-lui des tâches\n4. Suivez ses performances\n\nVous pouvez gérer les salaires, planifier les tâches et suivre la productivité.`
    }
    
    if (message.includes('dépense') || message.includes('finance')) {
      return `💰 **Gestion Financière**\n\nPour enregistrer une dépense :\n1. Allez dans "Budget" → "Nouvelle dépense"\n2. Sélectionnez la catégorie\n3. Entrez le montant et la description\n4. Sauvegardez\n\nVous pouvez aussi enregistrer vos revenus et voir vos analyses financières.`
    }
    
    if (message.includes('marché') || message.includes('vendre')) {
      return `🛒 **Marché Agricole**\n\nPour vendre vos produits :\n1. Allez dans "Marché" → "Créer une offre"\n2. Décrivez votre produit\n3. Fixez le prix\n4. Publiez l'annonce\n\nVous pouvez aussi rechercher des produits à acheter et négocier avec d'autres agriculteurs.`
    }
    
    if (message.includes('météo')) {
      return `🌤️ **Météo Intelligente**\n\nLa météo est disponible dans votre dashboard. Vous y trouverez :\n- Prévisions météo précises\n- Alertes météorologiques\n- Recommandations d'irrigation\n- Planification saisonnière\n\nCela vous aide à planifier vos activités agricoles.`
    }
    
    if (message.includes('statistique') || message.includes('rapport')) {
      return `📊 **Rapports et Statistiques**\n\nVos rapports incluent :\n- Performance des fermes\n- Analyse des coûts\n- Rendements par culture\n- Productivité de l'équipe\n- Prévisions de revenus\n\nAccédez-y via "Rapports" dans votre dashboard.`
    }
    
    if (message.includes('plan') || message.includes('abonnement')) {
      return `💳 **Plans d'Abonnement**\n\nFarmLink propose plusieurs plans :\n- **Gratuit** : 1 ferme, fonctionnalités de base\n- **Professional** : 3 fermes, analyses avancées\n- **Business** : 5 fermes, API personnalisée\n- **Enterprise** : Support dédié, formation\n\nAllez dans "Paramètres" → "Abonnement" pour changer.`
    }
    
    return `🤖 Je comprends votre question. Voici quelques informations générales sur FarmLink :\n\nFarmLink est votre plateforme complète de gestion agricole qui vous permet de :\n- Gérer vos fermes et parcelles\n- Suivre vos finances\n- Organiser votre équipe\n- Vendre vos produits\n- Analyser vos performances\n\nN'hésitez pas à me poser des questions plus spécifiques !`
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-end p-2 sm:p-4 ${
      isMinimized ? 'pointer-events-none' : ''
    }`}>
      <Card className={`w-full max-w-md h-[500px] sm:h-[600px] shadow-2xl border-0 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px] sm:h-[600px]'
      }`}>
        <CardHeader className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Assistant FarmLink</CardTitle>
                <p className="text-sm text-white/80">En ligne</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-[#006633] text-white'
                        : 'bg-[#F5F5DC] text-[#0D1B2A]'
                    }`}>
                      <div className="flex items-start gap-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#F5F5DC] text-[#0D1B2A] rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#006633] rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-[#006633] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-[#006633] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-[#D4AF37]/20">
                <p className="text-sm text-[#0D1B2A]/70 mb-3">Suggestions :</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestion(suggestion)}
                      className="text-xs border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div className="p-3 sm:p-4 border-t border-[#D4AF37]/20">
              <p className="text-xs sm:text-sm text-[#0D1B2A]/70 mb-2 sm:mb-3">Actions rapides :</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs border-[#006633] text-[#006633] hover:bg-[#006633] hover:text-white h-auto p-1 sm:p-2 flex flex-col items-center gap-1"
                  >
                    <action.icon className="h-3 w-3" />
                    <span className="text-xs hidden sm:inline">{action.label}</span>
                    <span className="text-xs sm:hidden">{action.label.split(' ')[0]}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-[#D4AF37]/20">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 border-[#D4AF37]/30 focus:border-[#006633] text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                />
                <Button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="bg-[#006633] hover:bg-[#C1440E] text-white p-2"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
