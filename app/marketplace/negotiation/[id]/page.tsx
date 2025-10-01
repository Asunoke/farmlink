"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, MessageSquare, DollarSign, Package, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Message {
  id: string
  content: string
  price?: number
  quantity?: number
  type: "message" | "offer" | "counter_offer"
  userId: string
  userName: string
  timestamp: Date
}

interface NegotiationData {
  id: string
  offer?: {
    id: string
    title: string
    price: number
    quantity: number
    unit: string
    location: string
    user: { name: string }
  }
  demand?: {
    id: string
    title: string
    maxPrice: number
    quantity: number
    unit: string
    location: string
    user: { name: string }
  }
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COUNTER_OFFER" | "COMPLETED"
  messages: Message[]
}

export default function NegotiationPage() {
  const { data: session } = useSession()
  const params = useParams()
  const negotiationId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [negotiation, setNegotiation] = useState<NegotiationData | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [counterPrice, setCounterPrice] = useState("")
  const [counterQuantity, setCounterQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Normalize API data into our expected shapes
  const normalizeNegotiationData = (raw: any): NegotiationData => {
    const normalizedMessages: Message[] = Array.isArray(raw?.messages)
      ? raw.messages.map((m: any) => ({
          id: m.id ?? String(Math.random()),
          content: m.content ?? "",
          price: m.price,
          quantity: m.quantity,
          type: (m.type as Message["type"]) ?? "message",
          userId: m.userId ?? m.user?.id ?? "",
          userName: m.userName ?? m.user?.name ?? "",
          timestamp: m.timestamp
            ? new Date(m.timestamp)
            : m.createdAt
            ? new Date(m.createdAt)
            : new Date(),
        }))
      : []

    return {
      id: raw.id,
      offer: raw.offer,
      demand: raw.demand,
      status: raw.status,
      messages: normalizedMessages,
    }
  }

  // Charger les données de négociation
  useEffect(() => {
    const fetchNegotiation = async () => {
      try {
        const response = await fetch(`/api/marketplace/negotiations/${negotiationId}`)
        if (response.ok) {
          const data = await response.json()
          setNegotiation(normalizeNegotiationData(data))
        } else {
          console.error("Erreur lors du chargement de la négociation")
        }
      } catch (error) {
        console.error("Error fetching negotiation:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNegotiation()
  }, [negotiationId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [negotiation?.messages])

  

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session?.user || !negotiation) return

    try {
      // Optimistic append to avoid flicker/disappear
      const optimisticMessage: Message = {
        id: `${Date.now()}`,
        content: newMessage,
        type: "message",
        userId: (session.user as any).id,
        userName: session.user?.name || "",
        timestamp: new Date(),
      }
      setNegotiation(prev => prev ? { ...prev, messages: [...(prev.messages || []), optimisticMessage] } as NegotiationData : prev)
      setNewMessage("")

      const response = await fetch(`/api/marketplace/negotiations/${negotiationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage
        })
      })

      if (response.ok) {
        const updatedNegotiation = await response.json()
        // Merge server state with existing messages to preserve history
        setNegotiation(prev => {
          const server = normalizeNegotiationData(updatedNegotiation)
          const combined = [...(prev?.messages || []), ...(server.messages || [])]
          // de-duplicate by content+timestamp+userId
          const seen = new Set<string>()
          const unique = combined.filter(m => {
            const key = `${m.userId}|${m.content}|${new Date(m.timestamp).getTime()}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          return prev ? { ...prev, ...server, messages: unique } : server
        })
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de l'envoi du message")
        // rollback optimistic on error
        setNegotiation(prev => prev ? { ...prev, messages: prev.messages.slice(0, -1) } as NegotiationData : prev)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Erreur lors de l'envoi du message")
      // rollback optimistic on error
      setNegotiation(prev => prev ? { ...prev, messages: prev.messages.slice(0, -1) } as NegotiationData : prev)
    }
  }

  const handleCounterOffer = async () => {
    if (!counterPrice || !counterQuantity || !session?.user || !negotiation) return

    try {
      const contentText = `Je propose ${counterPrice} fcfa pour ${counterQuantity} ${negotiation.offer?.unit || negotiation.demand?.unit}`
      const optimisticMessage: Message = {
        id: `${Date.now()}`,
        content: contentText,
        type: "counter_offer",
        price: parseFloat(counterPrice),
        quantity: parseFloat(counterQuantity),
        userId: (session.user as any).id,
        userName: session.user?.name || "",
        timestamp: new Date(),
      }
      setNegotiation(prev => prev ? { ...prev, messages: [...(prev.messages || []), optimisticMessage] } as NegotiationData : prev)

      const response = await fetch(`/api/marketplace/negotiations/${negotiationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: parseFloat(counterPrice),
          quantity: parseFloat(counterQuantity),
          status: "COUNTER_OFFER",
          message: contentText
        })
      })

      if (response.ok) {
        const updatedNegotiation = await response.json()
        setNegotiation(prev => {
          const server = normalizeNegotiationData(updatedNegotiation)
          const combined = [...(prev?.messages || []), ...(server.messages || [])]
          const seen = new Set<string>()
          const unique = combined.filter(m => {
            const key = `${m.userId}|${m.content}|${new Date(m.timestamp).getTime()}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          return prev ? { ...prev, ...server, messages: unique } : server
        })
        setCounterPrice("")
        setCounterQuantity("")
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de la contre-offre")
        setNegotiation(prev => prev ? { ...prev, messages: prev.messages.slice(0, -1) } as NegotiationData : prev)
      }
    } catch (error) {
      console.error("Error making counter offer:", error)
      alert("Erreur lors de la contre-offre")
      setNegotiation(prev => prev ? { ...prev, messages: prev.messages.slice(0, -1) } as NegotiationData : prev)
    }
  }

  const handleAcceptOffer = async () => {
    if (!session?.user || !negotiation) return
    
    try {
      const response = await fetch(`/api/marketplace/negotiations/${negotiationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "ACCEPTED"
        })
      })

      if (response.ok) {
        const updatedNegotiation = await response.json()
        setNegotiation(normalizeNegotiationData(updatedNegotiation))
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors de l'acceptation")
      }
    } catch (error) {
      console.error("Error accepting offer:", error)
      alert("Erreur lors de l'acceptation")
    }
  }

  const handleRejectOffer = async () => {
    if (!session?.user || !negotiation) return
    
    try {
      const response = await fetch(`/api/marketplace/negotiations/${negotiationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REJECTED"
        })
      })

      if (response.ok) {
        const updatedNegotiation = await response.json()
        setNegotiation(normalizeNegotiationData(updatedNegotiation))
      } else {
        const error = await response.json()
        alert(error.error || "Erreur lors du rejet")
      }
    } catch (error) {
      console.error("Error rejecting offer:", error)
      alert("Erreur lors du rejet")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la négociation...</p>
        </div>
      </div>
    )
  }

  if (!negotiation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Négociation introuvable</CardTitle>
            <CardDescription>
              Cette négociation n'existe pas ou vous n'avez pas l'autorisation de la voir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/marketplace">
              <Button className="w-full">Retour au marché</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = negotiation.offer?.user.name === session?.user?.name || 
                  negotiation.demand?.user.name === session?.user?.name

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">FL</span>
              </div>
              <span className="text-xl font-bold">FarmLink</span>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour au marché
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Negotiation Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Négociation
                  </CardTitle>
                  <CardDescription>
                    {negotiation.offer ? "Offre" : "Demande"}: {negotiation.offer?.title || negotiation.demand?.title}
                  </CardDescription>
                </div>
                <Badge variant={
                  negotiation.status === "ACCEPTED" ? "default" :
                  negotiation.status === "REJECTED" ? "destructive" :
                  negotiation.status === "COUNTER_OFFER" ? "secondary" :
                  "outline"
                }>
                  {negotiation.status === "ACCEPTED" ? "Accepté" :
                   negotiation.status === "REJECTED" ? "Rejeté" :
                   negotiation.status === "COUNTER_OFFER" ? "Contre-offre" :
                   "En cours"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {negotiation.offer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Produit</span>
                    </div>
                    <p>{negotiation.offer.title}</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{negotiation.offer.price.toLocaleString()} fcfa / {negotiation.offer.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{negotiation.offer.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Vendeur</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{negotiation.offer.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{negotiation.offer.user.name}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full">
                    <div className="space-y-4">
                      {((negotiation.messages ?? []).length === 0) && (
                        <div className="text-sm text-muted-foreground">
                          Aucun message pour le moment.
                        </div>
                      )}
                      {(negotiation.messages ?? []).map((message, idx) => (
                        <div
                          key={`${message.id || "m"}-${new Date(message.timestamp as any).getTime()}-${idx}`}
                          className={`flex ${message.userId === session?.user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${message.userId === session?.user?.id ? "order-2" : "order-1"}`}>
                            <div className={`p-3 rounded-lg ${
                              message.userId === session?.user?.id 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            }`}>
                              {message.type === "counter_offer" && (
                                <div className="mb-2 p-2 bg-background/20 rounded text-sm">
                                  <div className="font-medium">Contre-offre:</div>
                                  <div>{message.price?.toLocaleString()} fcfa pour {message.quantity} {negotiation.offer?.unit || negotiation.demand?.unit}</div>
                                </div>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.userName} • {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Message Input */}
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Counter Offer & Actions */}
            <div className="space-y-4">
              {/* Counter Offer */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contre-offre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="counterPrice">Prix (fcfa)</Label>
                    <Input
                      id="counterPrice"
                      type="number"
                      placeholder="450"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="counterQuantity">Quantité</Label>
                    <Input
                      id="counterQuantity"
                      type="number"
                      placeholder="80"
                      value={counterQuantity}
                      onChange={(e) => setCounterQuantity(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleCounterOffer} 
                    className="w-full"
                    disabled={!counterPrice || !counterQuantity}
                  >
                    Faire une contre-offre
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              {isOwner && negotiation.status === "PENDING" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button onClick={handleAcceptOffer} className="w-full">
                      Accepter l'offre
                    </Button>
                    <Button onClick={handleRejectOffer} variant="destructive" className="w-full">
                      Rejeter l'offre
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
