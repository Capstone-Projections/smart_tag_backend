import Joi from '@hapi/joi';

export const apiTokenSchema = Joi.object({
    tokenId: Joi.number().integer().required(),
});
