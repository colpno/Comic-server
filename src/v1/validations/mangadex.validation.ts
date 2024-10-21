import { NextFunction, Request, Response } from 'express';

import { Joi } from '../configs/joi.conf';
import { HTTP_400_BAD_REQUEST } from '../constants/httpCode.constant';
import { GetChapterRequest, GetMangaRequest } from '../controllers/mangadex.controller';
import { Manga } from '../types/mangadex.type';
import { processValidationError, validateGetRequest } from '../utils/validation.util';

export const validateGetManga = (req: Request, res: Response, next: NextFunction) => {
  const includes: GetMangaRequest['query']['includes'] = ['author', 'artist', 'cover_art', 'manga'];
  const statuses: Manga['status'][] = ['ongoing', 'completed', 'hiatus', 'cancelled'];
  const contentRating: Manga['contentRating'][] = ['suggestive'];
  const states: Manga['state'][] = ['published'];

  const schema = Joi.object<GetMangaRequest['query']>({
    _limit: validateGetRequest._limit,
    _page: validateGetRequest._page,
    includes: Joi.string().valid(...includes),
    title: Joi.string(),
    lastVolume: Joi.string(),
    lastChapter: Joi.string(),
    status: Joi.string().valid(...statuses),
    year: Joi.number().integer().positive().greater(1900).less(2100),
    contentRating: Joi.string().valid(...contentRating),
    state: Joi.string().valid(...states),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  } else {
    req.query = value;
    next();
  }
};

export const validateGetChapters = (req: Request, res: Response, next: NextFunction) => {
  const includesChapter: GetChapterRequest['query']['include'] = [
    'emptyPages',
    'futurePublishAt',
    'externalUrl',
  ];

  const querySchema = Joi.object<GetChapterRequest['query']>({
    include: Joi.string().valid(...includesChapter),
    exclude: Joi.string().valid(...includesChapter),
  });
  const paramsSchema = Joi.object<GetChapterRequest['params']>({
    id: Joi.string(),
  });

  const validatedQueryResult = querySchema.validate(req.query);
  const validatedParamsResult = paramsSchema.validate(req.params);

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
