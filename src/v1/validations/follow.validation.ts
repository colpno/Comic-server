import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import {
  AddFollow,
  GetFollow,
  GetFollowList,
  RemoveFollow,
} from '../controllers/follow.controller';
import { Follow } from '../types/follow.type';
import { MangaListQuery } from '../types/mangadex.type';
import { processValidationError } from '../utils/validation.util';
import { validationOptions } from './';
import { mangadexMangaListSchema } from './variables';

type GetFollowListSchema = Record<keyof Parameters<GetFollowList>[0]['query'], Schema>;

export const getFollowList = (req: Request, res: Response, next: NextFunction) => {
  const comicAllowedSorts: (keyof Follow)[] = ['addedAt', 'createdAt', 'updatedAt'];
  const allowedComicEmbeds: MangaListQuery['includes'] = [
    'author',
    'artist',
    'manga',
    'cover_art',
    'tag',
  ];

  const schema = Joi.object<GetFollowListSchema>({
    _select: Joi.string(),
    _embed: Joi.alternatives().try(
      Joi.string().valid('following'),
      Joi.object({
        path: Joi.string().valid('following').required(),
        match: Joi.object(mangadexMangaListSchema),
        populate: Joi.string().valid(...allowedComicEmbeds),
      })
    ),
    _limit: Joi.number().integer().min(1).max(100),
    _page: Joi.number().integer().positive(),
    _sort: Joi.object().pattern(
      Joi.string().valid(...comicAllowedSorts),
      Joi.string().valid('asc', 'desc')
    ),
    createdAt: Joi.string().isoDate(),
    updatedAt: Joi.string().isoDate(),
    follower: Joi.string(),
    following: Joi.string(),
    addedAt: Joi.string().isoDate(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalQuery = req.query;
  req.query = value;

  next();
};

type GetFollowSchema = {
  query: Record<keyof Parameters<GetFollow>[0]['query'], Schema>;
  params: Record<keyof Parameters<GetFollow>[0]['params'], Schema>;
};

export const getFollow = (req: Request, res: Response, next: NextFunction) => {
  const allowedComicEmbeds: MangaListQuery['includes'] = [
    'author',
    'artist',
    'manga',
    'cover_art',
    'tag',
  ];

  const paramSchema = Joi.object<GetFollowSchema['params']>({
    following: Joi.string().required(),
  });

  const querySchema = Joi.object<GetFollowSchema['query']>({
    _select: Joi.string(),
    _embed: Joi.alternatives().try(
      Joi.string().valid('following'),
      Joi.object({
        path: Joi.string().valid('following').required(),
        match: Joi.object(mangadexMangaListSchema),
        populate: Joi.string().valid(...allowedComicEmbeds),
      })
    ),
    createdAt: Joi.string().isoDate(),
    updatedAt: Joi.string().isoDate(),
    follower: Joi.string(),
    following: Joi.string(),
    addedAt: Joi.string().isoDate(),
  });

  const { error: queryError, value: queryValue } = querySchema.validate(
    req.query,
    validationOptions
  );
  const { error: paramError, value: paramValue } = paramSchema.validate(
    req.params,
    validationOptions
  );

  if (queryError || paramError) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(queryError! || paramError));
  }

  req.originalParams = req.params;
  req.originalQuery = req.query;
  req.query = queryValue;
  req.params = paramValue;

  next();
};

type AddFollowSchema = Record<keyof Parameters<AddFollow>[0]['body'], Schema>;

export const addFollow = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<AddFollowSchema>({
    followingId: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalBody = req.body;
  req.body = value;

  next();
};

type RemoveFollowSchema = Record<keyof Parameters<RemoveFollow>[0]['params'], Schema>;

export const removeFollow = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<RemoveFollowSchema>({
    id: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(HTTP_400_BAD_REQUEST).json(processValidationError(error));
  }

  req.originalParams = req.params;
  req.params = value;

  next();
};
