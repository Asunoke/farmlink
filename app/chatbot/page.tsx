"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send, 
  Bot, User, 
  Sparkles, 
  Home, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Cloud,
  BarChart3,
  Settings,
  HelpCircle,
  ArrowLeft,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'action'
}

const quickActions = [
  { icon: Home, label: "Mes fermes", action: "Voir mes fermes", color: "bg-green-500" },
  { icon: DollarSign, label: "Finances", action: "Voir mes finances", color: "bg-blue-500" },
  { icon: Users, label: "Équipe", action: "Gérer mon équipe", color: "bg-purple-500" },
  { icon: ShoppingCart, label: "Marché", action: "Accéder au marché", color: "bg-orange-500" },
  { icon: Cloud, label: "Météo", action: "Voir la météo", color: "bg-cyan-500" },
  { icon: BarChart3, label: "Rapports", action: "Voir les rapports", color: "bg-pink-500" }
]

const suggestions = [
  "Comment créer une nouvelle ferme ?",
  "Comment ajouter un employé ?",
  "Comment enregistrer une dépense ?",
  "Comment vendre mes produits ?",
  "Comment voir mes statistiques ?",
  "Comment changer mon plan ?",
  "Quelles sont les fonctionnalités de FarmLink ?",
  "Comment optimiser mes rendements ?"
]

export default function ChatbotPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Message de bienvenue
    const welcomeMessage: Message = {
      id: '1',
      content: `Bonjour ${session?.user?.name || 'utilisateur'} ! 👋 Je suis votre assistant FarmLink. Je peux vous aider avec toutes vos questions sur la gestion de vos fermes, finances, équipe, et bien plus encore. Que puis-je faire pour vous ?`,
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([welcomeMessage])
  }, [session?.user?.name])

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

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: `Bonjour ${session?.user?.name || 'utilisateur'} ! 👋 Je suis votre assistant FarmLink. Comment puis-je vous aider aujourd'hui ?`,
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-[#FFF8DC] to-[#F0E68C] p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0D1B2A] flex items-center gap-3">
                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-[#006633]" />
                Assistant FarmLink
              </h1>
              <p className="text-[#0D1B2A]/70 text-sm sm:text-base">Votre assistant IA pour tout savoir sur FarmLink</p>
            </div>
          </div>
          <Button
            onClick={clearChat}
            variant="outline"
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Chat principal */}
          <div className="lg:col-span-3">
            <Card className="h-[500px] sm:h-[600px] shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-[#006633] to-[#0D1B2A] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                  Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-full flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-[#006633] text-white'
                            : 'bg-[#F5F5DC] text-[#0D1B2A] border border-[#D4AF37]/20'
                        }`}>
                          <div className="flex items-start gap-3">
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 bg-[#006633] rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                            )}
                            {message.role === 'user' && (
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-white" />
                              </div>
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
                        <div className="bg-[#F5F5DC] text-[#0D1B2A] rounded-lg p-4 max-w-[80%] border border-[#D4AF37]/20">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#006633] rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
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

                {/* Input */}
                <div className="p-4 border-t border-[#D4AF37]/20">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Posez votre question..."
                      className="flex-1 border-[#D4AF37]/30 focus:border-[#006633]"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                    />
                    <Button
                      onClick={() => handleSendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className="bg-[#006633] hover:bg-[#C1440E] text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Actions rapides */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-[#0D1B2A]">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleQuickAction(action.action)}
                    className="w-full justify-start border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A] text-xs sm:text-sm"
                  >
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${action.color} mr-2 sm:mr-3`} />
                    <action.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg text-[#0D1B2A]">Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleSuggestion(suggestion)}
                    className="w-full justify-start text-left text-xs sm:text-sm text-[#0D1B2A]/70 hover:text-[#0D1B2A] hover:bg-[#D4AF37]/10"
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
