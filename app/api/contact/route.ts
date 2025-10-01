import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { z } from "zod"

const contactSchema = z.object({
  subject: z.string().min(1, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  category: z.enum(["TECHNICAL", "BILLING", "FEATURE_REQUEST", "BUG_REPORT", "OTHER"]).default("OTHER"),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // For now, return mock data since we need to add Contact model to schema
    const mockTickets = [
      {
        id: "1",
        subject: "Problème de synchronisation",
        message: "Les données ne se synchronisent pas correctement",
        status: "OPEN",
        priority: "HIGH",
        category: "TECHNICAL",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(mockTickets)
  } catch (error) {
    console.error("Contact tickets fetch error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // For now, return mock response since we need to add Contact model to schema
    const mockTicket = {
      id: Date.now().toString(),
      ...validatedData,
      status: "OPEN",
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockTicket, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Contact ticket creation error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
