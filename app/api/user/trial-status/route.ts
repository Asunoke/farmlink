import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getTrialDaysLeft, checkTrialExpired } from "@/lib/trial-limits"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    if (session.user.subscription !== 'FREE') {
      return NextResponse.json({ 
        daysLeft: 0, 
        isExpired: false 
      })
    }

    const daysLeft = await getTrialDaysLeft(session.user.id)
    const isExpired = await checkTrialExpired(session.user.id)

    return NextResponse.json({
      daysLeft,
      isExpired
    })
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'essai:', error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
