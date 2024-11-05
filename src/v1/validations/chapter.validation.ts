import { NextFunction, Request } from 'express';
import { Schema, ValidationOptions } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '../constants/common.constant';
import { GetChaptersByMangaId } from '../controllers/chapter.controller';
import { Response } from '../types/api.type';
import { processValidationError } from '../utils/validation.util';

type GetChaptersByComicIdSchema = {
  query: Record<keyof Parameters<GetChaptersByMangaId>['0']['query'], Schema>;
  params: Record<keyof Parameters<GetChaptersByMangaId>['0']['params'], Schema>;
};

export const getChaptersByComicId = (req: Request, res: Response, next: NextFunction) => {
  const allowedIncludes = ['emptyPages', 'futurePublishAt', 'externalUrl'];

  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const paramSchema = Joi.object<GetChaptersByComicIdSchema['params']>({
    id: Joi.string().required(),
  });

  const querySchema = Joi.object<GetChaptersByComicIdSchema['query']>({
    _limit: Joi.number().integer().min(1).max(100).default(PAGINATION_PER_PAGE),
    _page: Joi.number().integer().min(1).default(PAGINATION_PAGE),
    _sort: Joi.object().pattern(Joi.string(), Joi.string().valid('asc', 'desc')),
    include: Joi.array().items(Joi.string().valid(...allowedIncludes)),
    exclude: Joi.array().items(Joi.string().valid(...allowedIncludes)),
  });

  const { error: paramError, value: paramValue } = paramSchema.validate(req.params);
  const { error: queryError, value: queryValue } = querySchema.validate(req.query, options);

  if (paramError || queryError) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(paramError! || queryError));
  }

  req.originalParams = req.params;
  req.originalQuery = req.query;
  req.params = paramValue;
  req.query = queryValue;

  next();
};

type GetChapterContentSchema = Record<
  keyof Parameters<GetChaptersByMangaId>['0']['params'],
  Schema
>;

export const getChapterContent = (req: Request, res: Response, next: NextFunction) => {
  const paramSchema = Joi.object<GetChapterContentSchema>({
    id: Joi.string().required(),
  });

  const { error, value } = paramSchema.validate(req.params);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalParams = req.params;
  req.params = value;

  next();
};
