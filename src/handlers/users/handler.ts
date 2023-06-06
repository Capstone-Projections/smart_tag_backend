import Hapi from '@hapi/hapi';
import { UpdateUserInput, UserInput } from './interface';
import Boom from '@hapi/boom';

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
        console.log(err);
        return Boom.badImplementation();
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
        return h.response().code(500);
    }
}
