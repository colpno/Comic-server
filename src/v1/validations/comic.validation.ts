import { NextFunction, Request, Response } from 'express';
import { Schema, ValidationOptions } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { GetComicById, GetComics } from '../controllers/comic.controller';
import { Comic } from '../types/comic.type';
import { MangaListQuery } from '../types/mangadex.type';
import { processValidationError, validateGetRequest } from '../utils/validation.util';

type GetComicListSchema = Record<keyof Parameters<GetComics>[0]['query'], Schema>;

export const getComicList = (req: Request, res: Response, next: NextFunction) => {
  const { _select, _embed, _sort, ...commands } = validateGetRequest;
  const allowedTypes: Comic['type'][] = ['manga', 'manhwa', 'manhua'];
  const allowedStatuses: Comic['status'][] = ['ongoing', 'completed', 'hiatus', 'cancelled'];
  const allowedContentRatings: Comic['contentRating'][] = ['safe', 'suggestive'];
  const allowedTagMode: MangaListQuery['includedTagsMode'][] = ['AND', 'OR'];
  const allowedEmbeds: MangaListQuery['includes'] = [
    'author',
    'artist',
    'manga',
    'cover_art',
    'tag',
  ];
  const allowedSorts: (keyof Exclude<MangaListQuery['order'], undefined>)[] = [
    'title',
    'year',
    'createdAt',
    'updatedAt',
    'latestUploadedChapter',
    'followedCount',
    'relevance',
    'rating',
  ];

  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const schema = Joi.object<GetComicListSchema>({
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
    status: Joi.array().items(Joi.string().valid(...allowedStatuses)),
    year: Joi.number().integer().positive().greater(1900).less(2100),
    contentRating: Joi.string().valid(...allowedContentRatings),
    createdAt: Joi.string().isoDate(),
    updatedAt: Joi.string().isoDate(),
    hasAvailableChapters: Joi.string().valid('true', 'false'),
    includedTags: Joi.array().items(Joi.string()),
    includedTagsMode: Joi.string().valid(...allowedTagMode),
    ids: Joi.array().items(Joi.string()),
    excludedTags: Joi.array().items(Joi.string()),
    excludedTagsMode: Joi.string().valid(...allowedTagMode),
    _limit: Joi.number().integer().positive().max(100),
    _page: Joi.number().integer().positive(),
  });

  const { error, value } = schema.validate(req.query, options);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalQuery = req.query;
  req.query = value;

  next();
};

type GetComicByIdSchema = {
  query: Record<keyof Parameters<GetComicById>[0]['query'], Schema>;
  params: Record<keyof Parameters<GetComicById>[0]['params'], Schema>;
};

export const getComicById = (req: Request, res: Response, next: NextFunction) => {
  const allowedEmbeds: MangaListQuery['includes'] = [
    'author',
    'artist',
    'manga',
    'cover_art',
    'tag',
  ];

  const options: ValidationOptions = {
    stripUnknown: true,
  };

  const paramSchema = Joi.object<GetComicByIdSchema['params']>({
    id: Joi.string().required(),
  });

  const querySchema = Joi.object<GetComicByIdSchema['query']>({
    _embed: Joi.array().items(Joi.string().valid(...allowedEmbeds)),
  });

  const { error: queryError, value: queryValue } = querySchema.validate(req.query, options);
  const { error: paramError, value: paramValue } = paramSchema.validate(req.params, options);

  if (queryError || paramError) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(queryError! || paramError));
  }

  req.originalParams = req.params;
  req.originalQuery = req.query;
  req.query = queryValue;
  req.params = paramValue;

  next();
};
