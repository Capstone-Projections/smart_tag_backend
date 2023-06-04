import Joi from 'joi';

export const studentInputValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    middleName: Joi.string().optional(),
    password: Joi.string().optional(),
    referenceNumber: Joi.string().optional(),
    indexNumber: Joi.number().optional(),
    studyProgram: Joi.string().optional(),
    doubtPoints: Joi.number().optional(),
});
