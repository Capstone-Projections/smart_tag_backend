import { PrismaClient } from '@prisma/client'
// import { add } from 'date-fns'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
    const kwabena = await prisma.student.create({
        data:{
            email: "kwabena@live.com",
            firstName: "Kwabena",
        }
    })
}

main()
    .catch((e: Error) => {
    console.error(e)
    process.exit(1)
    })
    .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect()
    })