import Hapi from '@hapi/hapi';
import { server } from '../../configs/server';
import { UserInput } from './props';

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
                role: payload.role
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
