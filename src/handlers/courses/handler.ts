import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { CourseInput, UpdateCourseInput } from './interface';

export async function createCourseHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as CourseInput;
    const userId = request.auth.credentials;

    try {
        const createdCourse = await prisma.course.create({
            data: {
                name: payload.name,
                courseCode: payload.courseCode,
            },
            select: {
                idcourse: true,
            },
        });
        return h.response(createdCourse).code(201);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to create course');
    }
}

export async function getCoursesHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = request.auth.credentials;

    try {
        const courses = await prisma.course.findMany({
            include: {
                user_has_course: true,
            },
        });
        return h.response(courses).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to get courses');
    }
}

export async function updateCourseHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as UpdateCourseInput;
    const courseId = parseInt(request.params.courseId, 10);

    try {
        const updatedCourse = await prisma.course.update({
            where: {
                idcourse: courseId,
            },
            data: payload,
        });
        return h.response(updatedCourse).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to update course');
    }
}

export async function deleteCourseHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const courseId = parseInt(request.params.courseId, 10);

    try {
        await prisma.course.delete({
            where: {
                idcourse: courseId,
            },
        });
        return h.response().code(204);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to delete course');
    }
}

export async function createCourseForUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as CourseInput;
    const userId = parseInt(request.params.userId, 10);

    try {
        const createdCourse = await prisma.course.create({
            data: {
                name: payload.name,
                courseCode: payload.courseCode,
                user_has_course: {
                    create: {
                        user: {
                            connect: {
                                iduser: userId,
                            },
                        },
                    },
                },
            },
            select: {
                idcourse: true,
                user_has_course: true,
            },
        });
        return h.response(createdCourse).code(201);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to create course');
    }
}

export async function getCoursesForUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = parseInt(request.params.userId, 10);

    try {
        const courses = await prisma.course.findMany({
            where: {
                user_has_course: {
                    some: {
                        user: {
                            iduser: userId,
                        },
                    },
                },
            },
        });
        return h.response(courses).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('failed to get courses');
    }
}
