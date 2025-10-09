import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { status } = await request.json()
    const { id } = await params

    if (!status || !['CONFIRMED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
    }

    // Récupérer le paiement
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!payment) {
      return NextResponse.json({ error: "Paiement non trouvé" }, { status: 404 })
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json({ error: "Le paiement a déjà été traité" }, { status: 400 })
    }

    // Mettre à jour le statut du paiement
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        confirmedAt: status === 'CONFIRMED' ? new Date() : null
      }
    })

    // Si le paiement est confirmé, mettre à jour l'abonnement de l'utilisateur
    if (status === 'CONFIRMED') {
      await prisma.user.update({
        where: { id: payment.userId },
        data: {
          subscription: payment.planId as any
        }
      })

      // Créer une notification pour l'utilisateur
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Paiement confirmé",
          message: `Votre abonnement ${payment.planId} a été activé avec succès.`,
          type: 'SYSTEM'
        }
      })
    } else if (status === 'REJECTED') {
      // Créer une notification pour l'utilisateur
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Paiement rejeté",
          message: "Votre paiement a été rejeté. Veuillez contacter le support si vous pensez qu'il s'agit d'une erreur.",
          type: 'SYSTEM'
        }
      })
    }

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
