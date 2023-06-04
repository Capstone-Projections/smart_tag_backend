import { createUserHandler,getUserHandler } from '../handlers/users/handler';
import { userInputValidator } from '../handlers/users/inputValidator';
import Hapi from '@hapi/hapi';
import Joi from 'joi';

// plugin to instantiate Prisma Client
const userPlugin = {
    name: 'app/user',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        // here you can use server.app.prisma
        server.route([
            {
                method: 'POST',
                path: '/users',
                handler: createUserHandler,
                options: {
                    validate: {
                        payload: userInputValidator,
                    },
                },
            },
            {
                method: 'GET',
                path: '/users/{userId}',
                handler: getUserHandler,
                options: {
                  validate: {
                    params: Joi.object({
                      userId: Joi.number().integer(),
                    }),
                  },
                },
            }
        ]);
    },
};
export default userPlugin;
