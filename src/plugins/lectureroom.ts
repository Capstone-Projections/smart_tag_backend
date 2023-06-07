import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { API_AUTH_STRATEGY } from '../handlers/authentication/handler';
import { isAdmin } from '../utils/auth-helpers';
import {
    lectureroomInputValidator,
    updateLectureroomValidator,
} from '../handlers/lecturerooms/inputValidator';
import {
    createLectureroomHandler,
    deleteLectureroomHandler,
    getIndividualLectureroomHandler,
    getLectureroomHandler,
    updateLectureroomHandler,
} from '../handlers/lecturerooms/handler';

const lectureroomPlugin = {
    name: 'app/lectureroom',
    depedencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/lectureroom',
                handler: createLectureroomHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        payload: lectureroomInputValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user
                            throw err;
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/lectureroom',
                handler: getLectureroomHandler,
            },
            {
                method: 'PUT',
                path: '/lectureroom/{lectureroomId}',
                handler: updateLectureroomHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            lectureroomId: Joi.number().required(),
                        }),
                        payload: updateLectureroomValidator,
                    },
                },
            },
            {
                method: 'DELETE',
                path: '/lectureroom/{lectureroomId}',
                handler: deleteLectureroomHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            lectureroomId: Joi.number().required(),
                        }),
                        failAction: (request, h, err) => {
                            throw err;
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/lectureroom/{lectureroomId}',
                handler: getIndividualLectureroomHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            lectureroomId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            throw err;
                        },
                    },
                },
            },
        ]);
    },
};
export default lectureroomPlugin;
