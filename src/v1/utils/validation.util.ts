import { Schema, ValidationResult } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { Embed, FailedResponse, GetRequestArgs } from '../types/api.type';
import {
  MongoDBLogicalOperatorsMap,
  MongoDBUnLogicalOperatorsMap,
} from '../types/mongoOperators.type';

/* 
=====================================================
            Request input validation
=====================================================
*/

export const processValidationError = (error: Exclude<ValidationResult['error'], undefined>) => {
  const content: FailedResponse = {
    reason: error.details.map((detail) => ({
      path: detail.path.join('.'),
      message: detail.message,
    })),
    code: HTTP_400_BAD_REQUEST,
    error: true,
  };
  return content;
};

export const normalOperatorsSchema: Record<keyof MongoDBUnLogicalOperatorsMap, Schema> = {
  like: Joi.string(),
  eq: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()),
  ne: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()),
  exists: Joi.boolean(),
  gt: Joi.alternatives().try(Joi.string(), Joi.number()),
  gte: Joi.alternatives().try(Joi.string(), Joi.number()),
  lt: Joi.alternatives().try(Joi.string(), Joi.number()),
  lte: Joi.alternatives().try(Joi.string(), Joi.number()),
  size: Joi.alternatives().try(
    Joi.number(),
    Joi.object({
      ne: Joi.number(),
      gte: Joi.number(),
      gt: Joi.number(),
      lte: Joi.number(),
      lt: Joi.number(),
    })
  ),
  all: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())),
  in: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())),
  nin: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())),
};

export const logicalOperatorsSchema: Record<keyof MongoDBLogicalOperatorsMap, Schema> = {
  or: Joi.array().items(
    Joi.object().pattern(/.*/, Joi.alternatives().try(Joi.string(), normalOperatorsSchema))
  ),
  and: Joi.array().items(
    Joi.object().pattern(/.*/, Joi.alternatives().try(Joi.string(), normalOperatorsSchema))
  ),
};

export const clientProvidedMongoOperatorsSchema =
  Joi.object(normalOperatorsSchema).keys(logicalOperatorsSchema);

export const embedSchema = Joi.object<Record<keyof Embed, Schema>>({
  path: Joi.string().required(),
  select: Joi.string(),
  match: Joi.object().pattern(
    /.*/,
    Joi.alternatives().try(Joi.string(), clientProvidedMongoOperatorsSchema)
  ),
  populate: Joi.alternatives().try(
    Joi.string(),
    Joi.link('#embed'),
    Joi.array().items(Joi.link('#embed'))
  ),
})
  .id('embed')
  .maxDepth(3);
export const validateGetRequest: Record<keyof GetRequestArgs, Schema> = {
  _limit: Joi.number().integer().positive(),
  _page: Joi.number().integer().positive().greater(0),
  _sort: Joi.object().pattern(/.*/, Joi.string().valid('asc', 'desc')),
  _select: Joi.string(),
  _embed: Joi.alternatives().try(Joi.string(), embedSchema, Joi.array().items(embedSchema)),
};
