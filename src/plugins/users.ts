import {
    createUserHandler,
    getUserHandler,
    deleteUserHandler,
    updateUserHandler,
} from '../handlers/users/handler';
import {
    createUserValidator,
    updateUserValidator,
} from '../handlers/users/inputValidator';
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
                        payload: createUserValidator,
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
            },
            {
                method: 'DELETE',
                path: '/users/{userId}',
                handler: deleteUserHandler,
                options: {
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                    },
                },
            },
            {
                method: 'PUT',
                path: '/users/{userId}',
                handler: updateUserHandler,
                options: {
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                        payload: updateUserValidator,
                    },
                },
            },
        ]);
    },
};
export default userPlugin;
