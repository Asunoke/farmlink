"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Bell, Check, CheckCheck, Trash2, AlertCircle, Info, CheckCircle } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  data?: any
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error("Erreur lors du chargement des notifications")
      
      const data = await response.json()
      setNotifications(data.notifications)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        )
      }
    } catch (err) {
      console.error('Erreur lors du marquage:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        )
      }
    } catch (err) {
      console.error('Erreur lors du marquage:', err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEGOTIATION_MESSAGE':
        return <Bell className="h-4 w-4 text-blue-500" />
      case 'NEGOTIATION_UPDATE':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'OFFER_INTEREST':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'NEGOTIATION_MESSAGE':
        return 'border-l-blue-500'
      case 'NEGOTIATION_UPDATE':
        return 'border-l-green-500'
      case 'OFFER_INTEREST':
        return 'border-l-orange-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Gérez vos notifications</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-3 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : "Aucune notification non lue"}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck className="h-4 w-4 mr-2" />
              Marquer tout comme lu
            </Button>
          )}
        </div>

        {/* Notifications */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                Vous n'avez pas encore de notifications.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.isRead ? 'bg-blue-50/50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-blue-900' : ''}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge variant="secondary" className="text-xs">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
