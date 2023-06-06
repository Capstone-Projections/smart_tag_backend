import Joi from 'joi';

const courseInputValidator = Joi.object({
    name: Joi.string().alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
    }),
    courseCode: Joi.string().alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
    }),
});

export const createCourseValidator = courseInputValidator.tailor('create');
export const updateCourseValidator = courseInputValidator.tailor('update');
