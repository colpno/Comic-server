import { NextFunction, Request } from 'express';
import { Schema, ValidationOptions } from 'joi';

import { PAGINATION_PAGE, PAGINATION_PER_PAGE } from '../../constants/global.constant';
import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { GetChaptersByMangaId } from '../controllers/chapter.controller';
import { Response } from '../types/api.type';
import { processValidationError } from '../utils/validation.util';

type GetChaptersByComicIdSchema = {
  query: Record<keyof Parameters<GetChaptersByMangaId>['0']['query'], Schema>;
  params: Record<keyof Parameters<GetChaptersByMangaId>['0']['params'], Schema>;
};

export const validateGetChaptersByComicId = (req: Request, res: Response, next: NextFunction) => {
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

  const { error: paramError } = paramSchema.validate(req.params);
  const { error: queryError } = querySchema.validate(req.query, options);

  if (paramError || queryError) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(paramError! || queryError));
  } else {
    next();
  }
};

type GetChapterContentSchema = Record<
  keyof Parameters<GetChaptersByMangaId>['0']['params'],
  Schema
>;

export const validateGetChapterContent = (req: Request, res: Response, next: NextFunction) => {
  const paramSchema = Joi.object<GetChapterContentSchema>({
    id: Joi.string().required(),
  });

  const { error } = paramSchema.validate(req.params);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  } else {
    next();
  }
};
