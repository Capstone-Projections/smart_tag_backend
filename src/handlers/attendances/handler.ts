import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { AttendanceInput, UpdateAttendanceInput } from './interface';

export async function createAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as AttendanceInput;
    const userId = request.auth.credentials;

    try {
        const createdAttendance = await prisma.attendance.create({
            data: {
                status: payload.status,
                lesson_idlesson: payload.lesson_idlesson,
                user_iduser: payload.user_iduser,
                currentDateTime: currentDate,
            },
            select: {
                idattendance: true,
                lesson: true,
                user: true,
            },
        });
        return h.response(createdAttendance).code(201);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to create attendance');
    }
}

export async function getAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = request.auth.credentials;

    try {
        const attendance = await prisma.attendance.findMany({
            include: {
                lesson: true,
                user: true,
            },
        });
        return h.response(attendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to get attendance');
    }
}

export async function updateAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as UpdateAttendanceInput;
    const attendanceId = parseInt(request.params.attendanceId, 10);

    try {
        const updatedAttendance = await prisma.attendance.update({
            where: {
                idattendance: attendanceId,
            },
            data: {
                status: payload.status,
                lesson_idlesson: payload.lesson_idlesson,
                user_iduser: payload.user_iduser,
            },
            select: {
                idattendance: true,
                lesson: true,
                user: true,
            },
        });
        return h.response(updatedAttendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to update attendance');
    }
}

export async function deleteAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const attendanceId = parseInt(request.params.attendanceId, 10);

    try {
        await prisma.attendance.delete({
            where: {
                idattendance: attendanceId,
            },
        });
        return h.response().code(204);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to delete attendance');
    }
}

export async function getUserAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    // const userId = request.auth.credentials;
    const userId = parseInt(request.params.userId, 10);

    try {
        const attendance = await prisma.attendance.findMany({
            where: {
                user_iduser: userId,
            },
            include: {
                lesson: true,
            },
        });
        return h.response(attendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to get attendance');
    }
}

export async function getAttendanceForLessonHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const lessonId = parseInt(request.params.lessonId, 10);

    try {
        const attendance = await prisma.attendance.findMany({
            where: {
                lesson_idlesson: lessonId,
            },
        });
        return h.response(attendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to get attendance');
    }
}

export async function getListOfPeopleForImpersonationDetectionHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const lessonId = parseInt(request.params.lessonId, 10);

    try {
        const attendancePeople = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                attendance: {
                    some: {
                        currentDateTime: currentDate,
                        lesson_idlesson: lessonId,
                    },
                },
            },
            select: {
                iduser: true,
                firstName: true,
                middleName: true,
                lastName: true,
                doubtPoints: true,
            },
        });
        const selectedUsers = selectUsersFromAttendance(attendancePeople);
        return h.response(selectedUsers).code(200);
        // return h.response(attendancePeople).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation(
            'failed to get list of people for impersonation detection'
        );
    }
}

const currentDate: string = new Date().toISOString().slice(0, 10);

function selectUsersFromAttendance(attendancePeople: any[]): any[] {
    // Sort the attendancePeople array based on doubtPoints in descending order
    attendancePeople.sort(
        (a, b) => (b.doubtPoints || 0) - (a.doubtPoints || 0)
    );

    const selectedUsers: any[] = [];
    const totalCount = attendancePeople.length;

    const topCount = Math.min(Math.floor(totalCount * 0.6), 6);
    const middleCount = Math.min(Math.floor(totalCount * 0.2), 2);
    const bottomCount = Math.min(Math.floor(totalCount * 0.2), 2);

    // Select users from the top section
    for (let i = 0; i < topCount; i++) {
        if (attendancePeople.length === 0) {
            break; // Break if all users have been selected
        }
        selectedUsers.push(attendancePeople.shift());
    }

    // Select users from the middle section
    for (let i = 0; i < middleCount; i++) {
        if (attendancePeople.length === 0) {
            break; // Break if all users have been selected
        }
        const middleIndex = Math.floor(attendancePeople.length / 2);
        selectedUsers.push(attendancePeople.splice(middleIndex, 1)[0]);
    }

    // Select users from the bottom section
    for (let i = 0; i < bottomCount; i++) {
        if (attendancePeople.length === 0) {
            break; // Break if all users have been selected
        }
        selectedUsers.push(attendancePeople.pop());
    }

    return selectedUsers;
}
