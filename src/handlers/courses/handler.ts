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

    const courseCodeExists = await prisma.course.findFirst({
        where: {
            courseCode: payload.courseCode,
        },
    });

    const courseNameExists = await prisma.course.findFirst({
        where: {
            name: payload.name,
        },
    });

    if (courseCodeExists || courseNameExists) {
        return Boom.badRequest('Course already exists');
    }

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
        return Boom.badImplementation('Failed to create course');
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
            select: {
                name: true,
                courseCode: false,
                user_has_course: false,
            },
        });
        return h.response(courses).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get courses');
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
        return Boom.badImplementation('Failed to update course');
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
        return Boom.badImplementation('Failed to delete course');
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
        return Boom.badImplementation('Failed to create course');
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
        return Boom.badImplementation('Failed to get courses');
    }
}

export async function getUsersForCourseHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const courseId = parseInt(request.params.courseId, 10);

    try {
        const users = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                user_has_course: {
                    some: {
                        course: {
                            idcourse: courseId,
                        },
                    },
                },
            },
            select: {
                iduser: true,
                firstName: true,
                lastName: true,
            },
        });
        return h.response(users).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get users');
    }
}

export async function deleteCourseForUserHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const courseId = parseInt(request.params.courseId, 10);
    const userId = parseInt(request.params.userId, 10);

    try {
        await prisma.user_has_course.delete({
            where: {
                user_iduser_course_idcourse: {
                    user_iduser: userId,
                    course_idcourse: courseId,
                },
            },
        });

        // If needed, you can send a response indicating the deletion was successful.
        return h
            .response({ message: 'User course deleted successfully' })
            .code(200);
    } catch (err) {
        // Handle any potential errors, e.g., send an error response.
        return Boom.badImplementation('Failed to delete user course');
    }
}

export async function connectUserToCourse(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const courseId = parseInt(request.params.courseId, 10);
    const userId = parseInt(request.params.userId, 10);

    try {
        await prisma.user_has_course.create({
            data: {
                course_idcourse: courseId,
                user_iduser: userId,
            },
        });

        // If needed, you can send a response indicating the deletion was successful.
        return h.response({ message: 'Course added successfully' }).code(200);
    } catch (err) {
        // Handle any potential errors, e.g., send an error response.
        return Boom.badImplementation('Failed to add course for user');
    }
}
