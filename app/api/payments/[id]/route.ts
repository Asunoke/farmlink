import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const payment = await prisma.payment.findUnique({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: "Paiement non trouvé" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
