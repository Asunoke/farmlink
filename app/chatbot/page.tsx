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
  RefreshCw,
  Plus,
  MessageSquare,
  Trash2,
  Edit3,
  Menu
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  type?: 'text' | 'suggestion' | 'action'
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
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
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Charger les chats depuis localStorage
    const savedChats = localStorage.getItem('farmlink-chats')
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt)
      }))
      setChats(parsedChats)
      
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id)
        setMessages(parsedChats[0].messages)
      } else {
        createNewChat()
      }
    } else {
      createNewChat()
    }
  }, [])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "Nouvelle conversation",
      messages: [{
        id: '1',
        content: `Bonjour ${session?.user?.name || 'utilisateur'} ! 👋 Je suis votre assistant FarmLink. Je peux vous aider avec toutes vos questions sur la gestion de vos fermes, finances, équipe, et bien plus encore. Que puis-je faire pour vous ?`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setMessages(newChat.messages)
    saveChats([newChat, ...chats])
  }

  const saveChats = (chatsToSave: Chat[]) => {
    localStorage.setItem('farmlink-chats', JSON.stringify(chatsToSave))
  }

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

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    // Mettre à jour le titre du chat si c'est le premier message
    if (messages.length === 1) {
      const newTitle = messageContent.length > 30 
        ? messageContent.substring(0, 30) + "..." 
        : messageContent
      updateChatTitle(currentChatId!, newTitle)
    }

    // Simuler une réponse de l'assistant
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(messageContent),
        role: 'assistant',
        timestamp: new Date()
      }
      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      updateChatMessages(currentChatId!, finalMessages)
      setIsLoading(false)
    }, 1000)
  }

  const updateChatTitle = (chatId: string, newTitle: string) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle, updatedAt: new Date() }
        : chat
    )
    setChats(updatedChats)
    saveChats(updatedChats)
  }

  const updateChatMessages = (chatId: string, newMessages: Message[]) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages: newMessages, updatedAt: new Date() }
        : chat
    )
    setChats(updatedChats)
    saveChats(updatedChats)
  }

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
    }
  }

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId)
    setChats(updatedChats)
    saveChats(updatedChats)
    
    if (currentChatId === chatId) {
      if (updatedChats.length > 0) {
        selectChat(updatedChats[0].id)
      } else {
        createNewChat()
      }
    }
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
    createNewChat()
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex">
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-5 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-[#1a2a3a] border-r border-[#D4AF37]/20 overflow-hidden fixed lg:relative z-10 h-full`}>
        <div className="p-4 border-b border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={createNewChat}
              className="w-full bg-[#006633] hover:bg-[#C1440E] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle conversation
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentChatId === chat.id
                    ? 'bg-[#006633] text-white'
                    : 'hover:bg-[#D4AF37]/10 text-[#F5F5DC]'
                }`}
                onClick={() => selectChat(chat.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs opacity-70">
                      {chat.updatedAt.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteChat(chat.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#1a2a3a] border-b border-[#D4AF37]/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#006633] rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#F5F5DC]">Assistant FarmLink</h1>
                <p className="text-sm text-[#F5F5DC]/70">En ligne</p>
              </div>
            </div>
          </div>
          <Button
            onClick={clearChat}
            variant="outline"
            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-[#006633] text-white'
                    : 'bg-[#1a2a3a] text-[#F5F5DC] border border-[#D4AF37]/20'
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
                <div className="bg-[#1a2a3a] text-[#F5F5DC] rounded-lg p-4 max-w-[80%] border border-[#D4AF37]/20">
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
        <div className="bg-[#1a2a3a] border-t border-[#D4AF37]/20 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-[#0D1B2A] border-[#D4AF37]/30 text-[#F5F5DC] focus:border-[#006633]"
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
            
            {/* Suggestions rapides */}
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.slice(0, 4).map((suggestion, index) => (
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
        </div>
      </div>
    </div>
  )
}
