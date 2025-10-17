import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const farmUpdateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  crop: z.string().min(1, "La culture est requise").optional(),
  area: z.number().positive("La surface doit être positive").optional(),
  location: z.string().min(1, "La localisation est requise").optional(),
  plantingDate: z.string().datetime().optional(),
  harvestDate: z.string().datetime().optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const farm = await prisma.farm.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        plots: true,
        _count: {
          select: { plots: true },
        },
      },
    })

    if (!farm) {
      return NextResponse.json({ error: "Ferme non trouvée" }, { status: 404 })
    }

    return NextResponse.json(farm)
  } catch (error) {
    console.error("Farm fetch error:", error)
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
    const validatedData = farmUpdateSchema.parse(body)

    const existingFarm = await prisma.farm.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingFarm) {
      return NextResponse.json({ error: "Ferme non trouvée" }, { status: 404 })
    }

    const updateData: any = { ...validatedData }
    if (validatedData.plantingDate) {
      updateData.plantingDate = new Date(validatedData.plantingDate)
    }
    if (validatedData.harvestDate) {
      updateData.harvestDate = new Date(validatedData.harvestDate)
    }
    if (validatedData.area) {
      updateData.totalArea = validatedData.area
      delete updateData.area
    }

    const farm = await prisma.farm.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(farm)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Farm update error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = farmUpdateSchema.parse(body)

    const existingFarm = await prisma.farm.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingFarm) {
      return NextResponse.json({ error: "Ferme non trouvée" }, { status: 404 })
    }

    const updateData: any = { ...validatedData }
    if (validatedData.plantingDate) {
      updateData.plantingDate = new Date(validatedData.plantingDate)
    }
    if (validatedData.harvestDate) {
      updateData.harvestDate = new Date(validatedData.harvestDate)
    }
    if (validatedData.area) {
      updateData.totalArea = validatedData.area
      delete updateData.area
    }

    const farm = await prisma.farm.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(farm)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Farm update error:", error)
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
    const existingFarm = await prisma.farm.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingFarm) {
      return NextResponse.json({ error: "Ferme non trouvée" }, { status: 404 })
    }

    await prisma.farm.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Ferme supprimée avec succès" })
  } catch (error) {
    console.error("Farm deletion error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
