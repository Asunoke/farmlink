"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout"

interface Payment {
  id: string
  userId: string
  planId: string
  amount: number
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'EXPIRED'
  orangeMoneyNumber?: string
  userOrangeMoneyNumber?: string
  expiresAt: string
  confirmedAt?: string
  createdAt: string
  user: {
    name: string
    email: string
  }
}

export default function AdminPaymentsPage() {
  const { data: session } = useSession()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if ((session?.user as any)?.role !== 'ADMIN') {
      return
    }
    fetchPayments()
  }, [session])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/payments')
      
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      } else {
        setError('Erreur lors du chargement des paiements')
      }
    } catch (error) {
      setError('Erreur lors du chargement des paiements')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePaymentStatus = async (paymentId: string, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Mettre à jour la liste des paiements
        setPayments(prev => 
          prev.map(payment => 
            payment.id === paymentId 
              ? { ...payment, status, confirmedAt: new Date().toISOString() }
              : payment
          )
        )
      } else {
        setError('Erreur lors de la mise à jour du paiement')
      }
    } catch (error) {
      setError('Erreur lors de la mise à jour du paiement')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />En attente</Badge>
      case 'CONFIRMED':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Confirmé</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>
      case 'EXPIRED':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Expiré</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanName = (planId: string) => {
    switch (planId) {
      case 'BASIC':
        return 'Pro'
      case 'PREMIUM':
        return 'Entreprise'
      default:
        return planId
    }
  }

  if ((session?.user as any)?.role !== 'ADMIN') {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-96">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
              <p className="text-muted-foreground">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des paiements</h1>
            <p className="text-muted-foreground">
              Gérez et vérifiez les paiements Orange Money
            </p>
          </div>
          <Button onClick={fetchPayments} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Liste des paiements</CardTitle>
            <CardDescription>
              {payments.length} paiement(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Chargement des paiements...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun paiement trouvé</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Numéro Orange Money</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.user.name}</div>
                          <div className="text-sm text-muted-foreground">{payment.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getPlanName(payment.planId)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.amount.toLocaleString()} fcfa
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {payment.userOrangeMoneyNumber ? (
                            <div className="font-mono bg-muted px-2 py-1 rounded">
                              {payment.userOrangeMoneyNumber}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Non fourni</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</div>
                          {payment.confirmedAt && (
                            <div className="text-muted-foreground">
                              Confirmé: {format(new Date(payment.confirmedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePaymentStatus(payment.id, 'CONFIRMED')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updatePaymentStatus(payment.id, 'REJECTED')}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        )}
                        {payment.status === 'CONFIRMED' && (
                          <Badge variant="default" className="bg-green-600">
                            Traité
                          </Badge>
                        )}
                        {payment.status === 'REJECTED' && (
                          <Badge variant="destructive">
                            Rejeté
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  )
}
