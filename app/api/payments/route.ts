import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Définir les plans et leurs prix
const PLANS = {
  BASIC: {
    monthlyPrice: 15000,
    yearlyPrice: 150000,
  },
  BUSINESS: {
    monthlyPrice: 35000,
    yearlyPrice: 350000,
  },
  ENTERPRISE: {
    monthlyPrice: 75000,
    yearlyPrice: 750000,
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { planId, amount, period, userOrangeMoneyNumber } = await request.json()

    if (!planId || !amount || !period) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
    }

    // Vérifier que le plan existe
    if (!PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 })
    }

    // Vérifier que le montant correspond au plan
    const plan = PLANS[planId as keyof typeof PLANS]
    const expectedAmount = period === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
    
    if (amount !== expectedAmount) {
      return NextResponse.json({ error: "Montant incorrect" }, { status: 400 })
    }

    // Vérifier que l'utilisateur n'a pas déjà un paiement en cours
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: session.user.id,
        status: 'PENDING'
      }
    })

    if (existingPayment) {
      return NextResponse.json({ error: "Un paiement est déjà en cours" }, { status: 400 })
    }

    // Créer le paiement
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        planId,
        amount,
        orangeMoneyNumber: "+223 85 23 92 19", // Numéro Orange Money de l'entreprise
        userOrangeMoneyNumber: userOrangeMoneyNumber || null,
        expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
