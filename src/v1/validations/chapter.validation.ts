import { NextFunction, Request } from 'express';
import { Schema } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { GetChaptersByMangaId } from '../controllers/chapter.controller';
import { Response } from '../types/api.type';
import { Chapter } from '../types/chapter.type';
import { processValidationError } from '../utils/validation.util';
import { validationOptions } from './';

type GetChaptersByComicIdSchema = {
  query: Record<keyof Parameters<GetChaptersByMangaId>['0']['query'], Schema>;
  params: Record<keyof Parameters<GetChaptersByMangaId>['0']['params'], Schema>;
};

export const getChaptersByComicId = (req: Request, res: Response, next: NextFunction) => {
  const allowedIncludes = ['emptyPages', 'futurePublishAt', 'externalUrl'];
  const allowedSort: (keyof Chapter)[] = [
    'createdAt',
    'updatedAt',
    'publishAt',
    'readableAt',
    'volume',
    'chapter',
  ];

  const paramSchema = Joi.object<GetChaptersByComicIdSchema['params']>({
    id: Joi.string().required(),
  });

  const querySchema = Joi.object<GetChaptersByComicIdSchema['query']>({
    _limit: Joi.number().integer().min(1).max(500),
    _page: Joi.number().integer().min(1),
    _sort: Joi.object().pattern(
      Joi.string().valid(...allowedSort),
      Joi.string().valid('asc', 'desc')
    ),
    include: Joi.array().items(Joi.string().valid(...allowedIncludes)),
    exclude: Joi.array().items(Joi.string().valid(...allowedIncludes)),
  });

  const { error: paramError, value: paramValue } = paramSchema.validate(
    req.params,
    validationOptions
  );
  const { error: queryError, value: queryValue } = querySchema.validate(
    req.query,
    validationOptions
  );

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

  const { error, value } = paramSchema.validate(req.params, validationOptions);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalParams = req.params;
  req.params = value;

  next();
};
