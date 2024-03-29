import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { LessonInput, LessonUpdateInput } from './interface';

export async function createLessonHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as LessonInput;

    try {
        const createdLesson = await prisma.lesson.create({
            data: {
                startTime: payload.startTime,
                endTime: payload.endTime,
                day: payload.day,
                lectureroom: {
                    connect: {
                        idlectureRoom: payload.idlectureRoom,
                    },
                },
            },
            select: {
                idlesson: true,
                lectureroom: true,
            },
        });
        return h.response(createdLesson).code(201);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to create lesson');
    }
}

export async function getLessonsHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = request.auth.credentials;

    try {
        const lessons = await prisma.lesson.findMany({
            include: {
                lectureroom: true,
            },
        });
        return h.response(lessons).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get lessons');
    }
}

export async function updateLessonsHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as LessonUpdateInput;
    const lessonId = parseInt(request.params.lessonId, 10);

    try {
        const updatedLesson = await prisma.lesson.update({
            where: {
                idlesson: lessonId,
            },
            data: { ...payload },
            include: {
                lectureroom: true,
            },
        });
        return h.response(updatedLesson).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to update lesson');
    }
}

export async function deleteLessonsHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const lessonId = parseInt(request.params.lessonId, 10);

    try {
        const deletedLesson = await prisma.lesson.delete({
            where: {
                idlesson: lessonId,
            },
        });
        return h.response().code(204);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to delete lesson');
    }
}

export async function getIndividualLessonsHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const lessonId = parseInt(request.params.lessonId, 10);

    try {
        const lessons = await prisma.lesson.findUnique({
            where: {
                idlesson: lessonId,
            },
            include: {
                lectureroom: true,
            },
        });
        if (!lessons) {
            return h.response().code(404);
        } else {
            return h.response(lessons).code(200);
        }
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get lesson');
    }
}

export async function getLessonsForCourseHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const courseId = parseInt(request.params.courseId, 10);

    try {
        const lessons = await prisma.lesson.findMany({
            where: {
                course_has_lesson: {
                    some: {
                        course_idcourse: courseId,
                    },
                },
            },
            include: {
                lectureroom: true,
            },
        });
        if (!lessons) {
            return h.response().code(404);
        } else {
            return h.response(lessons).code(200);
        }
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get lesson');
    }
}

export async function connectLessonToCourse(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const courseId = parseInt(request.params.courseId, 10);
    const lessonId = parseInt(request.params.lessonId, 10);

    try {
        await prisma.course_has_lesson.create({
            data: {
                course_idcourse: courseId,
                lesson_idlesson: lessonId,
            },
        });
        return h.response({ message: 'Lesson added successfully' }).code(200);
    } catch (err) {
        return Boom.badImplementation('Failed to add lesson for course');
    }
}

export async function createLessonAndConnectToCourse(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as LessonInput;
    const courseId = parseInt(request.params.courseId, 10);
    let createdLesson;

    try {
        createdLesson = await prisma.lesson.create({
            data: {
                startTime: payload.startTime,
                endTime: payload.endTime,
                day: payload.day,
                lectureroom: {
                    connect: {
                        idlectureRoom: payload.idlectureRoom,
                    },
                },
            },
            select: {
                idlesson: true,
                lectureroom: true,
            },
        });

        await prisma.course_has_lesson.create({
            data: {
                course_idcourse: courseId,
                lesson_idlesson: createdLesson.idlesson,
            },
        });

        return h.response({ message: 'Lesson added successfully' }).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation(
            'Failed to create lesson or connect to the course'
        );
    }
}

export async function deleteLessonForCourse(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const courseId = parseInt(request.params.courseId, 10);
    const lessonId = parseInt(request.params.lessonId, 10);

    try {
        await prisma.course_has_lesson.delete({
            where: {
                course_idcourse_lesson_idlesson: {
                    course_idcourse: courseId,
                    lesson_idlesson: lessonId,
                },
            },
        });
        return h.response({ message: 'Lesson deleted successfully' }).code(200);
    } catch (err: any) {
        //error that comes when the field doesn't exist
        if (err.code === 'P2025') {
            return h
                .response({
                    message: 'This lesson does not exist for this course',
                })
                .code(404);
        }
        return Boom.badImplementation('Failed to delete lesson for course');
    }
}
