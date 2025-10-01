import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const teamMemberUpdateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  role: z.string().min(1, "Le rôle est requis").optional(),
  salary: z.number().positive("Le salaire doit être positif").optional(),
  hireDate: z.string().datetime().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = teamMemberUpdateSchema.parse(body)

    const existingMember = await prisma.teamMember.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingMember) {
      return NextResponse.json({ error: "Membre d'équipe non trouvé" }, { status: 404 })
    }

    const updateData: any = { ...validatedData }
    if (validatedData.hireDate) {
      updateData.hireDate = new Date(validatedData.hireDate)
    }

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Team member update error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingMember) {
      return NextResponse.json({ error: "Membre d'équipe non trouvé" }, { status: 404 })
    }

    await prisma.teamMember.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Membre d'équipe supprimé avec succès" })
  } catch (error) {
    console.error("Team member deletion error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
