import { NextFunction, Request, Response } from 'express';
import { Schema, ValidationOptions } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { GetComic, GetComics } from '../controllers/comic.controller';
import { MangaListQuery } from '../types/mangadex.type';
import { processValidationError, validateGetRequest } from '../utils/validation.util';
import { mangadexMangaListSchema } from './variables';

type GetComicListSchema = Record<keyof Parameters<GetComics>[0]['query'], Schema>;

export const getComicList = (req: Request, res: Response, next: NextFunction) => {
  const { _select, _embed, _sort, ...commands } = validateGetRequest;
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
      Joi.array().items(Joi.string().valid(...allowedEmbeds))
    ),
    _limit: Joi.number().integer().positive().max(100),
    _page: Joi.number().integer().positive(),
    ...mangadexMangaListSchema,
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
  query: Record<keyof Parameters<GetComic>[0]['query'], Schema>;
  params: Record<keyof Parameters<GetComic>[0]['params'], Schema>;
};

export const getComicByTitle = (req: Request, res: Response, next: NextFunction) => {
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
    title: Joi.string().required(),
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
