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
            include: {
                user: {
                    select: {
                        iduser: true,
                    },
                },
            },
        });
        return h.response(attendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to get attendance');
    }
}
