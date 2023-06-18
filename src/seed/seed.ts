import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A `main` function so that we can use async/await
async function main() {
    const lectureRoom = await prisma.lectureroom.createMany({
        data: [
            {
                name: 'A110',
                roomLocation: 'Ceasar Building',
                uid: '123',
            },
            {
                name: '302',
                roomLocation: 'Bamfo Kwakye Building',
                uid: '124',
            },
            {
                name: '303',
                roomLocation: 'Bamfo Kwakye Building',
                uid: '125',
            },
        ],
    });

    const student = await prisma.user.create({
        data: {
            firstName: 'Kwabena',
            lastName: 'Darkwa',
            email: 'darkwak@live.com',
            role: 'STUDENT',
        },
    });

    const lecturer = await prisma.user.create({
        data: {
            firstName: 'Emmanuel',
            lastName: 'Akowuah',
            email: 'ekakowuah@st.knust.edu.gh',
            role: 'LECTURER',
            isAdmin: true,
        },
    });

    const course = await prisma.course.create({
        data: {
            courseCode: 'COE 454',
            name: 'Digital Signal Processing',
            user_has_course: {
                create: {
                    user: {
                        connect: {
                            iduser: 1,
                        },
                    },
                },
            },
            course_has_lesson: {
                create: {
                    lesson: {
                        create: {
                            startTime: '10:30',
                            endTime: '11:30',
                            day: 'Monday',
                            lectureroom: {
                                connect: {
                                    idlectureRoom: 1,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    //TODO: ERROR IN CURRENT SEED FILE BECAUSE OF DATABASAE CHANGES
    // const attendance = await prisma.attendance.create({
    //     data: {
    //         status: true,
    //         user: {
    //             connect: {
    //                 iduser: 1,
    //             },
    //         },
    //         lesson: {
    //             connect: {
    //                 idlesson: 1,
    //             },
    //         },
    //     },
    // });
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
