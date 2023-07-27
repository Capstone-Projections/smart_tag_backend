import Hapi from '@hapi/hapi';
import Joi from 'joi';
import {
    connectUserToCourse,
    connectUserToCourseBasedOnIndexNumber,
    createCourseForUserHandler,
    createCourseHandler,
    deleteCourseForUserHandler,
    deleteCourseHandler,
    getCoursesForUserHandler,
    getCoursesHandler,
    getUsersForCourseHandler,
    updateCourseHandler,
} from '../handlers/courses/handler';
import {
    createCourseValidator,
    updateCourseValidator,
} from '../handlers/courses/inputValidator';
import { API_AUTH_STRATEGY } from '../handlers/authentication/handler';
import { isAdmin } from '../handlers/authentication/auth-helpers';

const coursesPlugin = {
    name: 'app/course',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        server.route([
            {
                method: 'POST',
                path: '/courses',
                handler: createCourseHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        payload: createCourseValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err;
                        },
                    },
                },
            },
            {
                method: 'GET',
                path: '/courses',
                handler: getCoursesHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                        // mode: 'optional'
                    },
                },
            },
            {
                method: 'PUT',
                path: '/courses/{courseId}',
                handler: updateCourseHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            courseId: Joi.number().integer(),
                        }),
                        payload: updateCourseValidator,
                    },
                },
            },
            {
                method: 'DELETE',
                path: '/courses/{courseId}',
                handler: deleteCourseHandler,
                options: {
                    pre: [isAdmin],
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            courseId: Joi.number().integer(),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err;
                        },
                    },
                },
            },
            //create course for a particular userid(lecturer)
            {
                method: 'POST',
                path: '/courses/{userId}',
                handler: createCourseForUserHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                    },
                },
            },
            {
                method: 'GET',
                path: '/courses/{userId}',
                handler: getCoursesForUserHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            userId: Joi.number().integer(),
                        }),
                    },
                },
            },
            {
                method: 'GET',
                path: '/courses/users/{courseId}',
                handler: getUsersForCourseHandler,
                options: {
                    auth: {
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                        // mode: 'optional'
                    },
                    validate: {
                        params: Joi.object({
                            courseId: Joi.number().integer(),
                        }),
                    },
                },
            },
            {
                method: 'DELETE',
                path: '/courses/{courseId}/{userId}',
                handler: deleteCourseForUserHandler,
                options: {
                    auth: {
                        // mode: 'optional',
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            courseId: Joi.number().integer(),
                            userId: Joi.number().integer(),
                        }),
                    },
                },
            },
            {
                method: 'GET',
                path: '/courses/user/{courseId}/{userId}',
                handler: connectUserToCourse,
                options: {
                    auth: {
                        // mode: 'optional',
                        mode: 'required',
                        strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            courseId: Joi.number().integer(),
                            userId: Joi.number().integer(),
                        }),
                    },
                },
            },
            {
                method: 'POST',
                path: '/courses/user/{courseId}',
                // path: '/courses/user',
                handler: connectUserToCourseBasedOnIndexNumber,
                options: {
                    // pre:[isAdmin],
                    auth: {
                        mode: 'optional',
                        // mode: 'required',
                        // strategy: API_AUTH_STRATEGY,
                    },
                    validate: {
                        params: Joi.object({
                            courseId: Joi.number().integer(),
                        }),
                        payload: Joi.object({
                            'Index Numbers': Joi.array().items(
                                Joi.number().integer()
                            ),
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
export default coursesPlugin;
