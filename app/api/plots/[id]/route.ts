import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const plotUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  area: z.number().positive().optional(),
  cropType: z.string().min(1).optional(),
  plantedDate: z.string().optional(),
  harvestDate: z.string().optional(),
  status: z.enum(["PREPARATION", "PLANTED", "GROWING", "HARVESTED", "FALLOW"]).optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const plot = await prisma.plot.findFirst({
      where: {
        id,
        farm: {
          userId: session.user.id,
        },
      },
      include: {
        farm: {
          select: { name: true, location: true },
        },
      },
    })

    if (!plot) {
      return NextResponse.json({ error: "Parcelle non trouvée" }, { status: 404 })
    }

    return NextResponse.json(plot)
  } catch (error) {
    console.error("Plot fetch error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validated = plotUpdateSchema.parse(body)

    const existing = await prisma.plot.findFirst({
      where: {
        id,
        farm: {
          userId: session.user.id,
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: "Parcelle non trouvée" }, { status: 404 })
    }

    const updateData: any = { ...validated }
    if (validated.plantedDate && validated.plantedDate.trim() !== '') {
      updateData.plantedDate = new Date(validated.plantedDate)
    } else if (validated.plantedDate === '') {
      updateData.plantedDate = null
    }
    if (validated.harvestDate && validated.harvestDate.trim() !== '') {
      updateData.harvestDate = new Date(validated.harvestDate)
    } else if (validated.harvestDate === '') {
      updateData.harvestDate = null
    }

    const updated = await prisma.plot.update({
      where: { id },
      data: updateData,
      include: {
        farm: {
          select: { name: true, location: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Plot update error:", error)
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
    const existing = await prisma.plot.findFirst({
      where: {
        id,
        farm: {
          userId: session.user.id,
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: "Parcelle non trouvée" }, { status: 404 })
    }

    await prisma.plot.delete({ where: { id } })
    return NextResponse.json({ message: "Parcelle supprimée" })
  } catch (error) {
    console.error("Plot deletion error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}