import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { API_AUTH_STRATEGY } from '../handlers/authentication/handler';
import { isAdmin } from '../handlers/authentication/auth-helpers';
import path from 'path';
import {
    createLessonHandler,
    deleteLessonsHandler,
    getIndividualLessonsHandler,
    getLessonsForCourseHandler,
    getLessonsHandler,
    updateLessonsHandler,
} from '../handlers/lessons/handler';
import {
    lessonInputValidator,
    updateLessonValidator,
} from '../handlers/lessons/inputValidator';

const lessonsPlugin = {
    name: 'app/lessons',
    depedencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/lessons',
                handler: createLessonHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        payload: lessonInputValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user
                            throw err;
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/lessons',
                handler: getLessonsHandler,
            },
            {
                method: 'PUT',
                path: '/lessons/{lessonId}',
                handler: updateLessonsHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            lessonId: Joi.number().integer(),
                        }),
                        payload: updateLessonValidator,
                    },
                },
            },
            {
                method: 'DELETE',
                path: '/lessons/{lessonId}',
                handler: deleteLessonsHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            lessonId: Joi.number().integer(),
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
                path: '/lessons/{lessonId}',
                handler: getIndividualLessonsHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            lessonId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            throw err;
                        },
                    },
                },
            },
            //get lessons per course id
            {
                method: 'GET',
                path: '/lessons/course/{courseId}',
                handler: getLessonsForCourseHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            courseId: Joi.number().integer(),
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

export default lessonsPlugin;
