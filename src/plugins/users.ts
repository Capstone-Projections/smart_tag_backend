import {
    createUserHandler,
    getUserHandler,
    deleteUserHandler,
    updateUserHandler,
    updateUserdoubtPointsHandler,
} from '../handlers/users/handler';
import {
    createUserValidator,
    updateUserValidator,
} from '../handlers/users/inputValidator';
import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { isAdmin } from '../handlers/authentication/auth-helpers';
import { API_AUTH_STRATEGY } from '../handlers/authentication/handler';

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
            {
                method: 'PUT',
                path: '/users/doubtPoints/{userId}/{status}',
                handler: updateUserdoubtPointsHandler,
                options: {
                    // pre: [isAdmin],
                    // auth: {
                    //     mode: 'required',
                    //     strategy: API_AUTH_STRATEGY,
                    // },
                    auth: false,
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                            status: Joi.boolean(),
                        }),
                        payload: updateUserValidator,
                    },
                },
            },
        ]);
    },
};
export default userPlugin;
