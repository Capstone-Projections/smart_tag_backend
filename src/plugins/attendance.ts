import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { API_AUTH_STRATEGY } from '../handlers/authentication/handler';
import { isAdmin } from '../handlers/authentication/auth-helpers';
import {
    createAttendanceHandler,
    deleteAttendanceHandler,
    getAttendanceDataAsJsonForAnalyticsHandler,
    getAttendanceForLessonHandler,
    getAttendanceHandler,
    getListOfPeopleForImpersonationDetectionHandler,
    getUserAttendanceHandler,
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
                    auth: {
                        // mode: 'optional'
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
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
            //get attendance data based on the user id
            {
                method: 'GET',
                path: '/attendance/user/{userId}',
                handler: getUserAttendanceHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user
                            throw err;
                        },
                    },
                },
            },
            //get attendance per lesson id
            {
                method: 'GET',
                path: '/attendance/lesson/{lessonId}/{courseId}',
                // path: '/attendance/lesson/{courseId}',
                // path: '/attendance/lesson/{lessonId}',
                handler: getAttendanceForLessonHandler,
                options: {
                    // pre: [isAdmin],
                    // auth: {
                    //     mode: 'required',
                    //     strategy: API_AUTH_STRATEGY,
                    // },
                    auth: { mode: 'optional' },
                    validate: {
                        params: Joi.object({
                            lessonId: Joi.number().integer(),
                            courseId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user
                            throw err;
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/attendance/lessons/users/{lessonId}/{courseId}',
                handler: getListOfPeopleForImpersonationDetectionHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    // auth: {mode: "optional"},
                    validate: {
                        params: Joi.object({
                            lessonId: Joi.number().integer(),
                            courseId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user
                            throw err;
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/analytics/{lessonId}/{courseId}',
                handler: getAttendanceDataAsJsonForAnalyticsHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    // auth: {mode: "optional"},
                    validate: {
                        params: Joi.object({
                            lessonId: Joi.number().integer(),
                            courseId: Joi.number().integer(),
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
