import Hapi from '@hapi/hapi';
import { server } from '../../configs/server';
import { UserInput } from './props';
import Boom from '@hapi/boom'


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


export async function getUserHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const userId = parseInt(request.params.userId, 10)
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          iduser: userId,
        },
      })
      if (!user) {
        return h.response().code(404)
      } else {
        return h.response(user).code(200)
      }
    } catch (err) {
      console.log(err)
      return Boom.badImplementation()
    }
  }
