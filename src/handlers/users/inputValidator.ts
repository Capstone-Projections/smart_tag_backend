import Joi from 'joi';

const userInputValidator = Joi.object({
    firstName: Joi.string().alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
    }),
    lastName: Joi.string().alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
    }),
    email: Joi.string()
        .email()
        .alter({
            create: (schema) => schema.required(),
            update: (schema) => schema.optional(),
        }),
    middleName: Joi.string().optional(),
    password: Joi.string().optional(),
    referenceNumber: Joi.string().optional(),
    indexNumber: Joi.number().optional(),
    studyProgram: Joi.string().optional(),
    department: Joi.string().optional(),
    doubtPoints: Joi.number().optional(),
    role: Joi.string().alter({
        create: (schema) => schema.required(),
        update: (schema) => schema.optional(),
    }),
    isAdmin: Joi.boolean().optional(),
});

export const createUserValidator = userInputValidator.tailor('create');
export const updateUserValidator = userInputValidator.tailor('update');
