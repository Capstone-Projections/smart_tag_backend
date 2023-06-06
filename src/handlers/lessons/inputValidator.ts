import Joi from 'joi';

export const lessonInputValidator = Joi.object({
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    day: Joi.string().required(),
    idlectureRoom: Joi.number().required(),
});

export const updateLessonValidator = Joi.object({
    startTime: Joi.string().optional(),
    endTime: Joi.string().optional(),
    day: Joi.string().optional(),
    idlectureRoom: Joi.number().optional(),
});
