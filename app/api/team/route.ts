import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { checkSubscriptionLimit } from "@/lib/subscription-middleware"

const teamMemberSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  role: z.string().min(1, "Le rôle est requis"),
  salary: z.number().positive("Le salaire doit être positif"),
  hireDate: z.string().datetime(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error("Team members fetch error:", error)
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
    const validatedData = teamMemberSchema.parse(body)

    const limitCheck = await checkSubscriptionLimit("teamMembers", session.user.id)
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 })
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        role: validatedData.role,
        salary: validatedData.salary,
        hireDate: new Date(validatedData.hireDate),
        userId: session.user.id,
      },
    })

    return NextResponse.json(teamMember, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Team member creation error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
