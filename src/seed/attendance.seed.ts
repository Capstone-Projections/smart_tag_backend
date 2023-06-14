import { PrismaClient } from '@prisma/client';
import { currentDate } from '../handlers/attendances/attendance.helpers';

const prisma = new PrismaClient();

async function main() {
    const attendance = await prisma.attendance.createMany({
        data: [
            {
                status: true,
                user_iduser: 1,
                lesson_idlesson: 1,
                currentDateTime: currentDate,
            },
            {
                status: true,
                user_iduser: 3,
                lesson_idlesson: 1,
                currentDateTime: currentDate,
            },
            {
                status: true,
                user_iduser: 4,
                lesson_idlesson: 1,
                currentDateTime: currentDate,
            },
            {
                status: true,
                user_iduser: 5,
                lesson_idlesson: 1,
                currentDateTime: currentDate,
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
