import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@farmlink.ml" },
    update: {},
    create: {
      email: "admin@farmlink.ml",
      name: "Administrateur FarmLink",
      password: adminPassword,
      role: "ADMIN",
      subscription: "PREMIUM",
    },
  })

  // Create demo user
  const userPassword = await bcrypt.hash("demo123", 12)
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@farmlink.ml" },
    update: {},
    create: {
      email: "demo@farmlink.ml",
      name: "Utilisateur Démo",
      password: userPassword,
      role: "USER",
      subscription: "BASIC",
    },
  })

  // Create demo farm
  const farm = await prisma.farm.create({
    data: {
      name: "Ferme de Démonstration",
      location: "Bamako, Mali",
      totalArea: 50.5,
      userId: demoUser.id,
    },
  })

  // Create demo plots
  await prisma.plot.createMany({
    data: [
      {
        name: "Parcelle Nord",
        area: 15.2,
        cropType: "Mil",
        status: "GROWING",
        farmId: farm.id,
        plantedDate: new Date("2024-06-15"),
      },
      {
        name: "Parcelle Sud",
        area: 20.3,
        cropType: "Sorgho",
        status: "PLANTED",
        farmId: farm.id,
        plantedDate: new Date("2024-07-01"),
      },
      {
        name: "Parcelle Est",
        area: 15.0,
        cropType: "Maïs",
        status: "PREPARATION",
        farmId: farm.id,
      },
    ],
  })

  // Create demo expenses
  await prisma.expense.createMany({
    data: [
      {
        description: "Achat de semences de mil",
        amount: 75000,
        category: "SEEDS",
        date: new Date("2024-06-10"),
        userId: demoUser.id,
      },
      {
        description: "Engrais NPK",
        amount: 120000,
        category: "FERTILIZER",
        date: new Date("2024-06-20"),
        userId: demoUser.id,
      },
      {
        description: "Carburant tracteur",
        amount: 45000,
        category: "FUEL",
        date: new Date("2024-07-05"),
        userId: demoUser.id,
      },
    ],
  })

  // Create demo team members
  const teamMember = await prisma.teamMember.create({
    data: {
      name: "Amadou Traoré",
      role: "Ouvrier agricole",
      salary: 150000,
      phone: "+223 70 12 34 56",
      hireDate: new Date("2024-01-15"),
      userId: demoUser.id,
    },
  })

  // Create demo tasks
  await prisma.task.createMany({
    data: [
      {
        title: "Irrigation parcelle Nord",
        description: "Arroser la parcelle de mil",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date("2024-12-25"),
        teamMemberId: teamMember.id,
      },
      {
        title: "Préparation parcelle Est",
        description: "Labourer et préparer le sol",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: new Date("2024-12-30"),
        teamMemberId: teamMember.id,
      },
    ],
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
