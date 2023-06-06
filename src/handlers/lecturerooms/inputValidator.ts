import Joi from 'joi';

export const lectureroomInputValidator = Joi.object({
    name: Joi.string().required(),
    roomLocation: Joi.string().required(),
    uid: Joi.string().required(),
});

export const updateLectureroomValidator = Joi.object({
    name: Joi.string().optional(),
    roomLocation: Joi.string().optional(),
    uid: Joi.string().optional(),
});
