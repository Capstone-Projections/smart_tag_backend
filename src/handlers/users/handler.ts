import Hapi from '@hapi/hapi';
import { UpdateUserInput, UserInput } from './interface';
import Boom from '@hapi/boom';
import { currentDate } from '../attendances/attendance.helpers';

export async function createUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as UserInput;

    try {
        const createdUser = await prisma.user.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                role: payload.role,
            },
            select: {
                iduser: true,
            },
        });
        return h.response(createdUser).code(201);
    } catch (err) {
        console.log(err);
    }
}

export async function getUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = parseInt(request.params.userId, 10);

    try {
        const user = await prisma.user.findUnique({
            where: {
                iduser: userId,
            },
        });
        if (!user) {
            return h.response().code(404);
        } else {
            return h.response(user).code(200);
        }
    } catch (err) {
        // console.log(err);
        return Boom.badImplementation('User Not Available');
    }
}

export async function deleteUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = parseInt(request.params.userId, 10);

    try {
        await prisma.user.delete({
            where: {
                iduser: userId,
            },
        });
        return h.response().code(204);
    } catch (err) {
        console.log(err);
        return h.response().code(500);
    }
}

export async function updateUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = parseInt(request.params.userId, 10);
    const payload = request.payload as UpdateUserInput;

    try {
        const updatedUser = await prisma.user.update({
            where: {
                iduser: userId,
            },
            data: payload,
        });
        return h.response(updatedUser).code(200);
    } catch (err) {
        console.log(err);
        return Boom.badImplementation('Profile Set Up Failed');
    }
}

export async function updateUserdoubtPointsHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = parseInt(request.params.userId, 10);
    const status = Boolean(request.params.status);
    const payload = request.payload as UpdateUserInput;
    let doubtPoints = payload.doubtPoints ?? 0;

    if (status === false) {
        doubtPoints = doubtPoints + 1;
    } else {
        doubtPoints;
    }
    try {
        const updatedUser = await prisma.user.update({
            where: {
                iduser: userId,
            },
            data: {
                doubtPoints: doubtPoints,
            },
            select: {
                iduser: true,
                email: true,
                firstName: true,
                lastName: true,
                indexNumber: true,
                doubtPoints: true,
            },
        });
        return h.response(updatedUser).code(200);
    } catch (err) {
        console.log(err);
        return Boom.badImplementation('Failed to update Doubt Points');
    }
}
