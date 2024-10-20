import Joi, { ValidationResult } from 'joi';
import { escape } from 'lodash';

import { HTTP_400_BAD_REQUEST } from '../constants/httpCode.constant';
import { FailedResponseContent, GetRequestArgs } from '../types/api.type';

export const processValidationError = (error: Exclude<ValidationResult['error'], undefined>) => {
  const content: FailedResponseContent = {
    reason: error.details.map((detail) => ({
      path: detail.path.join('.'),
      message: detail.message,
    })),
    code: HTTP_400_BAD_REQUEST,
    error: true,
  };
  return content;
};

export const escapeHTML = (str: string): string => escape(str);

export const primitiveSchema = [Joi.string(), Joi.number(), Joi.boolean()];

export const normalOperatorsSchema = {
  like: Joi.string(),
  eq: primitiveSchema,
  ne: primitiveSchema,
  exists: Joi.boolean(),
  gt: [Joi.string(), Joi.number()],
  gte: [Joi.string(), Joi.number()],
  lt: [Joi.string(), Joi.number()],
  lte: [Joi.string(), Joi.number()],
  size: [
    Joi.number(),
    Joi.object({
      ne: Joi.number(),
      gte: Joi.number(),
      gt: Joi.number(),
      lte: Joi.number(),
      lt: Joi.number(),
    }).or('ne', 'gte', 'gt', 'lte', 'lt'),
  ],
  all: Joi.array().items(...primitiveSchema),
  in: Joi.array().items(...primitiveSchema),
  nin: Joi.array().items(...primitiveSchema),
};

export const logicalOperatorsSchema = {
  or: Joi.object().pattern(/.*/, normalOperatorsSchema),
  and: Joi.object().pattern(/.*/, normalOperatorsSchema),
};

export const clientProvidedMongoOperatorsSchema =
  Joi.object(normalOperatorsSchema).keys(logicalOperatorsSchema);

const embedSchema = Joi.object({
  path: Joi.string().required(),
  select: Joi.string(),
  match: Joi.object().pattern(/.*/, clientProvidedMongoOperatorsSchema),
  populate: Joi.link('...'),
});
export const validateGetRequest: Record<keyof GetRequestArgs, any> = {
  _limit: Joi.number().integer().positive(),
  _page: Joi.number().integer().positive(),
  _sort: Joi.object().pattern(/.*/, Joi.string().valid('asc', 'desc')),
  _select: Joi.string(),
  _embed: [Joi.string(), embedSchema, Joi.array().items(embedSchema)],
};
