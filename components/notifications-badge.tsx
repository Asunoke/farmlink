"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"

export function NotificationsBadge() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    // Ne pas faire de requête si l'utilisateur n'est pas connecté
    if (!session?.user) {
      setUnreadCount(0)
      setIsLoading(false)
      return
    }

    const fetchUnreadCount = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/notifications/unread-count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.unreadCount || 0)
        } else if (response.status === 401) {
          // Utilisateur non autorisé, ne pas afficher d'erreur
          setUnreadCount(0)
        } else {
          console.warn('Erreur lors du chargement du nombre de notifications:', response.status)
          setUnreadCount(0)
        }
      } catch (error) {
        // Erreur réseau ou autre, ne pas afficher d'erreur dans la console
        console.warn('Erreur réseau lors du chargement du nombre de notifications')
        setUnreadCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnreadCount()
    
    // Rafraîchir toutes les 30 secondes seulement si l'utilisateur est connecté
    const interval = setInterval(() => {
      if (session?.user) {
        fetchUnreadCount()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [session?.user])

  // Ne pas afficher le badge si l'utilisateur n'est pas connecté, en cours de chargement, ou s'il n'y a pas de notifications
  if (!session?.user || isLoading || unreadCount === 0) return null

  return (
    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white">
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  )
}
