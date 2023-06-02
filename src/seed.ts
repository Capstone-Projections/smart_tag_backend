import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A `main` function so that we can use async/await
async function main() {
    const akowuah = await prisma.lecturer.create({
        data: {
            email: 'darkwak@live.com',
            firstName: 'Kwabena',
            lastName: 'Darkwa',
            password: 'Agent99.99',
            title: 'Mr',
            staffID: 'STF/0001',
            course_has_lecturer: {
                create: {
                    course: {
                        connect: {
                            idcourse: 1,
                        },
                    },
                },
            },
        },
    });

    const lectureRoom = await prisma.lectureroom.createMany({
        data:[
            {
                name: 'A110',
                roomLocation:'Ceasar Building',
                uid: '123',
            },
            {
                name: '302',
                roomLocation:'Bamfo Kwakye Building',
                uid: '124',
            },
            {
                name: '303',
                roomLocation:'Bamfo Kwakye Building',
                uid: '125',
            },

        ]
    });

    const lesson = await prisma.lesson.create({
        data: {
            course_has_lesson:{
                create:{
                    course:{
                        connect:{
                            idcourse:1
                        }
                    }
                }
            },
            lectureroom:{
                connect:{
                    idlectureRoom:1
                }
            },
            day: "Tuesday",
            startTime: "10:30",
            endTime: "12:30",
        },
    });

    const attendance = await prisma.attendance.create({
        data:{
            status:true,
            student:{
                connect:{
                    idstudent:1
                }
            },
            lesson:{
                connect:{
                    idlesson:2
                }
            }

        },
    });

    const moses = await prisma.student.create({
            data:{
                email: "baffourma@st.knust.edu.gh",
                password: "Agent99.99",
                firstName: "Moses",
                middleName: "Awuah",
                lastName: "Baffour",
                referenceNumber: "20575730",
                indexNumber: 8263719,
                studyProgram: "Computer Engineering",
                doubtPoints: 0.0,
                attendance: {
                        create:{
                            status:true,
                            lesson:{
                                connect:{
                                    idlesson:2
                                }
                            },
                        }
                },
                student_has_course:{
                    create:{
                        course:{
                            connect:{
                                idcourse:1
                            }
                        }
                    }
                }

            }})

    const course = await prisma.course.create({
        data: {
            courseCode: 'COE 454',
            name: 'Software Engineering',
            course_has_lecturer: {
                create: {
                    lecturer: {
                        connect: {
                            idlecturer: 3,
                        },
                    },
                },
            },
        },
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
