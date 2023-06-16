import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { loginHandler } from '../handlers/login/handler';
import {
    API_AUTH_STRATEGY,
    JWT_ALGORITHM,
    JWT_SECRET,
    authenticateHandler,
    validateAPIToken,
} from '../handlers/authentication/handler';

const authPlugin: Hapi.Plugin<null> = {
    name: 'app/auth',
    dependencies: ['prisma', 'hapi-auth-jwt2', 'app/email'],
    register: async function (server: Hapi.Server) {
        server.auth.strategy(API_AUTH_STRATEGY, 'jwt', {
            key: JWT_SECRET,
            verifyOptions: { algorithms: [JWT_ALGORITHM] },
            validate: validateAPIToken,
        });

        server.auth.default(API_AUTH_STRATEGY);

        server.route([
            // Endpoint to login or register and to send the short-lived token
            {
                method: 'POST',
                path: '/login',
                handler: loginHandler,
                options: {
                    auth: false,
                    validate: {
                        payload: Joi.object({
                            email: Joi.string().email().required(),
                        }),
                    },
                },
            },
            {
                method: 'POST',
                path: '/authenticate',
                handler: authenticateHandler,
                options: {
                    auth: false,
                    validate: {
                        payload: Joi.object({
                            email: Joi.string().email().required(),
                            emailToken: Joi.string().required(),
                        }),
                    },
                },
            },
        ]);
    },
};

export default authPlugin;
