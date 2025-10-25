"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageCircle, X, Maximize2 } from "lucide-react"
import { ChatbotInterface } from "./chatbot-interface"
import { useRouter } from "next/navigation"

export function ChatbotTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const router = useRouter()

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      setIsOpen(true)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleMaximize = () => {
    router.push('/chatbot')
  }

  return (
    <>
      {/* Bouton flottant */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <Button
          onClick={handleToggle}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-[#006633] to-[#0D1B2A] hover:from-[#C1440E] hover:to-[#006633] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </Button>
        
        {/* Badge de notification */}
        {!isOpen && (
          <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-[#D4AF37] text-[#0D1B2A] animate-pulse text-xs">
            <Bot className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
            <span className="hidden sm:inline">IA</span>
          </Badge>
        )}
      </div>

      {/* Interface du chatbot */}
      <ChatbotInterface
        isOpen={isOpen}
        onClose={handleClose}
        isMinimized={isMinimized}
        onToggleMinimize={handleToggleMinimize}
        onMaximize={handleMaximize}
      />
    </>
  )
}
