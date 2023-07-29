import Joi from 'joi';

export const attendanceInputValidator = Joi.object({
    status: Joi.boolean().required(),
    lesson_idlesson: Joi.number().required(),
    user_iduser: Joi.number().required(),
});

export const updateAttendanceValidator = Joi.object({
    status: Joi.boolean().optional(),
    lesson_idlesson: Joi.number().optional(),
    user_iduser: Joi.number().optional(),
});

export const lecturerAttendanceInputValidator = Joi.object({
    status: Joi.boolean().required(),
    lesson_idlesson: Joi.number().required(),
    indexNumber: Joi.number().required(),
});
