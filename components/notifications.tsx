"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, X, MessageSquare, ShoppingCart, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "NEGOTIATION_MESSAGE" | "NEGOTIATION_UPDATE" | "OFFER_INTEREST" | "DEMAND_MATCH" | "SYSTEM"
  isRead: boolean
  data?: any
  createdAt: string
}

interface NotificationsProps {
  className?: string
}

export function Notifications({ className }: NotificationsProps) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?limit=10")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT"
      })
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT"
      })
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "NEGOTIATION_MESSAGE":
      case "NEGOTIATION_UPDATE":
        return <MessageSquare className="h-4 w-4" />
      case "OFFER_INTEREST":
      case "DEMAND_MATCH":
        return <ShoppingCart className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "NEGOTIATION_MESSAGE":
        return "text-blue-600"
      case "NEGOTIATION_UPDATE":
        return "text-green-600"
      case "OFFER_INTEREST":
        return "text-orange-600"
      case "DEMAND_MATCH":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <Card className={cn("w-full max-w-md bg-gradient-to-br from-[#0B1623] to-[#1A2332] border border-[#D4AF37]/30", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-[#D4AF37]">
          <Bell className="h-4 w-4" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 bg-[#C1440E] text-white">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs text-[#F5F5DC] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
          >
            Tout marquer comme lu
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37]"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-[#F5F5DC]/80 py-8">
              Aucune notification
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    notification.isRead 
                      ? "bg-muted/50" 
                      : "bg-background border-primary/20"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <div className={cn("mt-0.5", getNotificationColor(notification.type))}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function NotificationBell() {
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (session?.user) {
      fetchUnreadCount()
    }
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/notifications?unread=true&limit=1")
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </div>
  )
}
