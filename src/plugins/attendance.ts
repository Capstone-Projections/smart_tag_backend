import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { API_AUTH_STRATEGY } from '../handlers/authentication/handler';
import { isAdmin } from '../utils/auth-helpers';
import {
    createAttendanceHandler,
    deleteAttendanceHandler,
    getAttendanceHandler,
    updateAttendanceHandler,
} from '../handlers/attendances/handler';
import {
    attendanceInputValidator,
    updateAttendanceValidator,
} from '../handlers/attendances/inputValidator';

const attedancePlugin = {
    name: 'app/attendance',
    depedencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/attendance',
                handler: createAttendanceHandler,
                options: {
                    validate: {
                        payload: attendanceInputValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user
                            throw err;
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/attendance',
                handler: getAttendanceHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                },
            },
            {
                method: 'PUT',
                path: '/attendance/{attendanceId}',
                handler: updateAttendanceHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            attendanceId: Joi.number().required(),
                        }),
                        payload: updateAttendanceValidator,
                    },
                },
            },
            {
                method: 'DELETE',
                path: '/attendance/{attendanceId}',
                handler: deleteAttendanceHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            attendanceId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user
                            throw err;
                        },
                    },
                },
            },
        ]);
    },
};

export default attedancePlugin;
