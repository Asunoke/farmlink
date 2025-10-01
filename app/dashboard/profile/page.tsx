"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { User, Mail, Calendar, Crown } from "lucide-react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        await update({ name })
        setMessage("Profil mis à jour avec succès")
      } else {
        setMessage("Erreur lors de la mise à jour")
      }
    } catch (error) {
      setMessage("Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "PREMIUM":
        return "bg-yellow-500 text-yellow-50"
      case "BASIC":
        return "bg-blue-500 text-blue-50"
      default:
        return "bg-gray-500 text-gray-50"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profil Utilisateur</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback className="text-lg">{getInitials(session.user.name || "U")}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">{session.user.name}</h3>
                    {session.user.role === "ADMIN" && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <Badge className={`w-fit ${getSubscriptionColor(session.user.subscription)}`}>
                    {session.user.subscription}
                  </Badge>
                </div>
              </div>

              <Separator />

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={session.user.email} disabled />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du Compte</CardTitle>
              <CardDescription>Informations sur votre compte FarmLink</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Rôle</p>
                  <p className="text-sm text-muted-foreground">{session.user.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Abonnement</p>
                  <p className="text-sm text-muted-foreground">{session.user.subscription}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Limites du plan {session.user.subscription}</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {session.user.subscription === "FREE" && (
                    <>
                      <p>• 1 ferme maximum</p>
                      <p>• 5 parcelles maximum</p>
                      <p>• 3 membres d'équipe maximum</p>
                    </>
                  )}
                  {session.user.subscription === "BASIC" && (
                    <>
                      <p>• 3 fermes maximum</p>
                      <p>• 20 parcelles maximum</p>
                      <p>• 10 membres d'équipe maximum</p>
                    </>
                  )}
                  {session.user.subscription === "PREMIUM" && (
                    <>
                      <p>• Fermes illimitées</p>
                      <p>• Parcelles illimitées</p>
                      <p>• Membres d'équipe illimités</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
