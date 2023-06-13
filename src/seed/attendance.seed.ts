import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const attendance = await prisma.attendance.createMany({
        data: [
            {
                status: true,
                user_iduser: 1,
                lesson_idlesson: 1,
            },
            {
                status: true,
                user_iduser: 3,
                lesson_idlesson: 1,
            },
            {
                status: true,
                user_iduser: 4,
                lesson_idlesson: 1,
            },
            {
                status: true,
                user_iduser: 5,
                lesson_idlesson: 1,
            },
        ],
    });
}

main()
    .catch((e: Error) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // Disconnect Prisma Client
        await prisma.$disconnect();
    });
