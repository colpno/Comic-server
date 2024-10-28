import { NextFunction, Request, Response } from 'express';
import { Schema, ValidationOptions } from 'joi';

import { HTTP_400_BAD_REQUEST } from '~/constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { GetComicById, GetComics } from '../controllers/comic.controller';
import { Comic } from '../types/comic.type';
import { processValidationError, validateGetRequest } from '../utils/validation.util';

type GetComicsSchema = Record<keyof Parameters<GetComics>[0]['query'], Schema>;

export const validateGetComicList = (req: Request, res: Response, next: NextFunction) => {
  const { _select, _embed, _sort, ...commands } = validateGetRequest;
  const allowedTypes: Comic['type'][] = ['manga', 'manhwa', 'manhua'];
  const allowedStatuses: Comic['status'][] = ['ongoing', 'completed', 'hiatus', 'cancelled'];
  const allowedContentRatings: Comic['contentRating'][] = ['suggestive'];
  const allowedEmbeds = ['author', 'artist', 'manga', 'cover_art', 'tag', 'creator'];
  const allowedSorts = [
    'title',
    'year',
    'createdAt',
    'updatedAt',
    'latestUploadedChapter',
    'followedCount',
    'relevance',
  ];

  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const schema = Joi.object<GetComicsSchema>({
    ...commands,
    _sort: Joi.object().pattern(
      Joi.string().valid(...allowedSorts),
      Joi.string().valid('asc', 'desc')
    ),
    _embed: Joi.alternatives().try(
      Joi.string().valid(...allowedEmbeds),
      Joi.object({
        path: Joi.string()
          .valid(...allowedEmbeds)
          .required(),
      }),
      Joi.array().items(
        Joi.object({
          path: Joi.string()
            .valid(...allowedEmbeds)
            .required(),
        })
      )
    ),
    type: Joi.string().valid(...allowedTypes),
    title: Joi.string(),
    status: Joi.string().valid(...allowedStatuses),
    year: Joi.number().integer().positive().greater(1900).less(2100),
    contentRating: Joi.string().valid(...allowedContentRatings),
    createdAt: Joi.string().isoDate(),
    updatedAt: Joi.string().isoDate(),
    hasAvailableChapters: Joi.string().valid('true', 'false'),
  });

  const { error, value } = schema.validate(req.query, options);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  } else {
    req.query = value;
    next();
  }
};

type GetComicByIdQuerySchema = Record<keyof Parameters<GetComicById>[0]['query'], Schema>;
type GetComicByIdBodySchema = Record<keyof Parameters<GetComicById>[0]['params'], Schema>;

export const validateGetComicById = (req: Request, res: Response, next: NextFunction) => {
  const allowedEmbeds = ['author', 'artist', 'manga', 'cover_art', 'tag', 'creator'];

  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const querySchema = Joi.object<GetComicByIdQuerySchema>({
    _embed: Joi.array().items(Joi.string().valid(...allowedEmbeds)),
  });

  const paramSchema = Joi.object<GetComicByIdBodySchema>({
    id: Joi.string().required(),
  });

  const { error: queryError, value: queryValue } = querySchema.validate(req.query, options);
  const { error: paramError, value: paramValue } = paramSchema.validate(req.params, options);

  if (queryError || paramError) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(queryError! || paramError));
  } else {
    req.query = queryValue;
    req.params = paramValue;
    next();
  }
};
