import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Analytics, AttendanceInput, UpdateAttendanceInput } from './interface';
import { currentDate, selectUsersFromAttendance } from './attendance.helpers';
import { UpdateUserInput } from '../users/interface';
import { extractMetadata, jsonToCsv } from '../../utils/jsonToCsv';
import { google } from 'googleapis';
import * as fs from 'fs';
import path from 'path';
import { uploadToGoogleDrive } from '../../utils/uploadToGoogleDrive';
import { getAbsentStudents } from '../../utils/getAbsentPeopleList';
import { getDayOfWeek } from '../../utils/dayOfWeek';
// import { uploadToGoogleDrive } from '../../utils/uploadToGoogleDrive';

export async function createAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as AttendanceInput;
    const userId = request.auth.credentials;

    try {
        const createdAttendance = await prisma.attendance.create({
            data: {
                status: payload.status,
                lesson_idlesson: payload.lesson_idlesson,
                user_iduser: payload.user_iduser,
                currentDateTime: currentDate,
            },
            select: {
                idattendance: true,
                lesson: true,
                user: true,
                status: true,
            },
        });
        return h.response(createdAttendance).code(201);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to create attendance');
    }
}

export async function getAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const userId = request.auth.credentials;

    try {
        const attendance = await prisma.attendance.findMany({
            include: {
                lesson: true,
                user: true,
            },
        });
        return h.response(attendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get attendance');
    }
}

export async function updateAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const payload = request.payload as UpdateAttendanceInput;
    const attendanceId = parseInt(request.params.attendanceId, 10);

    try {
        const updatedAttendance = await prisma.attendance.update({
            where: {
                idattendance: attendanceId,
            },
            data: {
                status: payload.status,
                lesson_idlesson: payload.lesson_idlesson,
                user_iduser: payload.user_iduser,
            },
            select: {
                idattendance: true,
                lesson: true,
                user: true,
            },
        });
        return h.response(updatedAttendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to update attendance');
    }
}

export async function deleteAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const attendanceId = parseInt(request.params.attendanceId, 10);

    try {
        await prisma.attendance.delete({
            where: {
                idattendance: attendanceId,
            },
        });
        return h.response().code(204);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to delete attendance');
    }
}

export async function getUserAttendanceHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    // const userId = request.auth.credentials;
    const userId = parseInt(request.params.userId, 10);

    try {
        const attendance = await prisma.attendance.findMany({
            where: {
                user_iduser: userId,
            },
            include: {
                lesson: true,
            },
        });
        return h.response(attendance).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get attendance');
    }
}

export async function getAttendanceForLessonHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    // const lessonId = parseInt(request.params.lessonId, 10);
    const status = true;
    const courseId = parseInt(request.params.courseId, 10);
    const payload = request.payload as Analytics;
    const dayOfWeek = getDayOfWeek(payload.currentDateTime);
    // return dayOfWeek;

    try {
        const lesson = await prisma.lesson.findFirstOrThrow({
            where: {
                day: dayOfWeek,
                course_has_lesson: {
                    some: {
                        course_idcourse: courseId,
                    },
                },
            },
            select: {
                idlesson: true,
            },
        });

        const students = await prisma.user.findMany({
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
                indexNumber: true,
            },
        });

        const attendance = await prisma.attendance.findMany({
            where: {
                currentDateTime: payload.currentDateTime,
                lesson_idlesson: lesson.idlesson,
                status: status,
            },
            include: {
                user: {
                    select: {
                        indexNumber: true,
                    },
                },
                lesson: {
                    select: {
                        course_has_lesson: {
                            select: {
                                course: {
                                    select: {
                                        courseCode: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const absentStudents = getAbsentStudents(students, attendance);
        if (attendance.length === 0) {
            // No data found, return an appropriate response
            return h.response('No attendance data found').code(404);
        }

        const { currentDateTime, courseCode } = extractMetadata(attendance);

        const csvFilePath = await jsonToCsv(
            attendance,
            absentStudents,
            currentDateTime,
            courseCode,
            'Attendance Data'
        );
        console.log(csvFilePath);
        const webContentLink = await uploadToGoogleDrive(csvFilePath);

        // console.log('CSV file uploaded to Google Drive:', webContentLink);
        // Return the link of the uploaded file in the response
        return h.response({ Link: webContentLink }).code(200);

        // return h.response(attendance).code(200);
        // return h.response(students).code(200);
        // return h.response(absentStudents).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation('Failed to get attendance');
    }
}

//TODO:this route is doing too many joins so how do we fix it
export async function getListOfPeopleForImpersonationDetectionHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const lessonId = parseInt(request.params.lessonId, 10);
    const courseId = parseInt(request.params.courseId, 10);

    try {
        const attendancePeople = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                attendance: {
                    some: {
                        currentDateTime: currentDate,
                        lesson_idlesson: lessonId,
                    },
                },
                user_has_course: {
                    some: {
                        course_idcourse: courseId,
                    },
                },
            },
            select: {
                iduser: true,
                firstName: true,
                middleName: true,
                lastName: true,
                doubtPoints: true,
                attendance: {
                    where: {
                        currentDateTime: currentDate,
                        lesson_idlesson: lessonId,
                    },
                    select: {
                        idattendance: true,
                    },
                },
            },
        });
        const selectedUsers = selectUsersFromAttendance(attendancePeople);

        return h.response(selectedUsers).code(200);
        // return h.response(attendancePeople).code(200);
    } catch (err: any) {
        request.log('error', err);
        return Boom.badImplementation(
            'Failed to get list of people for impersonation detection'
        );
    }
}

export async function getAttendanceDataAsJsonForAnalyticsHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    const { prisma } = request.server.app;
    const status = true;
    const courseId = parseInt(request.params.courseId, 10);
    const payload = request.payload as Analytics;
    const dayOfWeek = getDayOfWeek(payload.currentDateTime);
    // return dayOfWeek;

    try {
        const lesson = await prisma.lesson.findFirstOrThrow({
            where: {
                day: dayOfWeek,
                course_has_lesson: {
                    some: {
                        course_idcourse: courseId,
                    },
                },
            },
            select: {
                idlesson: true,
            },
        });

        const students = await prisma.user.findMany({
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
                indexNumber: true,
            },
        });

        if (!students) {
            // Handle the case when students array is null
            return h.response('No students found').code(404);
        }

        const attendance = await prisma.attendance.findMany({
            where: {
                currentDateTime: payload.currentDateTime,
                lesson_idlesson: lesson.idlesson,
                status: status,
            },
            include: {
                user: {
                    select: {
                        indexNumber: true,
                    },
                },
            },
        });
        const absentStudents = getAbsentStudents(students, attendance);
        if (attendance.length === 0) {
            // No data found, return an appropriate response
            return h.response('No attendance data found').code(404);
        }

        // Create the result object
        const result = {
            Absent: absentStudents.length,
            Present: attendance.length,
        };

        return h.response(result).code(200);
    } catch (err: any) {
        // request.log('error', err);
        return Boom.badImplementation('Failed to get attendance');
    }
}
