import { NextFunction, Request, Response } from 'express';
import Joi, { ValidationOptions } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../constants/httpCode.constant';
import { GetChapterRequest, GetMangaRequest } from '../controllers/mangadex.controller';
import { Manga } from '../types/mangadex.type';
import { processValidationError, validateGetRequest } from '../utils/validation.util';

const includes: GetMangaRequest['query']['includes'] = ['author', 'artist', 'cover_art', 'manga'];
const statuses: Manga['status'][] = ['ongoing', 'completed', 'hiatus', 'cancelled'];
const contentRating: Manga['contentRating'][] = ['suggestive'];
const states: Manga['state'][] = ['published'];

export const validateGetManga = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<GetMangaRequest['query']>({
    _limit: validateGetRequest._limit,
    _page: validateGetRequest._page,
    includes: Joi.string().valid(includes),
    title: Joi.string(),
    lastVolume: Joi.string(),
    lastChapter: Joi.string(),
    status: Joi.string().valid(statuses),
    year: Joi.number().integer().positive().greater(1900).less(2100),
    contentRating: Joi.string().valid(contentRating),
    state: Joi.string().valid(states),
  });

  const options: ValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
  };

  const { error, value } = schema.validate(req.query, options);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  } else {
    req.query = value;
    next();
  }
};

const includesChapter: GetChapterRequest['query']['include'] = [
  'emptyPages',
  'futurePublishAt',
  'externalUrl',
];

export const validateGetChapters = (req: Request, res: Response, next: NextFunction) => {
  const querySchema = Joi.object<GetChapterRequest['query']>({
    include: Joi.string().valid(includesChapter).required(),
    exclude: Joi.string().valid(includesChapter).required(),
  });
  const paramsSchema = Joi.object<GetChapterRequest['params']>({
    id: Joi.string(),
  });

  const options: ValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
  };

  const validatedQueryResult = querySchema.validate(req.query, options);
  const validatedParamsResult = paramsSchema.validate(req.params, options);

  if (validatedQueryResult.error) {
    return res
      .status(HTTP_400_BAD_REQUEST)
      .json(processValidationError(validatedQueryResult.error));
  } else {
    req.query = validatedQueryResult.value;
  }

  if (validatedParamsResult.error) {
    return res
      .status(HTTP_400_BAD_REQUEST)
      .json(processValidationError(validatedParamsResult.error));
  } else {
    req.params = validatedParamsResult.value;
  }

  next();
};
