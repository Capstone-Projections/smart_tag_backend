import Hapi from '@hapi/hapi';
import Joi from 'joi';
import {
    createCourseForUserHandler,
    createCourseHandler,
    deleteCourseHandler,
    getCoursesForUserHandler,
    getCoursesHandler,
    updateCourseHandler,
} from '../handlers/courses/handler';
import {
    createCourseValidator,
    updateCourseValidator,
} from '../handlers/courses/inputValidator';
import { API_AUTH_STRATEGY } from '../handlers/authentication/handler';
import { isAdmin } from '../utils/auth-helpers';

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
        ]);
    },
};
export default coursesPlugin;
