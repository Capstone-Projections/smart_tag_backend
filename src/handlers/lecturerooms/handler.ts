import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { LectureroomInput, UpdateLecturoomInput } from './interface';

export async function createLectureroomHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as LectureroomInput;
    const userId = request.auth.credentials;

    try {
        const createdLectureroom = await prisma.lectureroom.create({
            data: {
                name: payload.name,
                roomLocation: payload.roomLocation,
                uid: payload.uid,
            },
            select: {
                idlectureRoom: true,
            },
        });
        return h.response(createdLectureroom).code(201);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to create lectureroom');
    }
}

export async function getLectureroomHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;

    try {
        const lectureroom = await prisma.lectureroom.findMany();
        return h.response(lectureroom).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to get lectureroom');
    }
}

export async function updateLectureroomHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as UpdateLecturoomInput;
    const lectureroomId = parseInt(request.params.lectureroomId, 10);

    try {
        const updatedLectureroom = await prisma.lectureroom.update({
            where: {
                idlectureRoom: lectureroomId,
            },
            data: payload,
        });
        return h.response(updatedLectureroom).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to update lectureroom');
    }
}

export async function deleteLectureroomHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const lectureroomId = parseInt(request.params.lectureroomId, 10);

    try {
        await prisma.lectureroom.delete({
            where: {
                idlectureRoom: lectureroomId,
            },
        });
        return h.response().code(204);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to delete lectureroom');
    }
}
