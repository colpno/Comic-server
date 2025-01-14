import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

import { HTTP_400_BAD_REQUEST } from '../../constants/httpCode.constant';
import { Joi } from '../configs/joi.conf';
import { AddFollow, GetFollowList, RemoveFollow } from '../controllers/follow.controller';
import { Follow } from '../types/follow.type';
import { MangaListQuery } from '../types/mangadex.type';
import { normalOperatorsSchema, processValidationError } from '../utils/validation.util';
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
    following: Joi.object({
      all: normalOperatorsSchema.all,
      in: normalOperatorsSchema.in,
      nin: normalOperatorsSchema.nin,
    }),
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
